# StayLux Hotel Booking App

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
- **Reviews**: Leave reviews (must have confirmed booking), view hotel reviews
- **Favorites**: Save/unsave hotels
- **Admin**: CRUD hotels/rooms, view users, manage bookings
- **Recommendations**: Similar hotels by city

## Seeded Data

33 hotels across Paris, London, Tokyo, Bali, Barcelona, New York, Zurich, Singapore, and more — with 132 rooms total.
