import { motion } from 'framer-motion'

const variants = {
  primary: 'bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200',
  secondary: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700',
  danger: 'bg-red-600/20 text-red-600 dark:text-red-400 hover:bg-red-600/30 border border-red-300 dark:border-red-800',
  google: 'bg-white text-zinc-900 hover:bg-zinc-100 border border-zinc-300',
}

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
