from django.shortcuts import render

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Complaint
from .serializers import ComplaintSerializer, AdminComplaintUpdateSerializer

class ComplaintViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Staff/Admins see all complaints; regular users see only their own
        if user.is_staff or user.is_superuser:
            return Complaint.objects.all().select_related("user")
        return Complaint.objects.filter(user=user)

    def get_serializer_class(self):
        if self.action in ["update", "partial_update"] and (self.request.user.is_staff or self.request.user.is_superuser):
            return AdminComplaintUpdateSerializer
        return ComplaintSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        if self.request.user.is_staff:
            serializer.save(replied_by=self.request.user)
        else:
            serializer.save()
