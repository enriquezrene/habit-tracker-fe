import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { CATEGORIES, MAX_HABITS_PER_CATEGORY } from '../../lib/constants'
import Button from '../ui/Button'
import Input from '../ui/Input'

export default function CreateHabitModal({ open, onClose, onSubmit, habitCounts }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('energy')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Give your habit a name.')
      return
    }

    const count = habitCounts[category] || 0
    if (count >= MAX_HABITS_PER_CATEGORY) {
      setError(`Maximum ${MAX_HABITS_PER_CATEGORY} habits per category.`)
      return
    }

    onSubmit({ name: name.trim(), category })
    setName('')
    setCategory('energy')
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">New Habit</h2>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Habit Name"
                placeholder="e.g., Meditate for 10 minutes"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">Category</label>
                <div className="flex gap-2">
                  {CATEGORIES.map((cat) => {
                    const count = habitCounts[cat.id] || 0
                    const isFull = count >= MAX_HABITS_PER_CATEGORY
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        disabled={isFull}
                        onClick={() => setCategory(cat.id)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                          category === cat.id
                            ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900'
                            : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-750'
                        }`}
                        style={
                          category === cat.id
                            ? { backgroundColor: `${cat.color}20`, color: cat.color, ringColor: cat.color }
                            : {}
                        }
                      >
                        {cat.label}
                        <span className="block text-xs mt-0.5 opacity-60">{count}/{MAX_HABITS_PER_CATEGORY}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <Button type="submit" className="w-full">
                Create Habit
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
