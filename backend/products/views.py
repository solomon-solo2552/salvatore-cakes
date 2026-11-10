from rest_framework import viewsets, permissions, filters, parsers
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from django.db import models
from django.db.models import Avg, Count, Q

from .models import Category, Product
from .serializers import (
    CategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer,
)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = "slug"


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related("category")
    lookup_field = "slug"
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    filterset_fields = ["category__slug", "is_featured", "is_eggless"]
    search_fields = ["name", "description"]
    ordering_fields = ["price", "created_at", "name"]

    def get_permissions(self):
        """
        Read actions (list, retrieve) → public (AllowAny).
        Write actions (create, update, partial_update, destroy) → admin only.
        This prevents anonymous visitors from creating/editing/deleting products.
        """
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        # Annotate avg_rating and review_count in one query - no N+1
        queryset = (
            super()
            .get_queryset()
            .annotate(
                avg_rating=Avg(
                    "reviews__rating",
                    filter=Q(reviews__is_approved=True),
                ),
                review_count=Count(
                    "reviews",
                    filter=Q(reviews__is_approved=True),
                ),
            )
        )

        # Only apply the "hide Special Experiences" rule when LISTING products.
        # Never apply it for retrieve/update/destroy - otherwise the Tasting
        # Box product (which lives in "Special Experiences") would 404 on
        # direct fetch, breaking the /tastig-box page.
        if self.action == "list":
            requested_category = self.request.query_params.get("category__slug")
            if requested_category != "special-experiences":
                queryset = queryset.exclude(category__slug="special-experiences")
            

        # 1. Search parameter filter (checks both name and description)
        search_param = self.request.query_params.get("search",None)
        if search_param:
            queryset = queryset.filter(
                models.Q(name__icontains=search_param) |
                models.Q(description__icontains=search_param)
            )

        # 2. Flexible Flavor Filter
        flavor_param = self.request.query_params.get("flavor", None)
        if flavor_param:
            raw_flavor = flavor_param.strip()
            underscore_flavor = raw_flavor.replace("-", "_").lower()
            hyphen_flavor = raw_flavor.replace("_", "-").lower()
            space_flavor = raw_flavor.replace("_", " ").replace("-", " ")

            queryset = queryset.filter(
                models.Q(flavor__iexact=raw_flavor) |
                models.Q(flavor__iexact=underscore_flavor) |
                models.Q(flavor__iexact=hyphen_flavor) |
                models.Q(name__icontains=space_favor) |
                models.Q(description__icontains=space_flavor)
            )

        return queryset


    def get_serializer_class(self):
        if self.action == "retrieve":
            return ProductDetailSerializer
        return ProductListSerializer


    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)

        serializer = self.get_serializer(data=request.data, many=is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=201)