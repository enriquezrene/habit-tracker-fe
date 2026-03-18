import { format } from 'date-fns'
import { TrendingUp, Target, Calendar } from 'lucide-react'

export default function MonthlyChart({ monthlyStats }) {
  const maxPercentage = 100
  const barHeight = 200
  
  const getBarColor = (percentage) => {
    if (percentage >= 80) return 'bg-emerald-500'
    if (percentage >= 60) return 'bg-blue-500'
    if (percentage >= 40) return 'bg-yellow-500'
    return 'bg-zinc-300'
  }

  const getWeekLabel = (weekIndex, totalWeeks) => {
    if (totalWeeks <= 5) return `W${weekIndex + 1}`
    return `W${weekIndex + 1}`
  }

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">This Month</h3>
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <Target className="w-4 h-4" />
          <span>{monthlyStats.overallCompletion}% complete</span>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="mb-6">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-3">Weekly Performance</p>
        <div className="relative h-32 mb-4">
          <div className="absolute inset-0 flex items-end justify-between gap-2">
            {monthlyStats.weeklyBreakdown.map((weekAvg, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center justify-end"
                title={`${getWeekLabel(index, monthlyStats.weeklyBreakdown.length)}: ${weekAvg}%`}
              >
                <div className="w-full flex flex-col items-center">
                  {/* Bar */}
                  <div
                    className={`w-full rounded-t transition-all duration-300 ${getBarColor(weekAvg)}`}
                    style={{
                      height: `${(weekAvg / maxPercentage) * barHeight}px`,
                      minHeight: weekAvg > 0 ? '4px' : '0'
                    }}
                  />
                  {/* Percentage label on top of bar */}
                  {weekAvg > 0 && (
                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mt-1">
                      {weekAvg}%
                    </span>
                  )}
                </div>
                {/* Week label */}
                <span className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
                  {getWeekLabel(index, monthlyStats.weeklyBreakdown.length)}
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
      </div>

      {/* Category Performance */}
      <div className="mb-6">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-3">Category Performance</p>
        <div className="space-y-2">
          {Object.entries(monthlyStats.categoryStats).map(([category, stats]) => (
            <div key={category} className="flex items-center gap-3">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 w-16 capitalize">
                {category}
              </span>
              <div className="flex-1 bg-zinc-200 dark:bg-zinc-700 rounded-full h-2 relative overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${getBarColor(stats.percentage)}`}
                  style={{ width: `${stats.percentage}%` }}
                />
              </div>
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 w-12 text-right">
                {stats.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-3 text-center">
        <div>
          <p className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
            {monthlyStats.completedDays}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-500">Active Days</p>
        </div>
        <div>
          <p className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
            {Math.round(monthlyStats.overallCompletion)}%
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-500">Overall</p>
        </div>
        <div>
          <p className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
            {monthlyStats.weeklyBreakdown.length}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-500">Weeks</p>
        </div>
        <div>
          <p className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
            {Math.round(monthlyStats.weeklyBreakdown.reduce((a, b) => a + b, 0) / monthlyStats.weeklyBreakdown.length || 0)}%
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-500">Avg Week</p>
        </div>
      </div>
    </div>
  )
}
