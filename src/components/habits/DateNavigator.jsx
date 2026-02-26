import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, isToday } from 'date-fns'

export default function DateNavigator({ date, onPrev, onNext }) {
  const dateLabel = isToday(date)
    ? 'Today'
    : format(date, 'EEEE, MMM d')

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onPrev}
        className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="text-center">
        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{dateLabel}</p>
        {isToday(date) ? (
          <p className="text-xs text-zinc-400 dark:text-zinc-500">{format(date, 'EEEE, MMM d')}</p>
        ) : (
          <p className="text-xs text-zinc-400 dark:text-zinc-500">{format(date, 'yyyy')}</p>
        )}
      </div>

      <button
        onClick={onNext}
        className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
