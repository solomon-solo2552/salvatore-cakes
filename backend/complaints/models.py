from django.db import models
from django.conf import settings

class Complaint(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending Review"),
        ("in_progress", "In Progress"),
        ("resolved", "Resolved"),
        ("closed", "Closed"),
    ]

    CATEGORY_CHOICES = [
        ("delivery", "Delivery / Delay"),
        ("quality", "Cake Quality / Taste"),
        ("damage", "Damaged / Packaging Issue"),
        ("billing", "Payment / Refund"),
        ("custom_order", "Custom Cake / Piping Request"),
        ("general", "General Feedback"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name="complaints"
    )
    order_id = models.CharField(max_length=50, blank=True, null=True, help_text="Optional linked Order ID")
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default="general")
    subject = models.CharField(max_length=200)
    message = models.TextField()
    
    # Admin resolution fields
    admin_reply = models.TextField(blank=True, null=True)
    replied_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name="resolved_complaints"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"[{self.get_status_display()}] {self.subject} - {self.user.username}"