import type { Movie, MovieShow } from '@/lib/api/types'

export function filterMoviesByQuery(movies: Movie[], query: string): Movie[] {
  const q = query.trim().toLowerCase()
  if (!q) return movies
  return movies.filter(
    (m) => m.name.toLowerCase().includes(q) || m.actor?.name?.toLowerCase().includes(q),
  )
}

export function moviesWithUpcomingShows(shows: MovieShow[]): Set<number> {
  const today = new Date().toISOString().slice(0, 10)
  const ids = new Set<number>()
  for (const show of shows) {
    if (show.startDate >= today) ids.add(show.movie.id)
  }
  return ids
}

export function filterShows(
  shows: MovieShow[],
  { movieId, cityId, date }: { movieId: number; cityId?: number; date: string },
): MovieShow[] {
  return shows.filter((s) => {
    if (s.movie.id !== movieId) return false
    if (s.startDate !== date) return false
    if (cityId !== undefined && s.screen.eventVenue.city.id !== cityId) return false
    return true
  })
}
