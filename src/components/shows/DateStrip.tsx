import { formatDateLabel } from '@/lib/utils/format'

export function DateStrip({
  dates,
  selected,
  onSelect,
}: {
  dates: string[]
  selected: string
  onSelect: (date: string) => void
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {dates.map((date) => {
        const { weekday, day, month } = formatDateLabel(date)
        const isSelected = date === selected
        return (
          <button
            key={date}
            onClick={() => onSelect(date)}
            className={`flex w-16 shrink-0 flex-col items-center rounded-lg border px-2 py-2 text-center transition-colors ${
              isSelected
                ? 'border-brand bg-brand text-white'
                : 'border-border bg-surface text-text hover:border-text-muted'
            }`}
          >
            <span className="text-[10px] uppercase opacity-80">{weekday}</span>
            <span className="text-base font-semibold">{day}</span>
            <span className="text-[10px] uppercase opacity-80">{month}</span>
          </button>
        )
      })}
    </div>
  )
}
