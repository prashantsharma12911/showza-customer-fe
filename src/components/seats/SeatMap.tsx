import type { ShowSeat } from '@/lib/api/types'
import { formatCurrency } from '@/lib/utils/format'

const typeLabel: Record<string, string> = {
  REGULAR: 'Regular',
  GOLD: 'Gold',
  PREMIUM: 'Premium',
}

export function SeatMap({
  seats,
  selectedIds,
  onToggle,
}: {
  seats: ShowSeat[]
  selectedIds: Set<number>
  onToggle: (seat: ShowSeat) => void
}) {
  const rows = new Map<number, ShowSeat[]>()
  for (const s of seats) {
    if (!rows.has(s.seat.row)) rows.set(s.seat.row, [])
    rows.get(s.seat.row)!.push(s)
  }

  const tiersPresent = [...new Set(seats.map((s) => s.seat.type))]

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-1.5">
        {[...rows.entries()]
          .sort((a, b) => a[0] - b[0])
          .map(([row, rowSeats]) => (
            <div key={row} className="flex items-center gap-1.5">
              <span className="w-5 text-xs text-text-muted">{String.fromCharCode(64 + row)}</span>
              <div className="flex gap-1.5">
                {rowSeats
                  .sort((a, b) => a.seat.col - b.seat.col)
                  .map((s) => {
                    const isSelected = selectedIds.has(s.id)
                    const isBooked = s.status === 'BOOKED'
                    return (
                      <button
                        key={s.id}
                        disabled={isBooked}
                        title={`${typeLabel[s.seat.type]} · ${formatCurrency(s.price)}`}
                        onClick={() => onToggle(s)}
                        className={`flex h-7 w-7 items-center justify-center rounded-md border text-[10px] font-medium transition-colors ${
                          isBooked
                            ? 'cursor-not-allowed border-transparent bg-seat-booked text-white/30'
                            : isSelected
                              ? 'border-brand bg-seat-selected text-white'
                              : 'border-border bg-seat-available text-text-muted hover:border-brand'
                        }`}
                      >
                        {s.seat.col}
                      </button>
                    )
                  })}
              </div>
            </div>
          ))}
      </div>

      <div className="w-full max-w-xs border-t border-border pt-3 text-center text-[11px] text-text-muted">
        <div className="mx-auto mb-4 h-1.5 w-3/4 rounded-full bg-surface-2" />
        SCREEN
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-text-muted">
        <Legend swatchClass="bg-seat-available border border-border" label="Available" />
        <Legend swatchClass="bg-seat-selected" label="Selected" />
        <Legend swatchClass="bg-seat-booked" label="Booked" />
      </div>

      {tiersPresent.length > 0 && (
        <p className="text-xs text-text-muted">Seat types: {tiersPresent.map((t) => typeLabel[t]).join(', ')}</p>
      )}
    </div>
  )
}

function Legend({ swatchClass, label }: { swatchClass: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-3.5 w-3.5 rounded ${swatchClass}`} />
      {label}
    </div>
  )
}
