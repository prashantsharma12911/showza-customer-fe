import { useMutation, useQueryClient } from '@tanstack/react-query'
import { bookingsApi, paymentsApi, ref, showSeatsApi } from '@/lib/api/resources'
import type { BookingDetails, ShowSeat, User } from '@/lib/api/types'

interface CreateBookingInput {
  user: User
  seats: ShowSeat[]
}

interface CreateBookingResult {
  bookings: BookingDetails[]
  unavailable: ShowSeat[]
}

export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ user, seats }: CreateBookingInput): Promise<CreateBookingResult> => {
      const bookings: BookingDetails[] = []
      const unavailable: ShowSeat[] = []

      for (const seat of seats) {
        const fresh = await showSeatsApi.get(seat.id)
        if (fresh.status === 'BOOKED') {
          unavailable.push(seat)
          continue
        }

        await showSeatsApi.update(seat.id, {
          movieShow: ref(fresh.movieShow.id),
          seat: ref(fresh.seat.id),
          priceTier: fresh.priceTier,
          price: fresh.price,
          status: 'BOOKED',
        })

        const booking = await bookingsApi.create({
          user: ref(user.id),
          movieShow: ref(fresh.movieShow.id),
          showSeat: ref(fresh.id),
          status: 'CONFIRMED',
          amount: fresh.price,
        })

        await paymentsApi.create({
          booking: ref(booking.id),
          amount: fresh.price,
          status: 'PASS',
        })

        bookings.push(booking)
      }

      return { bookings, unavailable }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['show-seats'] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}
