from django.core.management.base import BaseCommand
from products.models import Category, Product


CATEGORIES = [
    ("Celebration Cakes",              "Showstopping cakes for birthdays, anniversaries, and milestone events."),
    ("Custom Cakes",                   "Hand-sculpted and personalized bespoke cake commissions."),
    ("Cheesecakes",                    "Rich and creamy baked and no-bake cheesecakes."),
    ("Gourmet Cupcakes & Pastries",    "Single-serve pastries, macarons, and gourmet cupcakes."),
    ("Tea & Loaf Cakes",               "Rustic loaves and pound cakes for tea-time."),
    ("Eggless & Vegan Bakes",          "Full-flavor vegan and eggless creations."),
    ("Artisanal & Eggless Creations",  "Cookies, biscotti, shortbread, and European pastry classics."),
    ("Festive & Seasonal Specials",    "Limited-run holiday cakes and seasonal bakes."),
]

# (name, category_name, flavor, price, discount_price, weight_kg, is_featured, is_eggless, description)
PRODUCTS = [
    # ── Celebration Cakes ───────────────────────────────────────────
    ("Tropical Mango Coconut Cake", "Celebration Cakes", "fruit", 32.99, None, 1.0, True, False,
     "Light coconut sponge layered with fresh mango compote and whipped coconut cream."),
    ("Red Velvet Royalty Cake", "Celebration Cakes", "red_velvet", 34.99, 29.99, 1.0, True, False,
     "Classic cocoa-tinted velvet sponge with silky cream cheese frosting."),
    ("Golden Salted Caramel Cascade Cake", "Celebration Cakes", "other", 38.99, None, 1.2, True, False,
     "Buttery vanilla tiers draped in golden salted caramel ganache."),
    ("Ultimate Chocolate Fudge Dream Cake", "Celebration Cakes", "chocolate", 36.99, None, 1.2, True, False,
     "Triple-layer dark chocolate fudge with a molten ganache core."),
    ("Classic Three-Tier Vanilla Raspberry Cake", "Celebration Cakes", "vanilla", 149.99, None, 4.0, True, False,
     "Traditional celebration tier with raspberry compote and vanilla buttercream."),

    # ── Custom Cakes ────────────────────────────────────────────────
    ("Custom Cartoon Cake (Comic Style)", "Custom Cakes", "other", 89.99, None, 2.0, True, False,
     "Hand-piped cartoon design with edible ink comic panel wrap."),
    ("Custom Geode Crystal Cake", "Custom Cakes", "other", 129.99, None, 2.5, True, False,
     "Sculpted geode cake with rock-sugar crystal core and 24k gold leaf."),
    ("Custom Photo-Print Chocolate Cake", "Custom Cakes", "chocolate", 79.99, None, 2.0, False, False,
     "Edible-ink photo print on chocolate ganache canvas."),
    ("Custom Buttercream Floral Number Cake", "Custom Cakes", "vanilla", 99.99, None, 2.0, True, False,
     "Number or letter-shaped cake with hand-piped floral buttercream."),
    ("Custom Tiered Fondant Birthday Cake", "Custom Cakes", "vanilla", 159.99, None, 4.0, False, False,
     "Multi-tier fondant celebration with hand-sculpted toppers."),

    # ── Cheesecakes ─────────────────────────────────────────────────
    ("Key Lime Sunken Cheesecake", "Cheesecakes", "cheesecake", 29.99, None, 1.2, False, False,
     "Tangy key lime custard with a sunken graham swirl center."),
    ("Double Chocolate Ganache Cheesecake", "Cheesecakes", "chocolate", 32.99, 27.99, 1.2, True, False,
     "Dark chocolate cheesecake base topped with glossy ganache."),
    ("Lotus Biscoff Cookie Butter Cheesecake", "Cheesecakes", "cheesecake", 34.99, None, 1.2, True, False,
     "Creamy cheesecake swirled with caramelized Biscoff spread."),
    ("Fresh Strawberry Swirl Cheesecake", "Cheesecakes", "cheesecake", 31.99, None, 1.2, False, False,
     "Classic cheesecake with fresh strawberry ripple and shortbread crust."),
    ("New York Style Classic Cheesecake", "Cheesecakes", "cheesecake", 28.99, None, 1.2, False, False,
     "Dense, silky New York cheesecake with a buttery graham base."),

    # ── Gourmet Cupcakes & Pastries ─────────────────────────────────
    ("Fresh Strawberry Glazed Danish", "Gourmet Cupcakes & Pastries", "fruit", 4.99, None, 0.15, False, False,
     "Flaky laminated pastry with vanilla pastry cream and fresh strawberry glaze."),
    ("Red Velvet Cream Cheese Turnovers", "Gourmet Cupcakes & Pastries", "red_velvet", 5.49, None, 0.15, False, False,
     "Golden turnovers filled with red velvet cream cheese."),
    ("Salted Caramel Macaron Box", "Gourmet Cupcakes & Pastries", "other", 14.99, None, 0.3, True, False,
     "Box of 6 salted caramel French macarons with dark chocolate ganache."),
    ("Madagascar Vanilla Bean Cupcake", "Gourmet Cupcakes & Pastries", "vanilla", 3.99, None, 0.1, False, False,
     "Pure vanilla bean sponge with vanilla bean buttercream swirl."),
    ("Belgian Chocolate Truffle Cupcake", "Gourmet Cupcakes & Pastries", "chocolate", 4.49, None, 0.1, True, False,
     "Belgian chocolate sponge filled with molten truffle cream."),

    # ── Tea & Loaf Cakes ────────────────────────────────────────────
    ("Classic Rich Vanilla Pound Cake", "Tea & Loaf Cakes", "vanilla", 18.99, None, 0.8, False, False,
     "Traditional pound cake with vanilla-rich buttery crumb."),
    ("Banana Walnut Choc-Chip Bread", "Tea & Loaf Cakes", "other", 16.99, None, 0.8, False, False,
     "Moist banana bread with toasted walnuts and dark chocolate chips."),
    ("Rich Walnut and Date Loaf", "Tea & Loaf Cakes", "other", 17.99, None, 0.8, False, False,
     "Deeply caramelized date loaf studded with toasted walnuts."),
    ("Marble Tea Time Loaf Cake", "Tea & Loaf Cakes", "chocolate", 19.99, None, 0.8, False, False,
     "Chocolate and vanilla marble sponge with a light sugar crust."),
    ("Classic English Lemon Drizzle Loaf", "Tea & Loaf Cakes", "fruit", 17.99, None, 0.8, False, False,
     "Zesty lemon sponge soaked in a bright lemon syrup drizzle."),

    # ── Eggless & Vegan Bakes ───────────────────────────────────────
    ("Vegan Oatmeal Chocolate Chip Cookies", "Eggless & Vegan Bakes", "chocolate", 12.99, None, 0.4, False, True,
     "Chewy vegan oatmeal cookies loaded with dark chocolate chips."),
    ("Eggless Matcha Green Tea Cake", "Eggless & Vegan Bakes", "other", 27.99, None, 1.0, True, True,
     "Earthy matcha chiffon with whipped white chocolate cream."),
    ("Vegan Strawberry Streusel Muffins", "Eggless & Vegan Bakes", "fruit", 9.99, None, 0.5, False, True,
     "Box of 4 vegan muffins with fresh strawberry and oat streusel."),
    ("Eggless Vanilla Sprinkle Cake", "Eggless & Vegan Bakes", "vanilla", 24.99, None, 1.0, False, True,
     "Funfetti-style eggless vanilla celebration cake with sprinkles."),
    ("Vegan Fudge Brownie Tray", "Eggless & Vegan Bakes", "chocolate", 14.99, None, 0.5, False, True,
     "Dense vegan cocoa brownie tray, cut into 8 squares."),

    # ── Artisanal & Eggless Creations ───────────────────────────────
    ("Spiced Orange & Cranberry Tart", "Artisanal & Eggless Creations", "fruit", 22.99, None, 0.6, False, False,
     "Buttery tart shell with spiced orange curd and dried cranberries."),
    ("Espresso Hazelnut Biscotti", "Artisanal & Eggless Creations", "other", 11.99, None, 0.3, False, False,
     "Twice-baked biscotti with espresso and toasted hazelnut."),
    ("Almond Florentine Thins Pack", "Artisanal & Eggless Creations", "other", 13.99, None, 0.25, False, False,
     "Delicate almond florentine lace cookies in a gift-pack."),
    ("Handcrafted Pistachio Rose Shortbread", "Artisanal & Eggless Creations", "other", 15.99, None, 0.3, True, False,
     "Rosewater shortbread with crushed pistachio and powdered sugar."),
    ("Artisanal Sourdough Chocolate Babka", "Artisanal & Eggless Creations", "chocolate", 21.99, None, 0.7, False, False,
     "Enriched sourdough babka braided with dark chocolate frangipane."),

    # ── Festive & Seasonal Specials ─────────────────────────────────
    ("Summer Fresh Mango Tart", "Festive & Seasonal Specials", "fruit", 24.99, None, 0.6, False, False,
     "Seasonal mango tart with vanilla pastry cream and lime zest."),
    ("Springtime Lemon Lavender Loaf", "Festive & Seasonal Specials", "fruit", 18.99, None, 0.7, False, False,
     "Lemon lavender loaf with a honey glaze and candied petals."),
    ("Spooky Halloween Chocolate Cupcakes", "Festive & Seasonal Specials", "chocolate", 15.99, None, 0.4, False, False,
     "Box of 6 chocolate cupcakes with spooky buttercream toppers."),
    ("Autumn Pumpkin Spice Loaf", "Festive & Seasonal Specials", "other", 18.99, None, 0.7, False, False,
     "Spiced pumpkin loaf with cream cheese swirl."),
    ("Traditional Christmas Spiced Plum Cake", "Festive & Seasonal Specials", "other", 26.99, 22.99, 1.0, True, False,
     "Old-world spiced plum cake with rum-soaked dried fruits."),
]


class Command(BaseCommand):
    help = "Seed the database with the real Salvatore Cakes categories and 40 products."

    def handle(self, *args, **options):
        cat_map = {}
        for name, desc in CATEGORIES:
            cat, _ = Category.objects.get_or_create(
                name=name, defaults={"description": desc}
            )
            cat_map[name] = cat
        self.stdout.write(self.style.SUCCESS(f"Categories ready: {len(cat_map)}"))

        created_count = 0
        for row in PRODUCTS:
            name, cat_name, flavor, price, discount, weight, featured, eggless, desc = row
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
                    "description": desc,
                },
            )
            if created:
                created_count += 1

        self.stdout.write(self.style.SUCCESS(f"Products created: {created_count}"))