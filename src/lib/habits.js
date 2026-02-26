import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  getDoc,
} from 'firebase/firestore'
import { db } from './firebase'
import { format } from 'date-fns'

// --- Habits CRUD ---

function habitsCollection(userId) {
  return collection(db, 'users', userId, 'habits')
}

function completionsCollection(userId) {
  return collection(db, 'users', userId, 'completions')
}

export async function getHabits(userId) {
  const snap = await getDocs(habitsCollection(userId))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function createHabit(userId, habit) {
  const ref = doc(habitsCollection(userId))
  const data = {
    name: habit.name,
    category: habit.category,
    // frequency type ready for future extension
    frequency: { type: 'daily' },
    createdAt: new Date().toISOString(),
  }
  await setDoc(ref, data)
  return { id: ref.id, ...data }
}

export async function deleteHabit(userId, habitId) {
  await deleteDoc(doc(habitsCollection(userId), habitId))
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
