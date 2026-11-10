from decimal import Decimal
from django.db import transaction
from rest_framework import serializers
from products.models import Product
from .models import Order, OrderItem


class OrderItemInputSerializer(serializers.Serializer):
    product_id = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    product_name = serializers.CharField(required=False, allow_blank=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    quantity = serializers.IntegerField(min_value=1)
    details = serializers.CharField(required=False, allow_blank=True)


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_name", "unit_price", "quantity", "subtotal"]
        read_only_fields = ["id", "product_name", "unit_price", "subtotal"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "status", "full_name", "phone", "address_line", "city",
            "postal_code", "country", "delivery_date", "payment_method", "notes",
            "total_amount", "items", "created_at",
        ]
        read_only_fields = ["id", "total_amount", "created_at"]


class CustomerOrderUpdateSerializer(serializers.ModelSerializer):
    """
    Used when a customer (non-staff) updates their own order.
    Only allows cancelling. Everything else is read-only.
    """
    class Meta:
        model = Order
        fields = ["status"]
        read_only_fields = [
            "full_name", "phone", "address_line", "city",
            "postal_code", "country", "delivery_date",
            "payment_method", "notes", "total_amount",
        ]

    def validate_status(self, value):
        if value != "cancelled":
            raise serializers.ValidationError(
                "Customers can only cancel their own orders."
            )
        instance = self.instance
        if instance and instance.status not in ("pending", "confirmed"):
            raise serializers.ValidationError(
                f"Orders in '{instance.status}' state can no longer be cancelled."
            )
        return value


class OrderCreateSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150)
    phone = serializers.CharField(max_length=20)
    address_line = serializers.CharField(max_length=255)
    city = serializers.CharField(max_length=100)
    postal_code = serializers.CharField(max_length=20)
    country = serializers.CharField(max_length=100)
    delivery_date = serializers.DateField(required=False, allow_null=True)
    payment_method = serializers.CharField(max_length=20, required=False, default="cod")
    notes = serializers.CharField(required=False, allow_blank=True)
    items = OrderItemInputSerializer(many=True)

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop("items")
        user = validated_data.pop("user", None) or self.context["request"].user

        order = Order.objects.create(user=user, **validated_data)

        total = Decimal("0.00")
        for item in items_data:
            pid = item.get("product_id")

            # 🚨 SECURITY: reject items without a valid numeric product_id.
            # Previously, custom items used a client-supplied price → $0.01 cakes.
            if not pid or not str(pid).isdigit():
                raise serializers.ValidationError(
                    {"items": f"Invalid product_id: {pid!r}. All orders must reference existing catalog products."}
                )

            # Lock the row to prevent concurrent oversell
            product = Product.objects.select_for_update().filter(id=int(pid)).first()
            if not product:
                raise serializers.ValidationError(
                    {"items": f"Product #{pid} not found."}
                )

            quantity = item["quantity"]
            if product.stock < quantity:
                raise serializers.ValidationError(
                    {"items": f"{product.name} — only {product.stock} in stock."}
                )

            unit_price = product.current_price  # Decimal; property handles discount
            product_name = product.name
            details = item.get("details", "")
            final_name = f"{product_name} ({details})" if details else product_name

            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=final_name,
                unit_price=unit_price,
                quantity=quantity,
            )

            # Decrement stock atomically
            product.stock -= quantity
            product.save(update_fields=["stock"])

            total += unit_price * quantity

        order.total_amount = total
        order.save(update_fields=["total_amount"])
        return order