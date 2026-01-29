'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiHeart, FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account')
      }

      // Redirect to login
      router.push('/login?registered=true')
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-lavender-400 to-rose-400 flex items-center justify-center">
              <FiHeart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-semibold text-lavender-800">Maternal Wellness</span>
          </Link>
        </div>

        {/* Form Card */}
        <div className="glass rounded-3xl p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-lavender-800 text-center mb-2">
            Start Your Journey
          </h1>
          <p className="text-lavender-600 text-center mb-8">
            Create your free account today
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-50 border border-rose-200 text-rose-600 rounded-xl p-4 text-sm"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-lavender-700 mb-2">
                Your Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lavender-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-lavender-200 focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200 outline-none transition-all bg-white/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-lavender-700 mb-2">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lavender-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-lavender-200 focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200 outline-none transition-all bg-white/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-lavender-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lavender-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-lavender-200 focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200 outline-none transition-all bg-white/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-lavender-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lavender-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-lavender-200 focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200 outline-none transition-all bg-white/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-lavender-500 to-rose-400 text-white font-semibold hover:shadow-lg transition-all btn-glow disabled:opacity-70 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <FiArrowRight className="ml-2" />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-lavender-600">
            Already have an account?{' '}
            <Link href="/login" className="text-lavender-700 font-semibold hover:text-lavender-900">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
