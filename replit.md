# Selora Hotel Booking App

## Overview

A full-stack production-quality hotel booking web application with clean architecture.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **Frontend**: React + Vite + Tailwind CSS + Wouter routing + TanStack Query
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: JWT (jsonwebtoken) + bcryptjs password hashing
- **Validation**: Zod

## Project Structure

```
frontend/          React + Vite web app
  src/
    api/           API client (hooks + custom fetch)
    pages/         Route pages (home, hotels, booking, etc.)
    components/    Shared UI components
    contexts/      Auth context
    hooks/         Custom hooks

backend/           Express API server
  src/
    db/            Database layer (Drizzle ORM + PostgreSQL)
    zod/           Zod schemas for request validation
    routes/        API route handlers
    middlewares/   Auth middleware
    lib/           JWT utils, logger
  drizzle.config.ts
```

## Key Commands

- Start frontend (dev): `PORT=24960 pnpm --filter frontend run dev`
- Start backend (dev): `PORT=8080 pnpm --filter backend run dev`
- Push DB schema: `pnpm --filter backend run db:push`
- Build backend: `pnpm --filter backend run build`

## Features

- **Authentication**: Register, login, JWT tokens, role-based access (USER/ADMIN)
- **Hotels**: Search/filter by city, price, rating, stars, amenities. Sort by price/rating/popularity
- **Rooms**: View by hotel, check availability for date ranges
- **Bookings**: Create bookings, check availability, payment (fake), cancel
- **Payment Methods**: Save cards (last4 + brand + cardholder + expiry only — no PAN/CVV stored), set default, delete, reuse on checkout. Stored in `payment_methods` table (cascades on user delete)
- **Reviews**: Leave reviews (must have confirmed booking), view hotel reviews
- **Favorites**: Save/unsave hotels
- **Admin**: CRUD hotels/rooms, view users, manage bookings
- **Recommendations**: Similar hotels by city

## Seeded Data

33 hotels across Paris, London, Tokyo, Bali, Barcelona, New York, Zurich, Singapore, and more — with 132 rooms total.

## Internationalization (i18n)

- **Library**: `react-i18next` with browser language detector
- **Languages**: English (`en`) and Russian (`ru`) only — Russian is the primary user language
- **Persistence**: Selected language stored in `localStorage` under key `selora_language`
- **Switcher**: Globe icon in header (`Layout`) toggles language with full app reactivity
- **Locale files**: `frontend/src/i18n/locales/{en,ru}.json`
- **Static page keys**: All static/policy pages use the `static.*` namespace (about, blog, press, careers, contact, help, cancellation, safety, privacy, terms, cookies, accessibility)
- **Pattern for arrays of objects**: Translatable text lives in JSON; icons, colors, and href URLs live as external TS arrays in the page (e.g. `SECTION_ICONS`, `COMMITMENT_ICONS`, `RELATED_META`) and are zipped by index with the i18n array. This keeps the JSON portable and avoids serializing React components.
