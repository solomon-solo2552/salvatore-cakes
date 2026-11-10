from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["phone", "address_line", "city", "postal_code", "country", "profile_picture"]


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "is_staff", "is_superuser", "profile"]

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("profile", None)
        instance = super().update(instance, validated_data)
        if profile_data:
            Profile.objects.filter(user=instance).update(**profile_data)
        return instance


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    email = serializers.EmailField(required=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    address_line = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True)
    postal_code = serializers.CharField(required=False, allow_blank=True)
    country = serializers.CharField(required=False, allow_blank=True)
    profile_picture = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "first_name",
            "last_name",
            "phone",
            "address_line",
            "city",
            "postal_code",
            "country",
            "profile_picture",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_email(self, value):
        """Prevent duplicate email registration (case-insensitive)."""
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )
        return value

    def create(self, validated_data):
        phone = validated_data.pop("phone", "")
        address_line = validated_data.pop("address_line", "")
        city = validated_data.pop("city", "")
        postal_code = validated_data.pop("postal_code", "")
        country = validated_data.pop("country", "")
        profile_picture = validated_data.pop("profile_picture", None)

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
        )

        profile, _ = Profile.objects.get_or_create(user=user)
        profile.phone = phone
        profile.address_line = address_line
        profile.city = city
        profile.postal_code = postal_code
        profile.country = country

        if profile_picture:
            profile.profile_picture = profile_picture

        profile.save()

        return user