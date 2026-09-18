import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SeatMap } from '@/components/seats/SeatMap'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageSpinner } from '@/components/ui/Spinner'
import { useMovieShow } from '@/lib/hooks/useMovieShows'
import { useShowSeats } from '@/lib/hooks/useShowSeats'
import { useSeatSelectionStore } from '@/lib/store/useSeatSelectionStore'
import { formatCurrency, formatDateLabel, formatTime } from '@/lib/utils/format'

export function SeatSelectionPage() {
  const { showId } = useParams()
  const id = Number(showId)
  const navigate = useNavigate()

  const { data: show, isLoading: showLoading } = useMovieShow(id)
  const { data: seats, isLoading: seatsLoading, isError } = useShowSeats(id)
  const { showId: activeShowId, selected, toggleSeat, clear } = useSeatSelectionStore()

  const selectedSeats = useMemo(
    () => (activeShowId === id ? [...selected.values()] : []),
    [activeShowId, id, selected],
  )
  const total = selectedSeats.reduce((sum, s) => sum + s.price, 0)

  if (showLoading || seatsLoading) return <PageSpinner />
  if (!show) return <EmptyState title="Show not found" />
  if (isError) return <EmptyState title="Couldn't load seats" subtitle="Please try again." />

  const dateLabel = formatDateLabel(show.startDate)

  function handleProceed() {
    if (selectedSeats.length === 0) return
    navigate(`/checkout?showId=${id}`)
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <div className="flex-1">
        <div className="mb-6 rounded-xl border border-border bg-surface p-4">
          <h1 className="text-lg font-semibold text-text-h">{show.movie.name}</h1>
          <p className="text-sm text-text-muted">
            {show.screen.eventVenue.venueName} · {show.screen.name}
          </p>
          <p className="text-sm text-text-muted">
            {dateLabel.weekday}, {dateLabel.day} {dateLabel.month} · {formatTime(show.startTime)}
          </p>
        </div>

        {seats && seats.length > 0 ? (
          <SeatMap
            seats={seats}
            selectedIds={new Set(selectedSeats.map((s) => s.id))}
            onToggle={(seat) => toggleSeat(id, seat)}
          />
        ) : (
          <EmptyState title="No seats configured for this show" />
        )}
      </div>

      <aside className="w-full shrink-0 rounded-xl border border-border bg-surface p-4 lg:w-72">
        <h2 className="text-sm font-semibold text-text-h">Your selection</h2>
        {selectedSeats.length === 0 ? (
          <p className="mt-2 text-sm text-text-muted">Tap available seats to select them.</p>
        ) : (
          <>
            <ul className="mt-3 flex flex-col gap-1.5 text-sm text-text">
              {selectedSeats
                .sort((a, b) => a.seat.row - b.seat.row || a.seat.col - b.seat.col)
                .map((s) => (
                  <li key={s.id} className="flex justify-between">
                    <span>
                      {String.fromCharCode(64 + s.seat.row)}
                      {s.seat.col}
                    </span>
                    <span className="text-text-muted">{formatCurrency(s.price)}</span>
                  </li>
                ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-border pt-3 text-sm font-semibold text-text-h">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </>
        )}
        <div className="mt-4 flex gap-2">
          {selectedSeats.length > 0 && (
            <Button variant="ghost" onClick={clear}>
              Clear
            </Button>
          )}
          <Button className="flex-1" disabled={selectedSeats.length === 0} onClick={handleProceed}>
            Proceed to pay
          </Button>
        </div>
      </aside>
    </div>
  )
}
