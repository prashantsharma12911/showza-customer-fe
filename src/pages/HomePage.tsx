import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MovieGrid } from '@/components/movies/MovieGrid'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageSpinner } from '@/components/ui/Spinner'
import { useMovies } from '@/lib/hooks/useMovies'
import { useMovieShows } from '@/lib/hooks/useMovieShows'
import { filterMoviesByQuery, moviesWithUpcomingShows } from '@/lib/utils/derive'

export function HomePage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const { data: movies, isLoading, isError } = useMovies()
  const { data: shows } = useMovieShows()

  const filtered = useMemo(() => filterMoviesByQuery(movies ?? [], query), [movies, query])
  const upcomingIds = useMemo(() => moviesWithUpcomingShows(shows ?? []), [shows])

  const nowShowing = filtered.filter((m) => upcomingIds.has(m.id))
  const rest = filtered.filter((m) => !upcomingIds.has(m.id))

  if (isLoading) return <PageSpinner />
  if (isError) {
    return (
      <EmptyState
        title="Couldn't load movies"
        subtitle="Make sure the Showza backend is running on http://Showza-dev-env.eba-c3h2hppu.ap-south-1.elasticbeanstalk.com."
      />
    )
  }
  if (filtered.length === 0) {
    return <EmptyState title="No movies found" subtitle={query ? `Nothing matches "${query}"` : undefined} />
  }

  return (
    <div className="flex flex-col gap-10">
      {nowShowing.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-text-h">In cinemas now</h2>
          <MovieGrid movies={nowShowing} />
        </section>
      )}
      {rest.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-text-h">
            {nowShowing.length > 0 ? 'More movies' : 'All movies'}
          </h2>
          <MovieGrid movies={rest} />
        </section>
      )}
    </div>
  )
}
