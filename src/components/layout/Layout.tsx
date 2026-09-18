import type { ReactNode } from 'react'
import { Navbar } from './Navbar'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-bg">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6">{children}</main>
      <footer className="border-t border-border py-6 text-center text-xs text-text-muted">
        Showza — book your show, your way.
      </footer>
    </div>
  )
}
