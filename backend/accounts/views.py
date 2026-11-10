from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserSerializer
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.core.cache import cache
from django.core.mail import send_mail
from django.conf import settings
import random
import logging

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Registration
# ---------------------------------------------------------------------------
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user": UserSerializer(user, context={"request": request}).data,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            status=201,
        )


# ---------------------------------------------------------------------------
# Profile
# ---------------------------------------------------------------------------
class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        serializer = UserSerializer(request.user, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        user = request.user

        profile_picture = (
            request.FILES.get("profile_picture")
            or request.FILES.get("profile.profile_picture")
        )

        if profile_picture:
            user.profile.profile_picture = profile_picture
            user.profile.save()

        serializer = UserSerializer(
            user, data=request.data, partial=True, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        return self.patch(request)


# ---------------------------------------------------------------------------
# Forgot Password (OTP request) — HARDENED
# ---------------------------------------------------------------------------
# Constants for OTP behavior
OTP_CACHE_PREFIX = "otp_"
OTP_ATTEMPTS_PREFIX = "otp_attempts_"
OTP_TTL_SECONDS = 300            # OTP valid for 5 minutes
OTP_MAX_ATTEMPTS = 5             # Max 5 wrong tries before lockout
OTP_LOCKOUT_TTL = 300            # Lockout lasts 5 minutes

# Same message is returned whether email exists or not — prevents enumeration.
FORGOT_PASSWORD_RESPONSE = (
    "If an account exists for that email, a 6-digit verification code has been sent."
)


class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip()
        if not email:
            return Response(
                {"error": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 🔒 Always return the same response, regardless of whether the email exists.
        # Prevents attackers from using this endpoint to enumerate registered emails.
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response({"detail": FORGOT_PASSWORD_RESPONSE}, status=status.HTTP_200_OK)
        except User.MultipleObjectsReturned:
            # Shouldn't happen anymore (duplicate email blocked in registration),
            # but guard against legacy data. Pick the first — do not leak.
            user = User.objects.filter(email__iexact=email).first()
            if not user:
                return Response({"detail": FORGOT_PASSWORD_RESPONSE}, status=status.HTTP_200_OK)

        # Issue a fresh OTP and reset the attempt counter for this email
        otp = f"{random.randint(100000, 999999)}"
        cache.set(f"{OTP_CACHE_PREFIX}{user.email}", otp, timeout=OTP_TTL_SECONDS)
        cache.delete(f"{OTP_ATTEMPTS_PREFIX}{user.email}")

        subject = "Reset Your Password - Salvatore Cakes"
        message = (
            f"Your 6-digit verification code is: {otp}\n\n"
            f"This code expires in {OTP_TTL_SECONDS // 60} minutes.\n"
            f"If you did not request a password reset, you can ignore this email.\n"
        )

        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
        except Exception as e:
            # Log the failure so it's visible in the terminal - but never
            # propagate it to the user. Enumeration protection requires
            # a consistent 200 response regardless of email delivery.
            print("EMAIL ERROR:", type(e).__name__, e)

        return Response({"detail": FORGOT_PASSWORD_RESPONSE}, status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# Reset Password (OTP verification + new password) — HARDENED
# ---------------------------------------------------------------------------
class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = (request.data.get("email") or "").strip()
        otp = (request.data.get("otp") or "").strip()
        new_password = request.data.get("new_password") or ""

        if not all([email, otp, new_password]):
            return Response(
                {"error": "Missing required fields."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.filter(email__iexact=email).first()
        if not user:
            # Same generic message — do not reveal whether email exists.
            return Response(
                {"error": "Invalid verification code."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 🔒 Rate limit: block after too many wrong attempts
        attempts_key = f"{OTP_ATTEMPTS_PREFIX}{user.email}"
        attempts = cache.get(attempts_key, 0)
        if attempts >= OTP_MAX_ATTEMPTS:
            return Response(
                {
                    "error": (
                        "Too many incorrect attempts. Please request a new "
                        "verification code and try again."
                    )
                },
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        # Compare OTP
        otp_key = f"{OTP_CACHE_PREFIX}{user.email}"
        saved_otp = cache.get(otp_key)

        if not saved_otp:
            return Response(
                {"error": "Verification code has expired. Please request a new one."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if otp != saved_otp:
            # Increment attempt counter
            cache.set(attempts_key, attempts + 1, timeout=OTP_LOCKOUT_TTL)
            return Response(
                {"error": "Invalid verification code."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ✅ Success — rotate password and clean up cache
        user.set_password(new_password)
        user.save()
        cache.delete(otp_key)
        cache.delete(attempts_key)

        return Response(
            {"detail": "Password has been updated successfully!"},
            status=status.HTTP_200_OK,
        )


# ---------------------------------------------------------------------------
# Me (current user)
# ---------------------------------------------------------------------------
class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user