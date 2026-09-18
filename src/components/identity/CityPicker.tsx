import { useState } from 'react'
import { useCities } from '@/lib/hooks/useCities'
import { useCityStore } from '@/lib/store/useCityStore'

export function CityPicker() {
  const { data: cities } = useCities()
  const { city, setCity } = useCityStore()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-text hover:bg-surface-2"
      >
        <span>{city ? city.name : 'Select city'}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 max-h-72 w-56 overflow-y-auto rounded-xl border border-border bg-surface p-1.5 shadow-2xl">
            {cities?.length ? (
              cities.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCity(c)
                    setOpen(false)
                  }}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-surface-2 ${
                    city?.id === c.id ? 'text-brand' : 'text-text'
                  }`}
                >
                  {c.name}
                  <span className="ml-1 text-xs text-text-muted">{c.state}</span>
                </button>
              ))
            ) : (
              <p className="px-3 py-2 text-sm text-text-muted">No cities found</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
