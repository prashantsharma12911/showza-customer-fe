# Showza — Customer Frontend

A customer-facing web app for browsing movies, picking a showtime, choosing seats, and booking
tickets against the [Showza backend](../Showza) (Spring Boot, `http://Showza-dev-env.eba-c3h2hppu.ap-south-1.elasticbeanstalk.com`).

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- React Router v7
- TanStack Query (server state / caching)
- Zustand (+ `persist`) for local identity, selected city, and in-progress seat selection

## Getting started

```bash
npm install
npm run dev
```

The dev server proxies `/api/*` to `http://Showza-dev-env.eba-c3h2hppu.ap-south-1.elasticbeanstalk.com` (see `vite.config.ts`), so make sure
the Showza backend is running first. If you need to point at a different backend URL (e.g. in
production, where there's no dev proxy), set `VITE_API_BASE_URL` — see `.env.example`.

## Important backend constraints

The Showza backend is intentionally minimal, and the frontend is built around these constraints:

- **No authentication exists.** There's no login/register endpoint and `User` has no password
  field. "Sign in" here just collects name/email/phone, finds-or-creates a matching `User` row,
  and remembers it in `localStorage`. This is a stand-in, not real auth — anyone can book under
  any email they type in.
- **No filtered or paginated list endpoints.** Every list screen (movies, showtimes, seat map,
  booking history) fetches the *entire* table via the generic `GET /api/...` and filters
  client-side. This is fine for demo-scale data but won't scale to a large catalog — the backend
  would need query-param filtering (e.g. `GET /api/movie-shows?movieId=&cityId=&date=`) to fix
  that properly.
- **No seat-hold/lock mechanism.** Booking a seat is a direct `ShowSeat.status → BOOKED` flip
  with no TTL-based reservation, so two people can race for the same seat. The checkout flow
  re-checks each seat's status immediately before booking and reports any that lost the race, but
  this is not a substitute for a real concurrency-safe hold.
- **CORS is locked to specific origins** in the backend's `WebConfig.java`
  (`http://localhost:5173`, `http://localhost:5174`). If you run this app on another port or
  deploy it elsewhere, add that origin to the backend's CORS config too.

## Booking flow

1. `GET /api/show-seats` (filtered client-side to the show) is re-fetched right before booking.
2. Per selected seat: `PUT /api/show-seats/{id}` (status → `BOOKED`) →
   `POST /api/bookings` → `POST /api/payments` (simulated, always `PASS`).
3. This isn't atomic — if a later seat fails, earlier seats in the same checkout stay booked.
   The confirmation page reports which seats succeeded.

## Project structure

```
src/
  lib/
    api/        axios client, typed resource CRUD helpers, entity/input types
    hooks/      TanStack Query hooks per domain (movies, shows, seats, bookings...)
    store/      Zustand stores (identity, city, in-progress seat selection)
    utils/      formatting + derived-data helpers (now-showing, show filtering)
  components/   layout, movie cards, showtime/date pickers, seat map, identity modal
  pages/        one component per route (see src/App.tsx)
```
