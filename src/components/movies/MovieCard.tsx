import { Link } from 'react-router-dom'
import type { Movie } from '@/lib/api/types'
import { formatDuration } from '@/lib/utils/format'

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link
      to={`/movies/${movie.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-transform hover:-translate-y-1"
    >
      <div className="aspect-[2/3] w-full overflow-hidden bg-surface-2">
        {movie.banner ? (
          <img
            src={movie.banner}
            alt={movie.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-text-muted">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-text-h">{movie.name}</h3>
        <p className="text-xs text-text-muted">
          {formatDuration(movie.duration)}
          {movie.rating !== undefined && movie.rating !== null && (
            <span className="ml-2 text-brand">★ {movie.rating}</span>
          )}
        </p>
      </div>
    </Link>
  )
}
