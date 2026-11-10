import logging
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings

from .models import Order

logger = logging.getLogger(__name__)

# Frontend base URL for the "track your order" link.
# Falls back to localhost in dev. Set FRONTEND_BASE_URL in .env for prod.
FRONTEND_URL = getattr(
    settings, "FRONTEND_BASE_URL", "http://localhost:3000"
)

# Statuses that trigger a customer email.
# Add/remove based on how much email you want to send.
STATUS_NOTIFICATIONS = {
    "confirmed": "Your order is confirmed",
    "baking": "We've started baking your cake",
    "out_for_delivery": "Your order is on the way",
    "delivered": "Order delivered — we hope you love it",
    "cancelled": "Order cancelled",
}


def _format_items(order):
    """Format order items as a simple receipt line list."""
    lines = []
    for item in order.items.all():
        lines.append(
            f"- {item.product_name} × {item.quantity}  ${item.subtotal:.2f}"
        )
    return "\n".join(lines) if lines else "(no items)"


def _format_address(order):
    return (
        f"{order.full_name}\n"
        f"{order.address_line}\n"
        f"{order.city}\n"
        f"{order.postal_code}\n"
        f"{order.country}"
    )


def _send_order_email(order, subject, intro_message):
    """Helper to build and send the confirmation email.
    Logs on failure — never raises (won't break the request)."""
    if not order.user or not order.user.email:
        logger.warning(
            f"Order #{order.id}: no recipient email, skipping notification"
        )
        return

    items_text = _format_items(order)
    address_text = _format_address(order)
    delivery_date = (
        order.delivery_date.strftime("%B %d, %Y")
        if order.delivery_date
        else "Standard delivery (2-3 days)"
    )

    body = f"""Hi {order.full_name.split()[0] if order.full_name else 'there'},

{intro_message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ORDER #{order.id}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{items_text}

Total: ${order.total_amount:.2f}
Delivery Date: {delivery_date}
Payment Method: {order.get_payment_method_display()}

Shipping Address:
{address_text}

Track your order at:
{FRONTEND_URL}/account/orders

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Handcrafted with Fine Stone-Ground Tuscan Ingredients
House of Salvatore Bakery · Est. 1864
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""

    try:
        send_mail(
            subject=subject,
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[order.user.email],
            fail_silently=False,
        )
        logger.info(f"Order #{order.id}: sent '{subject}' to {order.user.email}")
    except Exception as e:
        # Log the real error so you can debug — but never break the request.
        logger.error(
            f"Failed to send order #{order.id} email to {order.user.email}: {e}"
        )


@receiver(pre_save, sender=Order)
def _track_previous_status(sender, instance, **kwargs):
    """Store the previous status on the instance for post_save to compare."""
    if not instance.pk:
        instance._previous_status = None
        return
    try:
        previous = Order.objects.get(pk=instance.pk)
        instance._previous_status = previous.status
    except Order.DoesNotExist:
        instance._previous_status = None


@receiver(post_save, sender=Order)
def send_order_email(sender, instance, created, **kwargs):
    """Send the appropriate email on order creation or status change."""
    if created:
        _send_order_email(
            order=instance,
            subject=f"Order #{instance.id} Confirmed — Salvatore Cakes",
            intro_message=(
                "Thank you for your order! Our bakers have received it and "
                "will begin preparing your cakes shortly. We'll notify you "
                "as your order progresses."
            ),
        )
        return

    # Status change email — only for statuses in the notification list
    previous_status = getattr(instance, "_previous_status", None)
    if previous_status and previous_status != instance.status:
        if instance.status in STATUS_NOTIFICATIONS:
            subject_line = STATUS_NOTIFICATIONS[instance.status]
            _send_order_email(
                order=instance,
                subject=f"Order #{instance.id} — {subject_line}",
                intro_message=(
                    f"{subject_line}. Thank you for choosing Salvatore Cakes!"
                ),
            )