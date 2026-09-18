import { useMutation } from '@tanstack/react-query'
import { usersApi } from '@/lib/api/resources'
import { useUserStore } from '@/lib/store/useUserStore'

interface IdentityInput {
  name: string
  email: string
  phone: string
}

export function useIdentify() {
  const setUser = useUserStore((s) => s.setUser)

  return useMutation({
    mutationFn: async (input: IdentityInput) => {
      const users = await usersApi.list()
      const existing = users.find((u) => u.email.toLowerCase() === input.email.toLowerCase())
      if (existing) {
        if (existing.name !== input.name || existing.phone !== input.phone) {
          return usersApi.update(existing.id, {
            name: input.name,
            email: existing.email,
            phone: input.phone,
            role: existing.role,
          })
        }
        return existing
      }
      return usersApi.create({ ...input, role: 'CUSTOMER' })
    },
    onSuccess: (user) => setUser(user),
  })
}
