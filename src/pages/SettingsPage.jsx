import { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Trash2, Bell, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getUserSettings, updateUserSettings, deleteUserData } from '../lib/habits'
import Button from '../components/ui/Button'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [reminderTimes, setReminderTimes] = useState([])
  const [newTime, setNewTime] = useState('09:00')
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteText, setDeleteText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function load() {
      const settings = await getUserSettings(user.uid)
      setReminderTimes(settings.reminderTimes || [])
      setLoading(false)
    }
    load()
  }, [user.uid])

  async function addReminder() {
    if (reminderTimes.includes(newTime)) {
      toast.error('This time is already set')
      return
    }
    const updated = [...reminderTimes, newTime].sort()
    setReminderTimes(updated)
    await updateUserSettings(user.uid, { reminderTimes: updated })
    toast.success('Reminder added')
  }

  async function removeReminder(time) {
    const updated = reminderTimes.filter((t) => t !== time)
    setReminderTimes(updated)
    await updateUserSettings(user.uid, { reminderTimes: updated })
    toast.success('Reminder removed')
  }

  async function requestNotificationPermission() {
    if (!('Notification' in window)) {
      toast.error('Notifications not supported in this browser')
      return
    }

    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      toast.success('Notifications enabled!')
    } else {
      toast.error('Notification permission denied')
    }
  }

  async function handleDeleteAccount() {
    if (deleteText !== 'DELETE') return
    setDeleting(true)
    try {
      await deleteUserData(user.uid)
      await user.delete()
      navigate('/login')
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') {
        toast.error('Please sign out and sign back in, then try again.')
      } else {
        toast.error('Failed to delete account. Try again.')
      }
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-zinc-300 dark:border-zinc-600 border-t-zinc-800 dark:border-t-zinc-100 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Back */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div>
        <h1 className="text-xl font-semibold mb-1">Settings</h1>
        <p className="text-sm text-zinc-500">Configure your daily reminders</p>
      </div>

      {/* Enable Notifications */}
      <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-zinc-400" />
            <div>
              <p className="text-sm font-medium">Browser Notifications</p>
              <p className="text-xs text-zinc-500">Required for reminders to work</p>
            </div>
          </div>
          <Button variant="secondary" onClick={requestNotificationPermission}>
            Enable
          </Button>
        </div>
      </div>

      {/* Reminder Times */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Daily Reminder Times</h2>

        {reminderTimes.length === 0 && (
          <p className="text-sm text-zinc-400 dark:text-zinc-600">No reminders set. Add one below.</p>
        )}

        <div className="space-y-2">
          {reminderTimes.map((time) => (
            <div
              key={time}
              className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
            >
              <span className="text-sm font-medium font-mono">{time}</span>
              <button
                onClick={() => removeReminder(time)}
                className="p-1.5 rounded-lg text-zinc-400 dark:text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="flex-1 px-3 py-2.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
          />
          <Button onClick={addReminder} className="flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
        <h2 className="text-sm font-medium text-red-500 dark:text-red-400">Danger Zone</h2>

        {!showDeleteConfirm ? (
          <Button variant="danger" onClick={() => setShowDeleteConfirm(true)} className="w-full">
            Delete My Account
          </Button>
        ) : (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-600 dark:text-red-300">This action is permanent</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  All your habits, completions, and settings will be permanently deleted. This cannot be undone.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs text-zinc-500">
                Type <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300">DELETE</span> to confirm
              </label>
              <input
                type="text"
                value={deleteText}
                onChange={(e) => setDeleteText(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-zinc-400 dark:placeholder-zinc-600"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => { setShowDeleteConfirm(false); setDeleteText('') }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                disabled={deleteText !== 'DELETE' || deleting}
                onClick={handleDeleteAccount}
                className="flex-1"
              >
                {deleting ? 'Deleting...' : 'Permanently Delete'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
