import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/lib/api/types'

interface UserState {
  user: User | null
  setUser: (user: User | null) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    { name: 'showza-user' },
  ),
)
