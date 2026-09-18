import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DateStrip } from '@/components/shows/DateStrip'
import { VenueShowList } from '@/components/shows/VenueShowList'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageSpinner } from '@/components/ui/Spinner'
import { useMovie } from '@/lib/hooks/useMovies'
import { useMovieShows } from '@/lib/hooks/useMovieShows'
import { useCityStore } from '@/lib/store/useCityStore'
import { addDaysIso, formatDuration, todayIso } from '@/lib/utils/format'
import { filterShows } from '@/lib/utils/derive'

const DATE_RANGE = Array.from({ length: 7 }, (_, i) => addDaysIso(i))

export function MovieDetailsPage() {
  const { id } = useParams()
  const movieId = Number(id)
  const [date, setDate] = useState(todayIso())
  const city = useCityStore((s) => s.city)

  const { data: movie, isLoading: movieLoading, isError: movieError } = useMovie(movieId)
  const { data: shows, isLoading: showsLoading } = useMovieShows()

  const showsForDate = useMemo(
    () => filterShows(shows ?? [], { movieId, cityId: city?.id, date }),
    [shows, movieId, city, date],
  )

  if (movieLoading) return <PageSpinner />
  if (movieError || !movie) {
    return <EmptyState title="Movie not found" subtitle="It may have been removed." />
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="w-40 shrink-0 overflow-hidden rounded-xl border border-border bg-surface sm:w-52">
          <div className="aspect-[2/3] w-full bg-surface-2">
            {movie.banner && (
              <img src={movie.banner} alt={movie.name} className="h-full w-full object-cover" />
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <h1 className="text-2xl font-bold text-text-h sm:text-3xl">{movie.name}</h1>
          <p className="text-sm text-text-muted">
            {formatDuration(movie.duration)}
            {movie.rating !== undefined && movie.rating !== null && (
              <span className="ml-2 text-brand">★ {movie.rating}</span>
            )}
          </p>
          {movie.actor && (
            <p className="text-sm text-text">
              Starring <span className="font-medium text-text-h">{movie.actor.name}</span>
            </p>
          )}
          {movie.description && <p className="mt-2 max-w-2xl text-sm text-text-muted">{movie.description}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-h">Showtimes</h2>
          {!city && <p className="text-xs text-text-muted">Select a city to narrow down venues</p>}
        </div>
        <DateStrip dates={DATE_RANGE} selected={date} onSelect={setDate} />
        {showsLoading ? <PageSpinner /> : <VenueShowList shows={showsForDate} />}
      </div>
    </div>
  )
}
