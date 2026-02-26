import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { STOIC_QUOTES } from '../lib/constants'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, signup, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const quote = useMemo(
    () => STOIC_QUOTES[Math.floor(Math.random() * STOIC_QUOTES.length)],
    []
  )

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignup) {
        await signup(email, password)
      } else {
        await login(email, password)
      }
      navigate('/')
    } catch (err) {
      const messages = {
        'auth/invalid-credential': 'Invalid email or password.',
        'auth/email-already-in-use': 'This email is already registered.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/invalid-email': 'Please enter a valid email.',
      }
      setError(messages[err.code] || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError('')
    try {
      await loginWithGoogle()
      navigate('/')
    } catch (err) {
      setError('Google sign-in failed. Try again.')
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm"
      >
        {/* Logo & Quote */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Flame className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold tracking-tight">Forge</h1>
          </div>

          <motion.blockquote
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <p className="text-zinc-500 dark:text-zinc-400 text-sm italic leading-relaxed">
              "{quote.text}"
            </p>
            <cite className="text-zinc-600 text-xs not-italic">— {quote.author}</cite>
          </motion.blockquote>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400"
            >
              {error}
            </motion.p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Loading...' : isSignup ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
          <span className="text-xs text-zinc-400 dark:text-zinc-600">or</span>
          <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
        </div>

        {/* Google */}
        <Button variant="google" onClick={handleGoogle} className="w-full flex items-center justify-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </Button>

        {/* Toggle */}
        <p className="text-center text-sm text-zinc-500 mt-6">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => { setIsSignup(!isSignup); setError('') }}
            className="text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium cursor-pointer"
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </motion.div>
    </div>
  )
}
