import { motion } from 'framer-motion'
import { Check, Trash2 } from 'lucide-react'
import CategoryBadge from '../ui/CategoryBadge'

export default function HabitItem({ habit, completed, onToggle, onDelete }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group"
    >
      <button
        onClick={onToggle}
        className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 cursor-pointer ${
          completed
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : 'border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-400'
        }`}
      >
        {completed && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <Check className="w-4 h-4" />
          </motion.div>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium transition-all ${completed ? 'line-through text-zinc-400 dark:text-zinc-500' : 'text-zinc-800 dark:text-zinc-200'}`}>
          {habit.name}
        </p>
      </div>

      <CategoryBadge categoryId={habit.category} />

      <button
        onClick={onDelete}
        className="p-1.5 rounded-lg text-zinc-300 dark:text-zinc-600 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  )
}
