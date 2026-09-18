import { Link } from 'react-router-dom'
import type { MovieShow } from '@/lib/api/types'
import { formatTime } from '@/lib/utils/format'
import { EmptyState } from '@/components/ui/EmptyState'

interface VenueGroup {
  venueId: number
  venueName: string
  address: string
  shows: MovieShow[]
}

export function VenueShowList({ shows }: { shows: MovieShow[] }) {
  if (shows.length === 0) {
    return (
      <EmptyState
        title="No shows found"
        subtitle="Try a different date or city — this movie has no showtimes matching your filters."
      />
    )
  }

  const groups = new Map<number, VenueGroup>()
  for (const show of shows) {
    const venue = show.screen.eventVenue
    if (!groups.has(venue.id)) {
      groups.set(venue.id, { venueId: venue.id, venueName: venue.venueName, address: venue.address, shows: [] })
    }
    groups.get(venue.id)!.shows.push(show)
  }

  return (
    <div className="flex flex-col gap-4">
      {[...groups.values()].map((group) => (
        <div key={group.venueId} className="rounded-xl border border-border bg-surface p-4">
          <h3 className="text-sm font-semibold text-text-h">{group.venueName}</h3>
          <p className="text-xs text-text-muted">{group.address}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {group.shows
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map((show) => (
                <Link
                  key={show.id}
                  to={`/shows/${show.id}/seats`}
                  className="rounded-lg border border-border px-3 py-1.5 text-sm text-text hover:border-brand hover:text-brand"
                >
                  {formatTime(show.startTime)}
                  <span className="ml-1.5 text-xs text-text-muted">{show.screen.name}</span>
                </Link>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
