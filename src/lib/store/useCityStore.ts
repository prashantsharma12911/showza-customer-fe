import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { City } from '@/lib/api/types'

interface CityState {
  city: City | null
  setCity: (city: City | null) => void
}

export const useCityStore = create<CityState>()(
  persist(
    (set) => ({
      city: null,
      setCity: (city) => set({ city }),
    }),
    { name: 'showza-city' },
  ),
)
