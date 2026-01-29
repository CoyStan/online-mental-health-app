'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FiUsers, FiCalendar, FiClock, FiMessageSquare,
  FiArrowLeft, FiPlus, FiAlertCircle, FiCheck
} from 'react-icons/fi'

interface AssignedMom {
  id: string
  userId: string
  status: string
  totalSessions: number
  user: {
    id: string
    name: string
    email: string
    stage: string
    surveyCompleted: boolean
    stimulationScore?: number
    nutritionScore?: number
    safetyScore?: number
    caregivingScore?: number
    sleepScore?: number
  }
}

interface UpcomingSession {
  id: string
  scheduledAt: string
  duration: number
  status: string
  user: { name: string }
  zoomLink?: string
}

export default function CoachDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [assignments, setAssignments] = useState<AssignedMom[]>([])
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session?.user?.role !== 'coach' && session?.user?.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [status, session, router])

  useEffect(() => {
    if (session?.user?.role === 'coach' || session?.user?.role === 'admin') {
      fetchData()
    }
  }, [session])

  const fetchData = async () => {
    try {
      const [assignmentsRes, sessionsRes] = await Promise.all([
        fetch('/api/coach/assignments'),
        fetch('/api/coach/sessions?upcoming=true'),
      ])
      const assignmentsData = await assignmentsRes.json()
      const sessionsData = await sessionsRes.json()
      setAssignments(assignmentsData)
      setUpcomingSessions(sessionsData)
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
                <h1 className="text-2xl font-bold text-lavender-800">Coach Dashboard</h1>
                <p className="text-sm text-lavender-500">
                  Welcome, {session?.user?.name}
                </p>
              </div>
            </div>
            <Link
              href="/coach/schedule"
              className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-lavender-500 to-rose-400 text-white hover:shadow-lg transition-shadow"
            >
              <FiPlus className="mr-2" />
              Schedule Session
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
                <p className="text-sm text-lavender-500">Active Moms</p>
                <p className="text-3xl font-bold text-lavender-800">
                  {assignments.filter(a => a.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-lavender-100 flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-lavender-600" />
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-lavender-500">This Week</p>
                <p className="text-3xl font-bold text-lavender-800">
                  {upcomingSessions.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
                <FiCalendar className="w-6 h-6 text-rose-600" />
              </div>
            </div>
            <p className="text-xs text-lavender-500 mt-2">upcoming sessions</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-lavender-500">Total Sessions</p>
                <p className="text-3xl font-bold text-lavender-800">
                  {assignments.reduce((sum, a) => sum + a.totalSessions, 0)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center">
                <FiCheck className="w-6 h-6 text-sage-600" />
              </div>
            </div>
            <p className="text-xs text-lavender-500 mt-2">completed</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-lavender-500">Needs Attention</p>
                <p className="text-3xl font-bold text-rose-600">
                  0
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
                <FiAlertCircle className="w-6 h-6 text-rose-600" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upcoming Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-lavender-800 mb-4 flex items-center">
                <FiCalendar className="mr-2" />
                Upcoming Sessions
              </h2>

              {upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSessions.slice(0, 5).map((session) => (
                    <div
                      key={session.id}
                      className="p-4 rounded-xl bg-lavender-50/50 border border-lavender-100"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-lavender-800">
                            {session.user.name}
                          </p>
                          <p className="text-sm text-lavender-500">
                            {new Date(session.scheduledAt).toLocaleDateString()} at{' '}
                            {new Date(session.scheduledAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          <p className="text-xs text-lavender-400">
                            {session.duration} minutes
                          </p>
                        </div>
                        {session.zoomLink && (
                          <a
                            href={session.zoomLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-lg bg-sky-100 text-sky-700 text-sm hover:bg-sky-200"
                          >
                            Join
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiCalendar className="w-12 h-12 text-lavender-200 mx-auto mb-3" />
                  <p className="text-lavender-500">No upcoming sessions</p>
                </div>
              )}

              <Link
                href="/coach/schedule"
                className="block text-center mt-4 text-lavender-600 hover:text-lavender-800"
              >
                View all sessions →
              </Link>
            </div>
          </motion.div>

          {/* My Caseload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-lavender-800 mb-4 flex items-center">
                <FiUsers className="mr-2" />
                My Caseload
              </h2>

              {assignments.length > 0 ? (
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <Link
                      key={assignment.id}
                      href={`/coach/mom/${assignment.userId}`}
                    >
                      <div className="p-4 rounded-xl bg-white/50 border border-lavender-100 hover:bg-white/80 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-lavender-400 to-rose-400 flex items-center justify-center text-white font-semibold mr-4">
                              {assignment.user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-lavender-800">
                                {assignment.user.name}
                              </p>
                              <p className="text-sm text-lavender-500">
                                Stage: {assignment.user.stage} • {assignment.totalSessions} sessions
                              </p>
                            </div>
                          </div>
                          <span className={`
                            px-3 py-1 rounded-full text-xs font-medium
                            ${assignment.status === 'active'
                              ? 'bg-sage-100 text-sage-700'
                              : 'bg-lavender-100 text-lavender-600'
                            }
                          `}>
                            {assignment.status}
                          </span>
                        </div>

                        {/* Thrive 5 Mini Scores */}
                        <div className="mt-4 grid grid-cols-5 gap-2">
                          {[
                            { name: 'Stim', score: assignment.user.stimulationScore, color: 'bg-sage-400' },
                            { name: 'Nutr', score: assignment.user.nutritionScore, color: 'bg-peach-400' },
                            { name: 'Safe', score: assignment.user.safetyScore, color: 'bg-sky-400' },
                            { name: 'Care', score: assignment.user.caregivingScore, color: 'bg-rose-400' },
                            { name: 'Sleep', score: assignment.user.sleepScore, color: 'bg-lavender-400' },
                          ].map((factor) => (
                            <div key={factor.name} className="text-center">
                              <div className={`
                                h-2 rounded-full ${factor.color} opacity-30
                              `}>
                                <div
                                  className={`h-2 rounded-full ${factor.color}`}
                                  style={{ width: `${((factor.score || 0) / 7) * 100}%` }}
                                />
                              </div>
                              <p className="text-xs text-lavender-400 mt-1">{factor.name}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FiUsers className="w-12 h-12 text-lavender-200 mx-auto mb-3" />
                  <p className="text-lavender-500">No moms assigned yet</p>
                  <p className="text-sm text-lavender-400">
                    Assignments are managed by administrators
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
