import { useQuery } from '@tanstack/react-query'
import { moviesApi } from '@/lib/api/resources'

export function useMovies() {
  return useQuery({ queryKey: ['movies'], queryFn: moviesApi.list })
}

export function useMovie(id: number | undefined) {
  return useQuery({
    queryKey: ['movies', id],
    queryFn: () => moviesApi.get(id as number),
    enabled: id !== undefined,
  })
}
