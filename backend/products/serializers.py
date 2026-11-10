from rest_framework import serializers
from .models import Category, Product
from feedback.models import Review
from feedback.serializers import ReviewSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description"]


class ProductListSerializer(serializers.ModelSerializer):
    category = serializers.ReadOnlyField(source="category.name")
    category_slug = serializers.SlugField(
        write_only=True,
        required=False,
        allow_blank=True,
        help_text="Category slug (e.g. 'celebration-cakes'). Write-only; use this for create/update.",
    )
    current_price = serializers.ReadOnlyField()
    in_stock = serializers.ReadOnlyField()
    # Reads from the queryset annotation — no extra queries
    average_rating = serializers.FloatField(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "category", "category_slug", "flavor", "price",
            "discount_price", "current_price", "image", "is_featured",
            "is_eggless", "in_stock", "stock", "weight_kg", "average_rating",
        ]

    def _resolve_category(self, validated_data):
        """Pop category_slug from validated_data and set the FK on the instance."""
        slug = validated_data.pop("category_slug", None)
        if slug:
            try:
                validated_data["category"] = Category.objects.get(slug=slug)
            except Category.DoesNotExist:
                raise serializers.ValidationError(
                    {"category_slug": f"No category found with slug '{slug}'."}
                )
        return validated_data

    def create(self, validated_data):
        validated_data = self._resolve_category(validated_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data = self._resolve_category(validated_data)
        return super().update(instance, validated_data)


class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_slug = serializers.SlugField(
        write_only=True,
        required=False,
        allow_blank=True,
        help_text="Category slug (e.g. 'celebration-cakes'). Write-only; use this for create/update.",
    )
    reviews = serializers.SerializerMethodField()
    current_price = serializers.ReadOnlyField()
    in_stock = serializers.ReadOnlyField()
    # Reads from the queryset annotation — no extra queries
    average_rating = serializers.FloatField(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "category", "category_slug", "description",
            "flavor", "price", "discount_price", "current_price", "image", "stock",
            "in_stock", "is_featured", "is_eggless", "weight_kg",
            "reviews", "average_rating", "created_at",
        ]

    def get_reviews(self, obj):
        # This is called for a SINGLE product detail — one extra query is fine.
        # We intentionally do NOT annotate this because it's per-object.
        reviews = obj.reviews.filter(is_approved=True).select_related("user")
        return ReviewSerializer(reviews, many=True).data

    def _resolve_category(self, validated_data):
        slug = validated_data.pop("category_slug", None)
        if slug:
            try:
                validated_data["category"] = Category.objects.get(slug=slug)
            except Category.DoesNotExist:
                raise serializers.ValidationError(
                    {"category_slug": f"No category found with slug '{slug}'."}
                )
        return validated_data

    def create(self, validated_data):
        validated_data = self._resolve_category(validated_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data = self._resolve_category(validated_data)
        return super().update(instance, validated_data)