export default function Input({ label, className = '', ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</label>}
      <input
        className={`w-full px-3 py-2.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500 focus:border-transparent transition-all text-sm ${className}`}
        {...props}
      />
    </div>
  )
}
