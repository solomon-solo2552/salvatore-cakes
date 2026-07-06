from django.core.management.base import BaseCommand
from products.models import Category, Product


CATEGORIES = [
    ("Birthday Cakes", "Custom cakes for birthday celebrations."),
    ("Wedding Cakes", "Elegant tiered cakes for weddings."),
    ("Cupcakes", "Freshly baked single-serve cupcakes."),
    ("Cheesecakes", "Rich and creamy baked cheesecakes."),
    ("Eggless Cakes", "Delicious cakes made without eggs."),
]

PRODUCTS = [
    ("Classic Chocolate Truffle", "Birthday Cakes", "chocolate", 24.99, None, 1.0, True, False),
    ("Red Velvet Delight", "Birthday Cakes", "red_velvet", 27.99, 22.99, 1.0, True, False),
    ("Vanilla Bean Dream", "Birthday Cakes", "vanilla", 21.99, None, 1.0, False, True),
    ("Three-Tier Rose Wedding Cake", "Wedding Cakes", "vanilla", 149.99, None, 4.0, True, False),
    ("Elegant Ivory Wedding Cake", "Wedding Cakes", "vanilla", 179.99, 159.99, 5.0, True, False),
    ("Chocolate Chip Cupcake (Box of 6)", "Cupcakes", "chocolate", 12.99, None, 0.5, False, False),
    ("Red Velvet Cupcake (Box of 6)", "Cupcakes", "red_velvet", 13.99, None, 0.5, False, False),
    ("New York Cheesecake", "Cheesecakes", "cheesecake", 29.99, None, 1.2, True, False),
    ("Strawberry Swirl Cheesecake", "Cheesecakes", "cheesecake", 31.99, 27.99, 1.2, False, False),
    ("Eggless Chocolate Fudge Cake", "Eggless Cakes", "chocolate", 25.99, None, 1.0, False, True),
    ("Eggless Fruit Cake", "Eggless Cakes", "fruit", 26.99, None, 1.0, False, True),
    ("Salted Caramel Cake", "Birthday Cakes", "other", 28.99, None, 1.0, True, False),
]


class Command(BaseCommand):
    help = "Seed the database with sample Salvatore Cakes categories and products."

    def handle(self, *args, **options):
        cat_map = {}
        for name, desc in CATEGORIES:
            cat, _ = Category.objects.get_or_create(name=name, defaults={"description": desc})
            cat_map[name] = cat
        self.stdout.write(self.style.SUCCESS(f"Categories ready: {len(cat_map)}"))

        created_count = 0
        for name, cat_name, flavor, price, discount, weight, featured, eggless in PRODUCTS:
            _, created = Product.objects.get_or_create(
                name=name,
                defaults={
                    "category": cat_map[cat_name],
                    "flavor": flavor,
                    "price": price,
                    "discount_price": discount,
                    "weight_kg": weight,
                    "is_featured": featured,
                    "is_eggless": eggless,
                    "stock": 25,
                    "description": f"A delicious {name.lower()}, baked fresh daily at Salvatore Cakes.",
                },
            )
            if created:
                created_count += 1

        self.stdout.write(self.style.SUCCESS(f"Products created: {created_count}"))
