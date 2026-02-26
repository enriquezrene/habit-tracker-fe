import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Zap, Target, Crown } from 'lucide-react'
import { HABIT_PRESETS, CATEGORIES } from '../../lib/constants'
import { createHabit } from '../../lib/habits'
import Button from '../ui/Button'

const LEVEL_ICONS = {
  beginner: Zap,
  intermediate: Target,
  advanced: Crown,
}

const LEVEL_COLORS = {
  beginner: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 hover:border-emerald-500/60',
  intermediate: 'from-amber-500/20 to-amber-500/5 border-amber-500/30 hover:border-amber-500/60',
  advanced: 'from-red-500/20 to-red-500/5 border-red-500/30 hover:border-red-500/60',
}

const LEVEL_ICON_COLORS = {
  beginner: 'text-emerald-400',
  intermediate: 'text-amber-400',
  advanced: 'text-red-400',
}

export default function OnboardingFlow({ userId, onComplete }) {
  const [step, setStep] = useState('select') // 'select' | 'preview'
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    if (!selectedLevel) return
    setLoading(true)

    const preset = HABIT_PRESETS[selectedLevel]
    const categories = ['energy', 'work', 'love']

    for (const category of categories) {
      for (const name of preset[category]) {
        await createHabit(userId, { name, category })
      }
    }

    setLoading(false)
    onComplete()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[60vh] flex flex-col items-center justify-center"
    >
      <AnimatePresence mode="wait">
        {step === 'select' ? (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full space-y-8"
          >
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <Flame className="w-10 h-10 text-orange-500" />
              </div>
              <h1 className="text-2xl font-bold">Where are you on your journey?</h1>
              <p className="text-sm text-zinc-500 max-w-md mx-auto">
                We'll suggest 9 daily habits tailored to your level. You can always change them later.
              </p>
            </div>

            {/* Level Cards */}
            <div className="space-y-3">
              {Object.entries(HABIT_PRESETS).map(([key, preset]) => {
                const Icon = LEVEL_ICONS[key]
                const isSelected = selectedLevel === key
                return (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedLevel(key)}
                    className={`w-full text-left p-5 rounded-2xl border bg-gradient-to-br transition-all cursor-pointer ${LEVEL_COLORS[key]} ${
                      isSelected ? 'ring-2 ring-zinc-400 ring-offset-2 ring-offset-zinc-50 dark:ring-offset-zinc-950' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`mt-0.5 ${LEVEL_ICON_COLORS[key]}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-800 dark:text-zinc-100">{preset.subtitle}</p>
                        <p className="text-xs text-zinc-500 mt-1 italic">{preset.description}</p>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Continue */}
            <Button
              disabled={!selectedLevel}
              onClick={() => setStep('preview')}
              className="w-full"
            >
              See My Habits
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full space-y-6"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold">Your Starting Habits</h2>
              <p className="text-sm text-zinc-500">
                These will be your daily commitments. Ready to forge ahead?
              </p>
            </div>

            {/* Habit Preview by Category */}
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="space-y-2">
                <h3
                  className="text-sm font-semibold flex items-center gap-2"
                  style={{ color: cat.color }}
                >
                  {cat.label}
                </h3>
                <div className="space-y-1.5">
                  {HABIT_PRESETS[selectedLevel][cat.id].map((name) => (
                    <div
                      key={name}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
                    >
                      <div
                        className="w-5 h-5 rounded-md border-2 shrink-0"
                        style={{ borderColor: cat.color }}
                      />
                      <span className="text-sm text-zinc-600 dark:text-zinc-300">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setStep('select')}
                className="flex-1"
              >
                Go Back
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Forging...' : "Let's Begin"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
