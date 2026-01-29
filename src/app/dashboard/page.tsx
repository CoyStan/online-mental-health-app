'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FiHeart, FiActivity, FiUsers, FiStar, FiLogOut,
  FiUser, FiSettings, FiArrowRight, FiSun, FiMoon
} from 'react-icons/fi'
import { BiBaby } from 'react-icons/bi'
import { GiLotus } from 'react-icons/gi'

interface Category {
  id: string
  name: string
  description: string
  icon: string
  color: string
  order: number
  _count: { tracks: number }
}

interface UserProgress {
  completedTracks: number
  totalTracks: number
}

const iconMap: Record<string, any> = {
  heart: FiHeart,
  activity: FiActivity,
  users: FiUsers,
  baby: BiBaby,
  spa: GiLotus,
  star: FiStar,
}

const categoryGradients: Record<string, string> = {
  'emotional-wellness': 'from-rose-400 to-rose-500',
  'physical-health': 'from-sage-400 to-sage-500',
  'relationships-&-support': 'from-sky-400 to-sky-500',
  'baby-care-basics': 'from-peach-400 to-peach-500',
  'self-care-&-mindfulness': 'from-lavender-400 to-lavender-500',
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [progress, setProgress] = useState<UserProgress>({ completedTracks: 0, totalTracks: 0 })
  const [loading, setLoading] = useState(true)
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session?.user && !session.user.surveyCompleted) {
      router.push('/survey')
    }
  }, [status, session, router])

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  useEffect(() => {
    if (session?.user) {
      fetchData()
    }
  }, [session])

  const fetchData = async () => {
    try {
      const [categoriesRes, progressRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/user/progress'),
      ])
      const categoriesData = await categoriesRes.json()
      const progressData = await progressRes.json()
      setCategories(categoriesData)
      setProgress(progressData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-lavender-200 border-t-lavender-500 rounded-full animate-spin" />
      </div>
    )
  }

  const progressPercentage = progress.totalTracks > 0
    ? Math.round((progress.completedTracks / progress.totalTracks) * 100)
    : 0

  return (
    <div className="min-h-screen pb-20">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-lavender-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lavender-400 to-rose-400 flex items-center justify-center">
                <FiHeart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-lavender-800">Maternal Wellness</span>
            </div>

            <div className="flex items-center space-x-4">
              {session?.user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="flex items-center px-4 py-2 rounded-lg text-lavender-600 hover:bg-lavender-100 transition-colors"
                >
                  <FiSettings className="w-4 h-4 mr-2" />
                  Admin
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center px-4 py-2 rounded-lg text-lavender-600 hover:bg-lavender-100 transition-colors"
              >
                <FiLogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-lavender-800 mb-2">
            {greeting}, {session?.user?.name?.split(' ')[0]}! 💜
          </h1>
          <p className="text-lavender-600 text-lg">
            Continue your wellness journey today
          </p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-lavender-800 mb-1">Your Progress</h2>
              <p className="text-lavender-600">
                {progress.completedTracks} of {progress.totalTracks} tracks completed
              </p>
            </div>
            <div className="flex-1 max-w-md">
              <div className="h-4 bg-white/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-lavender-400 to-rose-400 rounded-full"
                />
              </div>
              <p className="text-right text-sm text-lavender-500 mt-1">
                {progressPercentage}% complete
              </p>
            </div>
          </div>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-lavender-800 mb-6">
            Explore Wellness Tracks
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const Icon = iconMap[category.icon] || FiStar
              const gradient = categoryGradients[category.id] || 'from-lavender-400 to-lavender-500'

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <Link href={`/tracks/${category.id}`}>
                    <div className="glass rounded-2xl p-6 h-full card-lift cursor-pointer group">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-lavender-800 mb-2">
                        {category.name}
                      </h3>
                      <p className="text-lavender-600 mb-4">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-lavender-500">
                          {category._count?.tracks || 0} tracks
                        </span>
                        <span className={`text-sm font-medium bg-gradient-to-r ${gradient} bg-clip-text text-transparent group-hover:translate-x-1 transition-transform inline-flex items-center`}>
                          Explore <FiArrowRight className="ml-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <Link href="/survey">
            <div className="glass rounded-2xl p-6 card-lift cursor-pointer group">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-peach-400 flex items-center justify-center mr-4">
                  <FiHeart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lavender-800 group-hover:text-lavender-600">
                    Take Wellness Check-In
                  </h3>
                  <p className="text-sm text-lavender-500">
                    Update your current mood and feelings
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lavender-400 to-sky-400 flex items-center justify-center mr-4">
                <FiSun className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lavender-800">
                  Daily Affirmation
                </h3>
                <p className="text-sm text-lavender-600 italic">
                  "You are doing an amazing job. Take it one moment at a time."
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
