from django.db import models
from django.conf import settings
from products.models import Product

# Create your models here.

class Review(models.Model):
    RATING_CHOICES = [(i, f"{i} Stars") for i in range(1, 6)]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name="reviews"
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="reviews",
        null=True,
        blank=True 
    )
    order_id = models.CharField(max_length=50, blank=True, null=True)
    rating = models.IntegerField(choices=RATING_CHOICES, default=5)
    title = models.CharField(max_length=150, blank=True)
    comment = models.TextField()
    
    # Optional flags for moderation or spotlighting top reviews
    is_approved = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        target = f"Product #{self.product_id}" if self.product else "General"
        return f"{self.rating}★ by {self.user.username} on {target}"