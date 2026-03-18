import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  getDoc,
  orderBy,
} from 'firebase/firestore'
import { db } from './firebase'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, subDays } from 'date-fns'

// --- Habits CRUD ---

function habitsCollection(userId) {
  return collection(db, 'users', userId, 'habits')
}

function completionsCollection(userId) {
  return collection(db, 'users', userId, 'completions')
}

export async function getHabits(userId) {
  const snap = await getDocs(habitsCollection(userId))
  const habits = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  // Sort by order field, fallback to creation date
  return habits.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order
    }
    if (a.order !== undefined) return -1
    if (b.order !== undefined) return 1
    return new Date(a.createdAt) - new Date(b.createdAt)
  })
}

export async function createHabit(userId, habit) {
  const ref = doc(habitsCollection(userId))
  // Get current max order to place new habit at the end
  const existingHabits = await getHabits(userId)
  const maxOrder = existingHabits.reduce((max, h) => Math.max(max, h.order || 0), 0)
  
  const data = {
    name: habit.name,
    category: habit.category,
    // frequency type ready for future extension
    frequency: { type: 'daily' },
    createdAt: new Date().toISOString(),
    order: maxOrder + 1,
  }
  await setDoc(ref, data)
  return { id: ref.id, ...data }
}

export async function deleteHabit(userId, habitId) {
  await deleteDoc(doc(habitsCollection(userId), habitId))
}

export async function reorderHabits(userId, habitIds) {
  // Update each habit with its new order
  const updates = habitIds.map((id, index) => 
    setDoc(doc(habitsCollection(userId), id), { order: index }, { merge: true })
  )
  await Promise.all(updates)
}

// --- Completions ---

function completionId(habitId, dateStr) {
  return `${habitId}_${dateStr}`
}

export async function toggleCompletion(userId, habitId, dateStr) {
  const id = completionId(habitId, dateStr)
  const ref = doc(completionsCollection(userId), id)
  const snap = await getDoc(ref)

  if (snap.exists()) {
    await deleteDoc(ref)
    return false
  } else {
    await setDoc(ref, { habitId, date: dateStr, completedAt: new Date().toISOString() })
    return true
  }
}

export async function getCompletionsForDate(userId, dateStr) {
  const q = query(completionsCollection(userId), where('date', '==', dateStr))
  const snap = await getDocs(q)
  const completedIds = new Set()
  snap.docs.forEach((d) => completedIds.add(d.data().habitId))
  return completedIds
}

export function getDailyCompletionStats(habits, completedIds) {
  const stats = {}
  const categories = ['energy', 'work', 'love']

  for (const category of categories) {
    const categoryHabits = habits.filter((h) => h.category === category)
    if (categoryHabits.length === 0) {
      stats[category] = 0
      continue
    }

    const completed = categoryHabits.filter((h) => completedIds.has(h.id)).length
    stats[category] = Math.round((completed / categoryHabits.length) * 100)
  }

  return stats
}

export async function getWeeklyCompletions(userId, date = new Date()) {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 }) // Monday
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 }) // Sunday
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })
  
  const dateStrings = days.map(d => format(d, 'yyyy-MM-dd'))
  const completionsByDate = {}
  
  // Initialize all days with empty sets
  dateStrings.forEach(dateStr => {
    completionsByDate[dateStr] = new Set()
  })
  
  // Firebase 'in' queries have a limit of 10 items, so we need to batch the queries
  const batchSize = 10
  for (let i = 0; i < dateStrings.length; i += batchSize) {
    const batch = dateStrings.slice(i, i + batchSize)
    const q = query(
      completionsCollection(userId), 
      where('date', 'in', batch),
      orderBy('date')
    )
    
    const snap = await getDocs(q)
    
    // Fill with actual completions
    snap.docs.forEach(doc => {
      const data = doc.data()
      if (!completionsByDate[data.date]) {
        completionsByDate[data.date] = new Set()
      }
      completionsByDate[data.date].add(data.habitId)
    })
  }
  
  return completionsByDate
}

export function getWeeklyStats(habits, weeklyCompletions) {
  const days = Object.keys(weeklyCompletions).sort()
  const stats = {
    totalDays: days.length,
    completedDays: 0,
    overallCompletion: 0,
    dailyCompletion: [],
    categoryStats: {}
  }
  
  const categories = ['energy', 'work', 'love']
  
  // Initialize category stats
  categories.forEach(cat => {
    stats.categoryStats[cat] = {
      totalPossible: 0,
      completed: 0,
      percentage: 0
    }
  })
  
  let totalPossible = 0
  let totalCompleted = 0
  
  days.forEach(dateStr => {
    const dayCompletions = weeklyCompletions[dateStr]
    const dayTotal = habits.length
    const dayCompleted = dayCompletions.size
    const dayPercentage = dayTotal > 0 ? Math.round((dayCompleted / dayTotal) * 100) : 0
    
    totalPossible += dayTotal
    totalCompleted += dayCompleted
    
    if (dayPercentage > 0) stats.completedDays++
    
    stats.dailyCompletion.push({
      date: dateStr,
      percentage: dayPercentage,
      completed: dayCompleted,
      total: dayTotal
    })
    
    // Category stats for this day
    categories.forEach(cat => {
      const catHabits = habits.filter(h => h.category === cat)
      const catCompleted = catHabits.filter(h => dayCompletions.has(h.id)).length
      
      stats.categoryStats[cat].totalPossible += catHabits.length
      stats.categoryStats[cat].completed += catCompleted
    })
  })
  
  // Calculate final percentages
  stats.overallCompletion = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0
  
  categories.forEach(cat => {
    const catStat = stats.categoryStats[cat]
    catStat.percentage = catStat.totalPossible > 0 ? Math.round((catStat.completed / catStat.totalPossible) * 100) : 0
  })
  
  return stats
}

export async function getMonthlyCompletions(userId, date = new Date()) {
  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(date)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  
  const dateStrings = days.map(d => format(d, 'yyyy-MM-dd'))
  const completionsByDate = {}
  
  // Initialize all days with empty sets
  dateStrings.forEach(dateStr => {
    completionsByDate[dateStr] = new Set()
  })
  
  // Firebase 'in' queries have a limit of 10 items, so we need to batch the queries
  const batchSize = 10
  for (let i = 0; i < dateStrings.length; i += batchSize) {
    const batch = dateStrings.slice(i, i + batchSize)
    const q = query(
      completionsCollection(userId), 
      where('date', 'in', batch),
      orderBy('date')
    )
    
    const snap = await getDocs(q)
    
    // Fill with actual completions
    snap.docs.forEach(doc => {
      const data = doc.data()
      if (!completionsByDate[data.date]) {
        completionsByDate[data.date] = new Set()
      }
      completionsByDate[data.date].add(data.habitId)
    })
  }
  
  return completionsByDate
}

export function getMonthlyStats(habits, monthlyCompletions) {
  const days = Object.keys(monthlyCompletions).sort()
  const stats = {
    totalDays: days.length,
    completedDays: 0,
    overallCompletion: 0,
    dailyCompletion: [],
    weeklyBreakdown: [],
    categoryStats: {}
  }
  
  const categories = ['energy', 'work', 'love']
  
  // Initialize category stats
  categories.forEach(cat => {
    stats.categoryStats[cat] = {
      totalPossible: 0,
      completed: 0,
      percentage: 0
    }
  })
  
  let totalPossible = 0
  let totalCompleted = 0
  
  // Group by weeks
  const weeks = []
  let currentWeek = []
  
  days.forEach((dateStr, index) => {
    const dayCompletions = monthlyCompletions[dateStr]
    const dayTotal = habits.length
    const dayCompleted = dayCompletions.size
    const dayPercentage = dayTotal > 0 ? Math.round((dayCompleted / dayTotal) * 100) : 0
    
    totalPossible += dayTotal
    totalCompleted += dayCompleted
    
    if (dayPercentage > 0) stats.completedDays++
    
    stats.dailyCompletion.push({
      date: dateStr,
      percentage: dayPercentage,
      completed: dayCompleted,
      total: dayTotal
    })
    
    currentWeek.push(dayPercentage)
    
    // Check if it's Sunday (end of week) or last day
    const dayOfWeek = new Date(dateStr).getDay()
    if (dayOfWeek === 0 || index === days.length - 1) {
      const weekAvg = currentWeek.length > 0 ? Math.round(currentWeek.reduce((a, b) => a + b, 0) / currentWeek.length) : 0
      weeks.push(weekAvg)
      currentWeek = []
    }
    
    // Category stats for this day
    categories.forEach(cat => {
      const catHabits = habits.filter(h => h.category === cat)
      const catCompleted = catHabits.filter(h => dayCompletions.has(h.id)).length
      
      stats.categoryStats[cat].totalPossible += catHabits.length
      stats.categoryStats[cat].completed += catCompleted
    })
  })
  
  stats.weeklyBreakdown = weeks
  
  // Calculate final percentages
  stats.overallCompletion = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0
  
  categories.forEach(cat => {
    const catStat = stats.categoryStats[cat]
    catStat.percentage = catStat.totalPossible > 0 ? Math.round((catStat.completed / catStat.totalPossible) * 100) : 0
  })
  
  return stats
}

// --- User Settings ---

export async function getUserSettings(userId) {
  const ref = doc(db, 'users', userId, 'settings', 'preferences')
  const snap = await getDoc(ref)
  if (snap.exists()) return snap.data()

  // First time: save default reminders
  const defaults = { reminderTimes: ['12:00', '16:00', '20:00'] }
  await setDoc(ref, defaults)
  return defaults
}

export async function updateUserSettings(userId, settings) {
  const ref = doc(db, 'users', userId, 'settings', 'preferences')
  await setDoc(ref, settings, { merge: true })
}

// --- Account Deletion ---

export async function deleteUserData(userId) {
  // Delete all habits
  const habitsSnap = await getDocs(habitsCollection(userId))
  for (const d of habitsSnap.docs) {
    await deleteDoc(d.ref)
  }

  // Delete all completions
  const completionsSnap = await getDocs(completionsCollection(userId))
  for (const d of completionsSnap.docs) {
    await deleteDoc(d.ref)
  }

  // Delete settings
  const settingsRef = doc(db, 'users', userId, 'settings', 'preferences')
  await deleteDoc(settingsRef)
}
