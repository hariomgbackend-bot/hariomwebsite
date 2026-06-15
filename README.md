# Hariom Electronics — Storefront & Admin Portal

Multi-brand electronics & home-appliance retailer serving Alandi, Maharashtra since 1988. This repo contains two apps:

- **`/`** — Next.js 15 storefront (the public website)
- **`/hariom-admin`** — Static HTML/JS admin portal (inventory, orders, CRM)

## Tech stack

| Layer | Storefront | Admin Portal |
|-------|-----------|--------------|
| Framework | Next.js 15 (App Router) + React 19 | Vanilla JS (no framework) |
| Styling | Tailwind CSS v4 | Hand-written CSS |
| Database | Cloud Firestore | Cloud Firestore (Firebase compat SDK) |
| Auth | Firebase Auth (customers) | Firebase Auth (admins) |
| Storage | Firebase Storage | Firebase Storage |
| Payments | Razorpay | — |
| Hosting | Vercel | Vercel |

## Storefront structure

```
src/
├── app/                # Next.js App Router pages
│   ├── page.js                  # Home
│   ├── products/                # Product listing + category pages
│   ├── product/[slug]/          # Product detail
│   ├── checkout/                # Cart + checkout + Razorpay
│   ├── order/[id]/success/      # Order confirmation
│   ├── brands, offers, stores, services, about, awards, contact, account
│   └── api/                     # pincode, razorpay create-order/verify
├── components/         # Header, Footer, Hero, ProductCards, etc.
├── lib/                # Firebase, products, cart, orders, brands, offers
├── data/               # Static fallback data
├── contexts/           # LanguageProvider (en / hi / mr)
└── hooks/              # useTranslation
```

## Admin portal structure

```
hariom-admin/
├── index.html          # Login + dashboard shell
├── css/                # style.css, dashboard.css
└── js/
    ├── app.js          # Router + sidebar nav
    ├── auth.js         # Firebase auth + admin role check
    ├── firebase-config.js
    ├── utils/          # table.js (search/sort/paginate/CSV), audio-alert.js
    └── modules/        # dashboard, stock, brands, categories, offers,
                        # enquiries, orders, returns, customers, published
```

## Getting started (storefront)

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.local.example` → `.env.local` and fill in your Firebase + Razorpay keys.
3. Run the dev server:
   ```
   npm run dev
   ```
4. Open `http://localhost:3000`.

## Getting started (admin portal)

The admin portal is static — no build step. Configure `js/firebase-config.js`, then either open `hariom-admin/index.html` directly or deploy as a static site (it's already wired for Vercel via `hariom-admin/vercel.json`).

## Environment variables

See `.env.local.example`:
- `NEXT_PUBLIC_FIREBASE_*` — Firebase web config (storefront + admin share the project)
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — WhatsApp click-to-chat number
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — server-side Razorpay keys

## Firestore collections

`products`, `categories`, `brands`, `promotions`, `enquiries`, `orders`, `customers`, `returns`.

## License

Proprietary — Hariom Electronics. All rights reserved.
