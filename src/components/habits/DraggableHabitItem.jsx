import { motion } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Check, Trash2, GripVertical } from 'lucide-react'
import CategoryBadge from '../ui/CategoryBadge'

export default function DraggableHabitItem({ habit, completed, onToggle, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    over,
  } = useSortable({ id: habit.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const isOver = over && over.id === habit.id

  return (
    <>
      {/* Drop indicator */}
      {isOver && !isDragging && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: '4px', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="w-full h-1 bg-blue-500 rounded-full mb-2"
        />
      )}
      
      <motion.div
        ref={setNodeRef}
        style={style}
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isDragging ? 0.8 : 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className={`flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-zinc-900 border transition-all group relative ${
          isDragging 
            ? 'border-blue-400 dark:border-blue-500 shadow-xl scale-105 rotate-2 z-50' 
            : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
        } ${
          isOver && !isDragging ? 'border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/20' : ''
        }`}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className={`p-1 rounded cursor-grab active:cursor-grabbing transition-colors ${
            isDragging 
              ? 'text-blue-500' 
              : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400'
          }`}
        >
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Checkbox */}
        <button
          onClick={onToggle}
          disabled={isDragging}
          className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 cursor-pointer ${
            completed
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-400'
          } ${
            isDragging ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          {completed && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <Check className="w-4 h-4" />
            </motion.div>
          )}
        </button>

        {/* Habit Name */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium transition-all ${
            completed 
              ? 'line-through text-zinc-400 dark:text-zinc-500' 
              : 'text-zinc-800 dark:text-zinc-200'
          } ${
            isDragging ? 'text-zinc-500' : ''
          }`}>
            {habit.name}
          </p>
        </div>

        {/* Category Badge */}
        <div className={isDragging ? 'opacity-50' : ''}>
          <CategoryBadge categoryId={habit.category} />
        </div>

        {/* Delete Button */}
        <button
          onClick={onDelete}
          disabled={isDragging}
          className={`p-1.5 rounded-lg transition-all cursor-pointer ${
            isDragging 
              ? 'cursor-not-allowed opacity-30' 
              : 'text-zinc-400 dark:text-zinc-600 hover:text-red-400 hover:bg-red-400/10'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        {/* Dragging overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-blue-500/10 rounded-xl pointer-events-none" />
        )}
      </motion.div>
    </>
  )
}
