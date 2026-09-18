import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CityPicker } from '@/components/identity/CityPicker'
import { IdentityModal } from '@/components/identity/IdentityModal'
import { useUserStore } from '@/lib/store/useUserStore'

export function Navbar() {
  const user = useUserStore((s) => s.user)
  const [showIdentity, setShowIdentity] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    navigate(search.trim() ? `/?q=${encodeURIComponent(search.trim())}` : '/')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link to="/" className="shrink-0 text-xl font-bold tracking-tight text-text-h">
          Show<span className="text-brand">za</span>
        </Link>

        <form onSubmit={handleSearchSubmit} className="flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for movies..."
            className="w-full rounded-lg border border-border bg-surface-2 px-3.5 py-2 text-sm text-text outline-none placeholder:text-text-muted focus:border-brand"
          />
        </form>

        <CityPicker />

        <Link to="/my-bookings" className="hidden shrink-0 text-sm text-text hover:text-text-h sm:block">
          My Bookings
        </Link>

        <button
          onClick={() => setShowIdentity(true)}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-surface-2 px-3 py-2 text-sm font-medium text-text hover:bg-border"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
            {user ? user.name.charAt(0).toUpperCase() : '?'}
          </span>
          <span className="hidden max-w-24 truncate md:inline">{user ? user.name : 'Sign in'}</span>
        </button>
      </div>

      {showIdentity && <IdentityModal onClose={() => setShowIdentity(false)} />}
    </header>
  )
}
