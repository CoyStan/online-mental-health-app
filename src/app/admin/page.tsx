'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FiUsers, FiBookOpen, FiCalendar, FiDownload,
  FiSettings, FiArrowLeft, FiTrendingUp, FiUserCheck,
  FiMessageSquare, FiAlertCircle
} from 'react-icons/fi'

interface DashboardStats {
  totalUsers: number
  totalCoaches: number
  totalSessions: number
  completedSessions: number
  activeAssignments: number
  avgCompletionRate: number
  usersThisMonth: number
  sessionsThisMonth: number
  categoryCounts: Record<string, number>
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session?.user?.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [status, session, router])

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchStats()
    }
  }, [session])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
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

  if (session?.user?.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="glass border-b border-lavender-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="mr-4 text-lavender-600 hover:text-lavender-800"
              >
                <FiArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-lavender-800">Admin Dashboard</h1>
                <p className="text-sm text-lavender-500">Manage users, content, and coaching</p>
              </div>
            </div>
            <Link
              href="/api/admin/export"
              className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-lavender-500 to-rose-400 text-white hover:shadow-lg transition-shadow"
            >
              <FiDownload className="mr-2" />
              Export Data
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-lavender-500">Total Users</p>
                <p className="text-3xl font-bold text-lavender-800">{stats?.totalUsers || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-lavender-100 flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-lavender-600" />
              </div>
            </div>
            <p className="text-xs text-sage-600 mt-2">
              +{stats?.usersThisMonth || 0} this month
            </p>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-lavender-500">Coaches</p>
                <p className="text-3xl font-bold text-lavender-800">{stats?.totalCoaches || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
                <FiUserCheck className="w-6 h-6 text-rose-600" />
              </div>
            </div>
            <p className="text-xs text-lavender-500 mt-2">
              {stats?.activeAssignments || 0} active assignments
            </p>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-lavender-500">Sessions</p>
                <p className="text-3xl font-bold text-lavender-800">{stats?.totalSessions || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                <FiCalendar className="w-6 h-6 text-sky-600" />
              </div>
            </div>
            <p className="text-xs text-lavender-500 mt-2">
              {stats?.sessionsThisMonth || 0} this month
            </p>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-lavender-500">Completion Rate</p>
                <p className="text-3xl font-bold text-lavender-800">{stats?.avgCompletionRate || 0}%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center">
                <FiTrendingUp className="w-6 h-6 text-sage-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <Link href="/admin/users">
            <div className="glass rounded-2xl p-6 card-lift cursor-pointer group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lavender-400 to-lavender-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FiUsers className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lavender-800">Manage Users</h3>
              <p className="text-sm text-lavender-500">View and manage all users</p>
            </div>
          </Link>

          <Link href="/admin/coaches">
            <div className="glass rounded-2xl p-6 card-lift cursor-pointer group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FiUserCheck className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lavender-800">Manage Coaches</h3>
              <p className="text-sm text-lavender-500">Coach profiles and assignments</p>
            </div>
          </Link>

          <Link href="/admin/content">
            <div className="glass rounded-2xl p-6 card-lift cursor-pointer group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sage-400 to-sage-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FiBookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lavender-800">Content Manager</h3>
              <p className="text-sm text-lavender-500">Add and edit content</p>
            </div>
          </Link>

          <Link href="/admin/sessions">
            <div className="glass rounded-2xl p-6 card-lift cursor-pointer group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FiCalendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lavender-800">Sessions</h3>
              <p className="text-sm text-lavender-500">View all coaching sessions</p>
            </div>
          </Link>
        </motion.div>

        {/* Thrive 5 Category Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-lavender-800 mb-4">
            Content Progress by Thrive Factor
          </h2>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { name: 'Stimulation', color: 'bg-sage-400', count: stats?.categoryCounts?.['environmental-stimulation'] || 0 },
              { name: 'Nutrition', color: 'bg-peach-400', count: stats?.categoryCounts?.['nutrition'] || 0 },
              { name: 'Safety', color: 'bg-sky-400', count: stats?.categoryCounts?.['neighborhood-safety'] || 0 },
              { name: 'Caregiving', color: 'bg-rose-400', count: stats?.categoryCounts?.['positive-caregiving'] || 0 },
              { name: 'Sleep', color: 'bg-lavender-400', count: stats?.categoryCounts?.['sleep-circadian-rhythms'] || 0 },
            ].map((cat) => (
              <div key={cat.name} className="text-center">
                <div className={`w-16 h-16 ${cat.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <span className="text-white font-bold">{cat.count}</span>
                </div>
                <p className="text-sm text-lavender-600">{cat.name}</p>
                <p className="text-xs text-lavender-400">tracks completed</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold text-lavender-800 mb-4">
            Platform Overview
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-lavender-700 mb-3">Quick Stats</h3>
              <ul className="space-y-2">
                <li className="flex justify-between py-2 border-b border-lavender-100">
                  <span className="text-lavender-600">Surveys completed</span>
                  <span className="font-medium text-lavender-800">{stats?.totalUsers || 0}</span>
                </li>
                <li className="flex justify-between py-2 border-b border-lavender-100">
                  <span className="text-lavender-600">Sessions completed</span>
                  <span className="font-medium text-lavender-800">{stats?.completedSessions || 0}</span>
                </li>
                <li className="flex justify-between py-2 border-b border-lavender-100">
                  <span className="text-lavender-600">Active coach assignments</span>
                  <span className="font-medium text-lavender-800">{stats?.activeAssignments || 0}</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-lavender-700 mb-3">Important Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="flex items-center text-lavender-600 hover:text-lavender-800">
                    <FiMessageSquare className="mr-2" />
                    View session notes with high concern
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-lavender-600 hover:text-lavender-800">
                    <FiAlertCircle className="mr-2" />
                    Users who may need additional support
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-lavender-600 hover:text-lavender-800">
                    <FiSettings className="mr-2" />
                    Platform settings
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
