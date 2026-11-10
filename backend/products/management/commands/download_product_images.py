from io import BytesIO
from pathlib import Path
from urllib.parse import urlparse

import requests
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.db import transaction

from products.models import Product


class Command(BaseCommand):
    help = (
        "Download external product image URLs and save them into local MEDIA. "
        "Updates Product.image to point at the new local file. Safe to re-run."
    )

    def add_arguments(self, parser):
        parser.add_argument("--dry-run", action="store_true")
        parser.add_argument("--only", type=int, default=None)
        parser.add_argument("--force", action="store_true")
        parser.add_argument("--timeout", type=int, default=20)

    def handle(self, *args, **options):
        dry_run = options["dry_run"]
        only_id = options["only"]
        force = options["force"]
        timeout = options["timeout"]

        qs = Product.objects.all().order_by("id")
        if only_id is not None:
            qs = qs.filter(id=only_id)

        targets = []
        for p in qs:
            # ImageField.name holds the string value, even when it's an external URL
            current = (p.image.name if p.image else "") or ""

            # Skip if already local (starts with "products/") — unless --force
            if current.startswith("products/") and not force:
                continue

            # Only process products whose image is an external URL
            if not (current.startswith("http://") or current.startswith("https://")):
                continue

            targets.append((p, current))

        if not targets:
            self.stdout.write(self.style.SUCCESS(
                "✨ Nothing to download — every product already has a local image."
            ))
            return

        self.stdout.write("=" * 62)
        self.stdout.write(self.style.HTTP_INFO(
            f"  Downloading {len(targets)} product image(s)"
            + (" (DRY RUN)" if dry_run else "")
        ))
        self.stdout.write("=" * 62)

        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            "Accept": "image/*,*/*;q=0.8",
        }

        success, failed = 0, 0
        failures = []

        for p, url in targets:
            self.stdout.write(f"\n[{p.id}] {p.name}")
            self.stdout.write(f"      url: {url[:100]}")

            if dry_run:
                self.stdout.write("      (dry-run — would download)")
                continue

            try:
                r = requests.get(url, headers=headers, timeout=timeout)
                r.raise_for_status()

                content_type = (r.headers.get("Content-Type") or "").split(";")[0].strip()
                if not content_type.startswith("image/"):
                    raise ValueError(
                        f"Not an image response (Content-Type: {content_type or 'unknown'})"
                    )

                data = r.content
                if not data or len(data) < 1024:
                    raise ValueError(f"Image too small ({len(data)} bytes)")

                parsed = urlparse(url)
                ext = Path(parsed.path).suffix.lower()
                if ext not in (".jpg", ".jpeg", ".png", ".webp", ".gif"):
                    ext = ".jpg"

                safe_name = "".join(
                    c if c.isalnum() else "-"
                    for c in p.slug
                ).strip("-")
                filename = f"{safe_name}{ext}"

                with transaction.atomic():
                    # save=True on FieldFile.save writes to storage and updates the DB row
                    p.image.save(filename, ContentFile(data), save=True)

                self.stdout.write(self.style.SUCCESS(
                    f"      ✅ saved → {p.image.url} ({len(data) // 1024} KB)"
                ))
                success += 1

            except Exception as e:
                failed += 1
                failures.append((p.id, p.name, url, str(e)))
                self.stdout.write(self.style.ERROR(f"      ❌ failed: {e}"))

        self.stdout.write("\n" + "=" * 62)
        self.stdout.write(self.style.HTTP_INFO("  SUMMARY"))
        self.stdout.write("=" * 62)
        if dry_run:
            self.stdout.write(f"Dry run — {len(targets)} product(s) would be processed.")
        else:
            self.stdout.write(self.style.SUCCESS(f"✅ Success: {success}"))
            if failed:
                self.stdout.write(self.style.ERROR(f"❌ Failed:  {failed}"))
                self.stdout.write("\nFailed items:")
                for pid, name, url, err in failures:
                    self.stdout.write(f"  [{pid}] {name}")
                    self.stdout.write(f"       {err}")
                    self.stdout.write(f"       url: {url[:90]}")
                    self.stdout.write("")

        self.stdout.write("")