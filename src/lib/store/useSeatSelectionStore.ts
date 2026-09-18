import { create } from 'zustand'
import type { ShowSeat } from '@/lib/api/types'

interface SeatSelectionState {
  showId: number | null
  selected: Map<number, ShowSeat>
  toggleSeat: (showId: number, seat: ShowSeat) => void
  clear: () => void
}

export const useSeatSelectionStore = create<SeatSelectionState>((set, get) => ({
  showId: null,
  selected: new Map(),
  toggleSeat: (showId, seat) => {
    const state = get()
    const selected = state.showId === showId ? new Map(state.selected) : new Map()
    if (selected.has(seat.id)) {
      selected.delete(seat.id)
    } else {
      selected.set(seat.id, seat)
    }
    set({ showId, selected })
  },
  clear: () => set({ showId: null, selected: new Map() }),
}))
