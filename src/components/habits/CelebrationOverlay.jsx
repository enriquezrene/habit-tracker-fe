import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

export default function CelebrationOverlay({ show, onDone }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onDone, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onDone])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={onDone}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="text-center px-8"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-6xl mb-4"
            >
              🔥
            </motion.div>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-white mb-2"
            >
              All habits forged today!
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-zinc-300 text-sm"
            >
              Discipline is the bridge between goals and accomplishment.
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
