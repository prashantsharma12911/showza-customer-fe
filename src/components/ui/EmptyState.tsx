export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 py-24 text-center">
      <p className="text-lg font-medium text-text">{title}</p>
      {subtitle && <p className="max-w-sm text-sm text-text-muted">{subtitle}</p>}
    </div>
  )
}
