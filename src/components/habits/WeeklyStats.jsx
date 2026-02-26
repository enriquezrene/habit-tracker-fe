import { CATEGORIES } from '../../lib/constants'
import ProgressRing from '../ui/ProgressRing'

export default function DailyStats({ stats }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {CATEGORIES.map((cat) => (
        <div
          key={cat.id}
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
        >
          <ProgressRing percentage={stats[cat.id] || 0} color={cat.color} />
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{cat.label}</span>
        </div>
      ))}
    </div>
  )
}
