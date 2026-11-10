from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Order
from .serializers import (
    OrderSerializer,
    OrderCreateSerializer,
    CustomerOrderUpdateSerializer,
)


class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post", "patch", "delete", "head"]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Order.objects.all().prefetch_related("items")
        return Order.objects.filter(user=user).prefetch_related("items")

    def get_serializer_class(self):
        if self.action == "create":
            return OrderCreateSerializer
        # Customers editing their own order: restricted to status=cancelled only
        if self.action in ("update", "partial_update"):
            if not (self.request.user.is_staff or self.request.user.is_superuser):
                return CustomerOrderUpdateSerializer
        return OrderSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save(user=request.user)
        return Response(OrderSerializer(order).data, status=201)

    # 🟢 ALLOW DELETION ONLY FOR CANCELLED ORDERS
    def destroy(self, request, *args, **kwargs):
        order = self.get_object()
        if order.status != "cancelled":
            return Response(
                {"detail": "Only cancelled orders can be permanently deleted."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        order.delete()
        return Response(
            {"detail": "Order deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )