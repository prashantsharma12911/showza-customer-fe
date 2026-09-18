import { useQuery } from '@tanstack/react-query'
import { movieShowsApi } from '@/lib/api/resources'

export function useMovieShows() {
  return useQuery({ queryKey: ['movie-shows'], queryFn: movieShowsApi.list })
}

export function useMovieShow(id: number | undefined) {
  return useQuery({
    queryKey: ['movie-shows', id],
    queryFn: () => movieShowsApi.get(id as number),
    enabled: id !== undefined,
  })
}
