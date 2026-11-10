from django.core.management.base import BaseCommand
from django.db import transaction
from products.models import Product


class Command(BaseCommand):
    help = (
        "Audit product stock levels. Without flags, shows a read-only report. "
        "With --fix, resets products with low stock back to a safe value."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--fix",
            action="store_true",
            help="Reset products with stock <= threshold back to a safe stock value.",
        )
        parser.add_argument(
            "--threshold",
            type=int,
            default=5,
            help="Stock value considered 'low' (default: 5).",
        )
        parser.add_argument(
            "--reset-to",
            type=int,
            default=25,
            help="Stock value to set when --fix is used (default: 25).",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="With --fix, show what would change but do NOT save.",
        )

    def handle(self, *args, **options):
        threshold = options["threshold"]
        reset_to = options["reset_to"]
        do_fix = options["fix"]
        dry_run = options["dry_run"]

        total = Product.objects.count()
        zero_stock = Product.objects.filter(stock=0)
        low_stock = Product.objects.filter(stock__gt=0, stock__lte=threshold)
        healthy = Product.objects.filter(stock__gt=threshold)

        self.stdout.write("=" * 62)
        self.stdout.write(self.style.HTTP_INFO("  SALVATORE CAKES — STOCK AUDIT REPORT"))
        self.stdout.write("=" * 62)
        self.stdout.write(f"Total products:       {total}")
        self.stdout.write(f"Out of stock (0):     {zero_stock.count()}")
        self.stdout.write(f"Low stock (1-{threshold}):      {low_stock.count()}")
        self.stdout.write(f"Healthy (>{threshold}):       {healthy.count()}")
        self.stdout.write("")

        if zero_stock.exists():
            self.stdout.write(self.style.WARNING(f"⚠️  OUT OF STOCK (0 units):"))
            for p in zero_stock.order_by("name"):
                self.stdout.write(f"    [{p.id:>3}] {p.name}  (slug: {p.slug})")
            self.stdout.write("")

        if low_stock.exists():
            self.stdout.write(self.style.WARNING(f"⚠️  LOW STOCK (1-{threshold} units):"))
            for p in low_stock.order_by("stock", "name"):
                self.stdout.write(
                    f"    [{p.id:>3}] {p.name}  →  {p.stock} unit(s) left"
                )
            self.stdout.write("")

        if healthy.exists():
            self.stdout.write(self.style.SUCCESS(f"✅ HEALTHY STOCK (>{threshold} units): {healthy.count()} products"))
            self.stdout.write("")

        # ---------- FIX MODE ----------
        if not do_fix:
            self.stdout.write("─" * 62)
            self.stdout.write(
                "This was a READ-ONLY report. No changes made.\n"
                f"To reset all low/zero-stock products to {reset_to} units, run:\n\n"
                f"    python manage.py audit_stock --fix --reset-to {reset_to}\n\n"
                "Add --dry-run to preview changes without saving."
            )
            return

        to_fix = Product.objects.filter(stock__lte=threshold)
        if not to_fix.exists():
            self.stdout.write(self.style.SUCCESS(
                f"\n✨ Nothing to fix — all products already have stock > {threshold}."
            ))
            return

        self.stdout.write("─" * 62)
        if dry_run:
            self.stdout.write(self.style.WARNING(
                f"🔍 DRY RUN — would reset {to_fix.count()} product(s) to stock = {reset_to}:"
            ))
            for p in to_fix.order_by("stock", "name"):
                self.stdout.write(f"    [{p.id:>3}] {p.name}  ({p.stock} → {reset_to})")
            self.stdout.write(self.style.WARNING("\nNo changes were made. Remove --dry-run to apply."))
            return

        # Apply the fix
        with transaction.atomic():
            count = to_fix.update(stock=reset_to)

        self.stdout.write(self.style.SUCCESS(
            f"\n✅ Fixed {count} product(s) — all now have stock = {reset_to}."
        ))
        self.stdout.write(f"    Verify with: python manage.py audit_stock")