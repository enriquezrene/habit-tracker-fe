import { useState, useEffect, useCallback, useRef } from 'react'
import { format } from 'date-fns'
import { TrendingUp, Calendar, Target, Activity } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import {
  getHabits,
  getWeeklyCompletions,
  getWeeklyStats,
  getMonthlyCompletions,
  getMonthlyStats,
} from '../lib/habits'
import WeeklyChart from '../components/habits/WeeklyChart'
import MonthlyChart from '../components/habits/MonthlyChart'
import toast from 'react-hot-toast'

export default function StatisticsPage() {
  const { user } = useAuth()
  const [habits, setHabits] = useState([])
  const [weeklyStats, setWeeklyStats] = useState(null)
  const [monthlyStats, setMonthlyStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())

  const habitsRef = useRef([])

  const loadData = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      
      // Load habits first
      const h = await getHabits(user.uid)
      setHabits(h)
      habitsRef.current = h
      
      if (!h || h.length === 0) {
        setWeeklyStats(null)
        setMonthlyStats(null)
        return
      }
      
      // Load statistics
      const [weeklyCompletions, monthlyCompletions] = await Promise.all([
        getWeeklyCompletions(user.uid, selectedDate),
        getMonthlyCompletions(user.uid, selectedDate)
      ])
      
      const weekly = getWeeklyStats(h, weeklyCompletions)
      const monthly = getMonthlyStats(h, monthlyCompletions)
      
      setWeeklyStats(weekly)
      setMonthlyStats(monthly)
    } catch (err) {
      console.error('Failed to load statistics:', err)
      toast.error(`Failed to load statistics: ${err.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }, [user, selectedDate])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-zinc-300 dark:border-zinc-600 border-t-zinc-800 dark:border-t-zinc-100 rounded-full animate-spin" />
      </div>
    )
  }

  if (!loading && habits.length === 0) {
    return (
      <div className="text-center py-20">
        <Activity className="w-16 h-16 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
          No habits yet
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          Start creating habits to see your progress statistics here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200 mb-2">
          Your Progress
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Track your habit performance and see how you're improving over time.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Habits</span>
          </div>
          <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">{habits.length}</p>
        </div>
        
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Active Days (Week)</span>
          </div>
          <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
            {weeklyStats?.completedDays || 0}
          </p>
        </div>
        
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Weekly Score</span>
          </div>
          <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
            {weeklyStats?.overallCompletion || 0}%
          </p>
        </div>
        
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Monthly Score</span>
          </div>
          <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
            {monthlyStats?.overallCompletion || 0}%
          </p>
        </div>
      </div>

      {/* Charts */}
      {weeklyStats && monthlyStats && (
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
              Performance Analytics
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeeklyChart weeklyStats={weeklyStats} />
              <MonthlyChart monthlyStats={monthlyStats} />
            </div>
          </div>

          {/* Category Performance Summary */}
          <div>
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
              Category Breakdown
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(monthlyStats.categoryStats || {}).map(([category, stats]) => (
                <div key={category} className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-medium capitalize text-zinc-800 dark:text-zinc-200">
                      {category}
                    </span>
                    <span className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
                      {stats.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        stats.percentage >= 80 ? 'bg-emerald-500' :
                        stats.percentage >= 60 ? 'bg-blue-500' :
                        stats.percentage >= 40 ? 'bg-yellow-500' : 'bg-zinc-300'
                      }`}
                      style={{ width: `${stats.percentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                    {stats.completed} of {stats.totalPossible} completed
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
