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
- `GOOGLE_PLACES_API_KEY` — Google Places API (New) key, server-side only. Powers the Google reviews on the homepage carousel and Stores page
- `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` — optional Firebase Admin service-account credentials (used by `/api/admin/sync-auth` and the Google-reviews Firestore cache)

## Google reviews

The homepage Reviews carousel and the Stores page show live Google reviews for the two electronics stores (Alandi main store + Dhanore branch). Flow:

1. `GET /api/google-reviews` calls the Google Places API (New) for each store's Place ID (stored in `src/data/stores.js`), normalizes the data, and caches it in the `reviews` Firestore collection (6-hour TTL).
2. `src/lib/reviews.js` fetches from that endpoint and is consumed by `src/components/Testimonials.js` and `src/app/stores/page.js`.
3. If Google data is unavailable, the homepage falls back to the static reviews in `src/data/testimonials.js`.

Setup: enable **Places API (New)** in Google Cloud Console, create a restricted API key, and set it as `GOOGLE_PLACES_API_KEY` in Vercel. The Places API returns up to 5 most-relevant reviews per location.

## Firestore collections

`products`, `categories`, `brands`, `promotions`, `reviews`, `enquiries`, `orders`, `customers`, `returns`.

## License

Proprietary — Hariom Electronics. All rights reserved.
