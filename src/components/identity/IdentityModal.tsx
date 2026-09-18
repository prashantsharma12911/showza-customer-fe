import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useIdentify } from '@/lib/hooks/useIdentity'
import { useUserStore } from '@/lib/store/useUserStore'

export function IdentityModal({ onClose }: { onClose: () => void }) {
  const user = useUserStore((s) => s.user)
  const identify = useIdentify()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')

  const canSubmit = name.trim().length > 1 && /\S+@\S+\.\S+/.test(email) && phone.trim().length > 5

  async function handleSubmit() {
    if (!canSubmit) return
    await identify.mutateAsync({ name: name.trim(), email: email.trim(), phone: phone.trim() })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-text-h">{user ? 'Update your details' : 'Who is booking?'}</h2>
        <p className="mt-1 text-sm text-text-muted">
          We use this to identify your bookings. No password needed.
        </p>

        <div className="mt-5 flex flex-col gap-3">
          <input
            className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm text-text outline-none focus:border-brand"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm text-text outline-none focus:border-brand"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm text-text outline-none focus:border-brand"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {identify.isError && (
          <p className="mt-3 text-sm text-brand">Something went wrong. Please try again.</p>
        )}

        <div className="mt-5 flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            disabled={!canSubmit}
            loading={identify.isPending}
            onClick={handleSubmit}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
