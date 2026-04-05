# StayLux Hotel Booking App

## Overview

A full-stack production-quality hotel booking web application with clean architecture.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS + Wouter routing + TanStack Query
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: JWT (jsonwebtoken) + bcryptjs password hashing
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Architecture

### Frontend (`artifacts/hotel-booking`)
- Feature-oriented pages in `src/pages/`
- Shared components in `src/components/`
- Auth context in `src/contexts/AuthContext.tsx`
- All API calls via generated hooks from `@workspace/api-client-react`

### Backend (`artifacts/api-server`)
- Routes: `src/routes/` — auth, users, hotels, rooms, bookings, reviews, favorites
- Auth middleware: `src/middlewares/requireAuth.ts` — JWT verification + role-based access
- JWT utilities: `src/lib/auth.ts`

### Database (`lib/db`)
- Tables: users, hotels, rooms, bookings, reviews, favorites
- All schema in `lib/db/src/schema/`

### API Contract (`lib/api-spec`)
- OpenAPI spec: `lib/api-spec/openapi.yaml` — single source of truth
- Generated React Query hooks + Zod schemas via codegen

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

8 hotels across Paris, New York, Tokyo, Bali, Barcelona, London, Zurich, Singapore — with 22 rooms total.
