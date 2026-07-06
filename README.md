# Salvatore Cakes — Full-Stack E-commerce

An online cake shop: **Django REST Framework** backend + **Next.js (App Router)** frontend.

```
salvatore-cakes/
├── backend/    Django REST API (products, accounts, orders)
└── frontend/   Next.js storefront (Tailwind CSS)
```

## Features

- Product catalog with categories, flavors, featured items, search & filters
- JWT authentication (register / login / me)
- Cart (client-side, persisted in localStorage)
- Checkout that creates a real `Order` + `OrderItem` records via the API
- Order history per logged-in user
- Django admin for managing products, categories, and orders

## 1. Backend setup (Django)

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env          # edit SECRET_KEY etc.

python manage.py migrate
python manage.py createsuperuser
python manage.py seed_products   # optional: adds sample cakes
python manage.py runserver
```

API runs at `http://localhost:8000/api/`. Admin at `http://localhost:8000/admin/`.

Key endpoints:
| Endpoint | Description |
|---|---|
| `GET /api/products/` | list products (filter: `category__slug`, `flavor`, `is_featured`, `search`) |
| `GET /api/products/<slug>/` | product detail |
| `POST /api/accounts/register/` | create account |
| `POST /api/accounts/login/` | JWT login |
| `GET /api/accounts/me/` | current user |
| `GET/POST /api/orders/` | list / place orders (auth required) |

## 2. Frontend setup (Next.js)

```bash
cd frontend
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL if backend isn't on localhost:8000
npm run dev
```

Storefront runs at `http://localhost:3000`.

## 3. Pushing this project to your own GitHub account

I've initialized a local git repository with a clean, logical commit history (backend setup →
products app → accounts/auth → orders → frontend setup → each frontend feature). To push it to
your own account:

```bash
cd salvatore-cakes
git remote add origin https://github.com/<your-username>/salvatore-cakes.git
git branch -M main
git push -u origin main
```

**A note on "daily commits":** I intentionally did not fabricate backdated commits to make it
look like this was built over many days — that would misrepresent the project's real history if
you ever show it to an employer, client, or collaborator. If you'd like a genuinely staged rollout
(e.g. you're using this to learn git as you go, or want a real commit-a-day cadence for a
public contribution graph), let me know and I can hand you the work in dated chunks — schema
today, API tomorrow, frontend the day after — so each day's commit reflects real work you did
that day.

## Tech notes

- Backend: Django 5, DRF, SimpleJWT, django-filter, CORS headers, SQLite by default (swap
  `DATABASES` in `config/settings.py` for Postgres in production).
- Frontend: Next.js 14 App Router, Tailwind CSS, axios, js-cookie for token storage.
- Cart state lives in the browser; orders are only persisted server-side once checkout completes.
