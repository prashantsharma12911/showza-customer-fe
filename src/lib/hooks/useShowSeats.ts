import { useQuery } from '@tanstack/react-query'
import { showSeatsApi } from '@/lib/api/resources'

export function useShowSeats(showId: number | undefined) {
  return useQuery({
    queryKey: ['show-seats', showId],
    queryFn: showSeatsApi.list,
    select: (seats) => seats.filter((s) => s.movieShow.id === showId).sort(sortBySeatPosition),
    enabled: showId !== undefined,
    refetchInterval: 15000,
  })
}

function sortBySeatPosition(a: { seat: { row: number; col: number } }, b: { seat: { row: number; col: number } }) {
  if (a.seat.row !== b.seat.row) return a.seat.row - b.seat.row
  return a.seat.col - b.seat.col
}
