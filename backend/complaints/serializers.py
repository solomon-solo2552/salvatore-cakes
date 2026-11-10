from rest_framework import serializers
from .models import Complaint

class ComplaintSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    user_email = serializers.CharField(source="user.email", read_only=True)

    class Meta:
        model = Complaint
        fields = [
            "id",
            "username",
            "user_email",
            "order_id",
            "category",
            "subject",
            "message",
            "admin_reply",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "admin_reply", "status", "created_at", "updated_at"]

class AdminComplaintUpdateSerializer(serializers.ModelSerializer):
    """Used specifically by staff/admin to post replies and update ticket status."""
    class Meta:
        model = Complaint
        fields = ["admin_reply", "status"]