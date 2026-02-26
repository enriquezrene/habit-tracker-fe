import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
