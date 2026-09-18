import { useQueries } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { bookingsApi } from '@/lib/api/resources'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageSpinner } from '@/components/ui/Spinner'
import { formatCurrency, formatDateLabel, formatTime } from '@/lib/utils/format'

export function BookingConfirmedPage() {
  const [searchParams] = useSearchParams()
  const ids = (searchParams.get('ids') ?? '')
    .split(',')
    .map(Number)
    .filter((n) => !Number.isNaN(n))

  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['bookings', id],
      queryFn: () => bookingsApi.get(id),
    })),
  })

  if (ids.length === 0) return <EmptyState title="No booking to show" />
  if (results.some((r) => r.isLoading)) return <PageSpinner />

  const bookings = results.map((r) => r.data).filter((b) => b !== undefined)
  if (bookings.length === 0) return <EmptyState title="Couldn't load your booking" />

  const first = bookings[0]
  const total = bookings.reduce((sum, b) => sum + b.amount, 0)
  const dateLabel = formatDateLabel(first.movieShow.startDate)

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-muted text-brand">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <h1 className="text-xl font-semibold text-text-h">Booking confirmed</h1>
        <p className="mt-1 text-sm text-text-muted">Your tickets are booked. Enjoy the show!</p>
      </div>

      <div className="w-full rounded-xl border border-border bg-surface p-5 text-left">
        <h2 className="text-base font-semibold text-text-h">{first.movieShow.movie.name}</h2>
        <p className="text-sm text-text-muted">
          {first.movieShow.screen.eventVenue.venueName} · {first.movieShow.screen.name}
        </p>
        <p className="text-sm text-text-muted">
          {dateLabel.weekday}, {dateLabel.day} {dateLabel.month} · {formatTime(first.movieShow.startTime)}
        </p>

        <ul className="mt-3 flex flex-col gap-1.5 border-t border-border pt-3 text-sm text-text">
          {bookings.map((b) => (
            <li key={b.id} className="flex justify-between">
              <span>
                Seat {String.fromCharCode(64 + b.showSeat.seat.row)}
                {b.showSeat.seat.col}
                <span className="ml-2 text-xs text-text-muted">Booking #{b.id}</span>
              </span>
              <span className="text-text-muted">{formatCurrency(b.amount)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-border pt-3 text-sm font-semibold text-text-h">
          <span>Total paid</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="flex w-full gap-2">
        <Link to="/my-bookings" className="flex-1">
          <Button variant="secondary" className="w-full">
            View my bookings
          </Button>
        </Link>
        <Link to="/" className="flex-1">
          <Button className="w-full">Browse more</Button>
        </Link>
      </div>
    </div>
  )
}
