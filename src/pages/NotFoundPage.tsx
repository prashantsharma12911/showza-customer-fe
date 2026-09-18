import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="text-4xl font-bold text-text-h">404</h1>
      <p className="text-sm text-text-muted">This page doesn't exist.</p>
      <Link to="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  )
}
