import { useState, useEffect, useCallback, useRef } from 'react'
import { format, addDays, subDays } from 'date-fns'
import { Plus } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import {
  getHabits,
  createHabit,
  deleteHabit,
  toggleCompletion,
  getCompletionsForDate,
  getDailyCompletionStats,
  getUserSettings,
} from '../lib/habits'
import { scheduleNotifications, clearAllNotifications } from '../lib/notifications'
import DateNavigator from '../components/habits/DateNavigator'
import HabitItem from '../components/habits/HabitItem'
import CreateHabitModal from '../components/habits/CreateHabitModal'
import DailyStats from '../components/habits/WeeklyStats'
import CelebrationOverlay from '../components/habits/CelebrationOverlay'
import OnboardingFlow from '../components/habits/OnboardingFlow'
import Button from '../components/ui/Button'
import { COMPLETION_MESSAGES } from '../lib/constants'
import toast from 'react-hot-toast'

function randomCompletionMessage() {
  return COMPLETION_MESSAGES[Math.floor(Math.random() * COMPLETION_MESSAGES.length)]
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [habits, setHabits] = useState([])
  const [completions, setCompletions] = useState(new Set())
  const [dailyStats, setDailyStats] = useState({})
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [modalOpen, setModalOpen] = useState(false)
  const [celebrate, setCelebrate] = useState(false)
  const [loading, setLoading] = useState(true)

  const habitsRef = useRef([])
  const completionsRef = useRef(new Set())

  const dateStr = format(selectedDate, 'yyyy-MM-dd')

  const loadData = useCallback(async () => {
    if (!user) return
    try {
      const [h, c] = await Promise.all([
        getHabits(user.uid),
        getCompletionsForDate(user.uid, dateStr),
      ])
      setHabits(h)
      setCompletions(c)
      habitsRef.current = h
      completionsRef.current = c
      setDailyStats(getDailyCompletionStats(h, c))
    } catch (err) {
      toast.error('Failed to load habits')
    } finally {
      setLoading(false)
    }
  }, [user, dateStr, selectedDate])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Schedule notifications based on user's reminder times
  useEffect(() => {
    if (!user) return

    async function setupNotifications() {
      const settings = await getUserSettings(user.uid)
      const times = settings.reminderTimes || []

      if (times.length > 0 && Notification.permission === 'granted') {
        scheduleNotifications(times, () => {
          const total = habitsRef.current.length
          const done = habitsRef.current.filter((h) => completionsRef.current.has(h.id)).length
          return total - done
        })
      }
    }

    setupNotifications()
    return () => clearAllNotifications()
  }, [user])

  async function handleToggle(habitId) {
    const newState = await toggleCompletion(user.uid, habitId, dateStr)
    const updated = new Set(completions)
    if (newState) {
      updated.add(habitId)
      toast(randomCompletionMessage(), {
        icon: '🔥',
        duration: 2500,
      })
    } else {
      updated.delete(habitId)
    }
    setCompletions(updated)
    completionsRef.current = updated

    // Check if all habits completed
    if (habits.length > 0 && habits.every((h) => updated.has(h.id))) {
      setCelebrate(true)
    }

    // Refresh stats
    setDailyStats(getDailyCompletionStats(habits, updated))
  }

  async function handleCreate(data) {
    const newHabit = await createHabit(user.uid, data)
    setHabits((prev) => [...prev, newHabit])
    toast.success('Habit created')
  }

  async function handleDelete(habitId) {
    await deleteHabit(user.uid, habitId)
    setHabits((prev) => prev.filter((h) => h.id !== habitId))
    toast.success('Habit deleted')

    const remainingHabits = habits.filter((h) => h.id !== habitId)
    const updatedCompletions = new Set(completions)
    updatedCompletions.delete(habitId)
    setDailyStats(getDailyCompletionStats(remainingHabits, updatedCompletions))
  }

  const habitCounts = habits.reduce((acc, h) => {
    acc[h.category] = (acc[h.category] || 0) + 1
    return acc
  }, {})

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-zinc-300 dark:border-zinc-600 border-t-zinc-800 dark:border-t-zinc-100 rounded-full animate-spin" />
      </div>
    )
  }

  if (!loading && habits.length === 0) {
    return (
      <OnboardingFlow
        userId={user.uid}
        onComplete={loadData}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Daily Stats */}
      <DailyStats stats={dailyStats} />

      {/* Date Navigation */}
      <DateNavigator
        date={selectedDate}
        onPrev={() => setSelectedDate((d) => subDays(d, 1))}
        onNext={() => setSelectedDate((d) => addDays(d, 1))}
      />

      {/* Habits List */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {habits.map((habit) => (
            <HabitItem
              key={habit.id}
              habit={habit}
              completed={completions.has(habit.id)}
              onToggle={() => handleToggle(habit.id)}
              onDelete={() => handleDelete(habit.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Add Button */}
      <Button onClick={() => setModalOpen(true)} className="w-full flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" />
        New Habit
      </Button>

      {/* Modal */}
      <CreateHabitModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
        habitCounts={habitCounts}
      />

      {/* Celebration */}
      <CelebrationOverlay show={celebrate} onDone={() => setCelebrate(false)} />
    </div>
  )
}
