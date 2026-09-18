import { useQuery } from '@tanstack/react-query'
import { bookingsApi } from '@/lib/api/resources'

export function useMyBookings(userId: number | undefined) {
  return useQuery({
    queryKey: ['bookings', 'user', userId],
    queryFn: bookingsApi.list,
    select: (bookings) =>
      bookings
        .filter((b) => b.user.id === userId)
        .sort((a, b) => b.id - a.id),
    enabled: userId !== undefined,
  })
}
