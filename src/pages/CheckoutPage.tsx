import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { IdentityModal } from '@/components/identity/IdentityModal'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageSpinner } from '@/components/ui/Spinner'
import { useCreateBooking } from '@/lib/hooks/useCreateBooking'
import { useMovieShow } from '@/lib/hooks/useMovieShows'
import { useSeatSelectionStore } from '@/lib/store/useSeatSelectionStore'
import { useUserStore } from '@/lib/store/useUserStore'
import { formatCurrency, formatDateLabel, formatTime } from '@/lib/utils/format'

export function CheckoutPage() {
  const [searchParams] = useSearchParams()
  const showId = Number(searchParams.get('showId'))
  const navigate = useNavigate()

  const user = useUserStore((s) => s.user)
  const { showId: activeShowId, selected, clear } = useSeatSelectionStore()
  const { data: show, isLoading } = useMovieShow(showId)
  const createBooking = useCreateBooking()
  const [showIdentity, setShowIdentity] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const seats = useMemo(
    () => (activeShowId === showId ? [...selected.values()] : []),
    [activeShowId, showId, selected],
  )
  const total = seats.reduce((sum, s) => sum + s.price, 0)

  if (isLoading) return <PageSpinner />
  if (!show || seats.length === 0) {
    return (
      <EmptyState
        title="Nothing to check out"
        subtitle="Go back and select seats for a show first."
      />
    )
  }

  const dateLabel = formatDateLabel(show.startDate)

  async function handleConfirm() {
    if (!user) {
      setShowIdentity(true)
      return
    }
    setError(null)
    const result = await createBooking.mutateAsync({ user, seats })
    if (result.unavailable.length > 0) {
      setError(
        `${result.unavailable.length} seat(s) were just booked by someone else and could not be reserved. The rest of your booking was confirmed.`,
      )
    }
    if (result.bookings.length > 0) {
      clear()
      navigate(`/bookings/confirmed?ids=${result.bookings.map((b) => b.id).join(',')}`)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
      <h1 className="text-xl font-semibold text-text-h">Review &amp; confirm</h1>

      <div className="rounded-xl border border-border bg-surface p-4">
        <h2 className="text-sm font-semibold text-text-h">{show.movie.name}</h2>
        <p className="text-sm text-text-muted">
          {show.screen.eventVenue.venueName} · {show.screen.name}
        </p>
        <p className="text-sm text-text-muted">
          {dateLabel.weekday}, {dateLabel.day} {dateLabel.month} · {formatTime(show.startTime)}
        </p>

        <ul className="mt-3 flex flex-col gap-1.5 border-t border-border pt-3 text-sm text-text">
          {seats
            .sort((a, b) => a.seat.row - b.seat.row || a.seat.col - b.seat.col)
            .map((s) => (
              <li key={s.id} className="flex justify-between">
                <span>
                  Seat {String.fromCharCode(64 + s.seat.row)}
                  {s.seat.col} <span className="text-text-muted">({s.seat.type})</span>
                </span>
                <span className="text-text-muted">{formatCurrency(s.price)}</span>
              </li>
            ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-border pt-3 text-base font-semibold text-text-h">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-4">
        <h2 className="text-sm font-semibold text-text-h">Booking for</h2>
        {user ? (
          <div className="mt-2 flex items-center justify-between text-sm">
            <div>
              <p className="text-text-h">{user.name}</p>
              <p className="text-text-muted">{user.email}</p>
            </div>
            <button className="text-xs text-brand" onClick={() => setShowIdentity(true)}>
              Change
            </button>
          </div>
        ) : (
          <Button variant="secondary" className="mt-2" onClick={() => setShowIdentity(true)}>
            Add your details
          </Button>
        )}
      </div>

      {error && <p className="text-sm text-brand">{error}</p>}
      {createBooking.isError && (
        <p className="text-sm text-brand">Booking failed. Please try again.</p>
      )}

      <Button loading={createBooking.isPending} onClick={handleConfirm}>
        Confirm &amp; pay {formatCurrency(total)}
      </Button>

      {showIdentity && <IdentityModal onClose={() => setShowIdentity(false)} />}
    </div>
  )
}
