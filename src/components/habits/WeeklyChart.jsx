import { format } from 'date-fns'
import { TrendingUp, Target } from 'lucide-react'

export default function WeeklyChart({ weeklyStats }) {
  const maxPercentage = 100
  const barHeight = 200
  
  const getBarColor = (percentage) => {
    if (percentage >= 80) return 'bg-emerald-500'
    if (percentage >= 60) return 'bg-blue-500'
    if (percentage >= 40) return 'bg-yellow-500'
    return 'bg-zinc-300'
  }

  const getDayLabel = (dateStr) => {
    const date = new Date(dateStr)
    return format(date, 'EEE').charAt(0) // M, T, W, T, F, S, S
  }

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">This Week</h3>
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <Target className="w-4 h-4" />
          <span>{weeklyStats.overallCompletion}% complete</span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64 mb-4">
        <div className="absolute inset-0 flex items-end justify-between gap-1">
          {weeklyStats.dailyCompletion.map((day, index) => (
            <div
              key={day.date}
              className="flex-1 flex flex-col items-center justify-end"
              title={`${getDayLabel(day.date)}: ${day.percentage}%`}
            >
              {/* Percentage label above bar */}
              {day.percentage > 0 && (
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  {day.percentage}%
                </span>
              )}
              {/* Bar */}
              <div
                className={`w-full rounded-t transition-all duration-300 ${getBarColor(day.percentage)}`}
                style={{
                  height: `${(day.percentage / maxPercentage) * barHeight}px`,
                  minHeight: day.percentage > 0 ? '4px' : '0'
                }}
              />
              {/* Day label */}
              <span className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
                {getDayLabel(day.date)}
              </span>
            </div>
          ))}
        </div>
        
        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-full flex flex-col justify-between">
            {[0, 25, 50, 75, 100].map((percent) => (
              <div
                key={percent}
                className="border-t border-zinc-200 dark:border-zinc-800 border-dashed"
                style={{ top: `${100 - percent}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
            {weeklyStats.completedDays}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-500">Active Days</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
            {weeklyStats.categoryStats.energy.percentage}%
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-500">Energy</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
            {weeklyStats.categoryStats.work.percentage}%
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-500">Work</p>
        </div>
      </div>
    </div>
  )
}
