from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "username",
            "product",
            "order_id",
            "rating",
            "title",
            "comment",
            "is_approved",
            "is_featured",
            "created_at",
        ]
        read_only_fields = ["id", "username", "is_approved", "is_featured", "created_at"]