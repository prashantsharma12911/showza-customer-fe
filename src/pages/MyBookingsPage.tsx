import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { IdentityModal } from '@/components/identity/IdentityModal'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageSpinner } from '@/components/ui/Spinner'
import { bookingsApi, ref } from '@/lib/api/resources'
import type { BookingDetails } from '@/lib/api/types'
import { useMyBookings } from '@/lib/hooks/useBookings'
import { useUserStore } from '@/lib/store/useUserStore'
import { formatCurrency, formatDateLabel, formatTime } from '@/lib/utils/format'

const statusStyles: Record<string, string> = {
  CONFIRMED: 'bg-brand-muted text-brand',
  PENDING: 'bg-surface-2 text-text-muted',
  CANCELLED: 'bg-surface-2 text-text-muted line-through',
}

export function MyBookingsPage() {
  const user = useUserStore((s) => s.user)
  const [showIdentity, setShowIdentity] = useState(!user)
  const { data: bookings, isLoading } = useMyBookings(user?.id)

  if (!user) {
    return (
      <>
        <EmptyState title="Sign in to see your bookings" subtitle="We just need your name and email." />
        {showIdentity && <IdentityModal onClose={() => setShowIdentity(false)} />}
      </>
    )
  }

  if (isLoading) return <PageSpinner />
  if (!bookings || bookings.length === 0) {
    return <EmptyState title="No bookings yet" subtitle="Once you book a show, it'll show up here." />
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-text-h">My bookings</h1>
      <div className="flex flex-col gap-3">
        {bookings.map((b) => (
          <BookingRow key={b.id} booking={b} />
        ))}
      </div>
    </div>
  )
}

function BookingRow({ booking }: { booking: BookingDetails }) {
  const queryClient = useQueryClient()
  const cancel = useMutation({
    mutationFn: () =>
      bookingsApi.update(booking.id, {
        user: ref(booking.user.id),
        movieShow: ref(booking.movieShow.id),
        showSeat: ref(booking.showSeat.id),
        offer: booking.offer ? ref(booking.offer.id) : undefined,
        status: 'CANCELLED',
        amount: booking.amount,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  })

  const dateLabel = formatDateLabel(booking.movieShow.startDate)
  const canCancel = booking.status === 'CONFIRMED'

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-text-h">{booking.movieShow.movie.name}</h3>
          <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium uppercase ${statusStyles[booking.status]}`}>
            {booking.status}
          </span>
        </div>
        <p className="text-xs text-text-muted">
          {booking.movieShow.screen.eventVenue.venueName} · {dateLabel.weekday}, {dateLabel.day} {dateLabel.month} ·{' '}
          {formatTime(booking.movieShow.startTime)}
        </p>
        <p className="text-xs text-text-muted">
          Seat {String.fromCharCode(64 + booking.showSeat.seat.row)}
          {booking.showSeat.seat.col} · {formatCurrency(booking.amount)}
        </p>
      </div>
      {canCancel && (
        <Button variant="secondary" loading={cancel.isPending} onClick={() => cancel.mutate()}>
          Cancel
        </Button>
      )}
    </div>
  )
}
