'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FiUser, FiCalendar, FiMessageSquare, FiVideo,
  FiArrowLeft, FiClock, FiCheckCircle, FiHeart
} from 'react-icons/fi'

interface Coach {
  name: string
  coachProfile: {
    bio: string
    photoUrl?: string
    languages: string[]
    zoomLink?: string
  }
}

interface Session {
  id: string
  scheduledAt: string
  duration: number
  status: string
  zoomLink?: string
  momSummary?: string
  actionItems?: string
}

interface Homework {
  id: string
  customTask?: string
  trackId?: string
  status: string
  dueDate?: string
}

export default function CoachingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [coach, setCoach] = useState<Coach | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [homework, setHomework] = useState<Homework[]>([])
  const [loading, setLoading] = useState(true)
  const [hasCoach, setHasCoach] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchData()
    }
  }, [session])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/user/coaching')
      const data = await res.json()

      if (data.coach) {
        setCoach(data.coach)
        setHasCoach(true)
      }
      setSessions(data.sessions || [])
      setHomework(data.homework || [])
    } catch (error) {
      console.error('Failed to fetch coaching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const requestCoaching = async () => {
    try {
      await fetch('/api/user/coaching/request', { method: 'POST' })
      // Show success message or redirect
      alert('Coaching request submitted! We\'ll match you with a coach soon.')
    } catch (error) {
      console.error('Failed to request coaching:', error)
    }
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-lavender-200 border-t-lavender-500 rounded-full animate-spin" />
      </div>
    )
  }

  const upcomingSession = sessions.find(s => s.status === 'scheduled' && new Date(s.scheduledAt) > new Date())
  const pastSessions = sessions.filter(s => s.status === 'completed')

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="glass border-b border-lavender-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="mr-4 text-lavender-600 hover:text-lavender-800"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-lavender-800">My Coach</h1>
              <p className="text-sm text-lavender-500">
                Personalized support for your journey
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {hasCoach && coach ? (
          <>
            {/* Coach Profile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6 mb-8"
            >
              <div className="flex items-start space-x-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-lavender-400 to-rose-400 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {coach.coachProfile.photoUrl ? (
                    <img
                      src={coach.coachProfile.photoUrl}
                      alt={coach.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    coach.name.charAt(0)
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-lavender-800 mb-1">
                    {coach.name}
                  </h2>
                  <p className="text-lavender-600 mb-3">Your Personal Coach</p>
                  <p className="text-lavender-500 text-sm">
                    {coach.coachProfile.bio || 'Here to support you on your journey.'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Upcoming Session */}
            {upcomingSession && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-2xl p-6 mb-8 border-2 border-lavender-200"
              >
                <h2 className="text-lg font-semibold text-lavender-800 mb-4 flex items-center">
                  <FiCalendar className="mr-2 text-lavender-500" />
                  Your Next Session
                </h2>
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-lavender-800">
                      {new Date(upcomingSession.scheduledAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-lg text-lavender-600">
                      {new Date(upcomingSession.scheduledAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      <span className="text-lavender-400 ml-2">
                        ({upcomingSession.duration} minutes)
                      </span>
                    </p>
                  </div>
                  {upcomingSession.zoomLink && (
                    <a
                      href={upcomingSession.zoomLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 md:mt-0 flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold hover:shadow-lg transition-shadow"
                    >
                      <FiVideo className="mr-2" />
                      Join Zoom Call
                    </a>
                  )}
                </div>
              </motion.div>
            )}

            {/* My Homework */}
            {homework.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-2xl p-6 mb-8"
              >
                <h2 className="text-lg font-semibold text-lavender-800 mb-4 flex items-center">
                  <FiCheckCircle className="mr-2 text-lavender-500" />
                  My Homework
                </h2>
                <div className="space-y-3">
                  {homework.map((item) => (
                    <div
                      key={item.id}
                      className={`
                        p-4 rounded-xl flex items-center justify-between
                        ${item.status === 'completed'
                          ? 'bg-sage-50 border border-sage-200'
                          : 'bg-lavender-50 border border-lavender-200'
                        }
                      `}
                    >
                      <div className="flex items-center">
                        <div className={`
                          w-6 h-6 rounded-full flex items-center justify-center mr-3
                          ${item.status === 'completed'
                            ? 'bg-sage-400 text-white'
                            : 'border-2 border-lavender-300'
                          }
                        `}>
                          {item.status === 'completed' && <FiCheckCircle className="w-4 h-4" />}
                        </div>
                        <span className={`
                          ${item.status === 'completed' ? 'text-sage-700 line-through' : 'text-lavender-700'}
                        `}>
                          {item.customTask || 'Complete assigned content'}
                        </span>
                      </div>
                      {item.dueDate && (
                        <span className="text-sm text-lavender-400">
                          Due: {new Date(item.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Past Sessions */}
            {pastSessions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-2xl p-6"
              >
                <h2 className="text-lg font-semibold text-lavender-800 mb-4 flex items-center">
                  <FiMessageSquare className="mr-2 text-lavender-500" />
                  Past Sessions
                </h2>
                <div className="space-y-4">
                  {pastSessions.slice(0, 5).map((pastSession) => (
                    <div
                      key={pastSession.id}
                      className="p-4 rounded-xl bg-lavender-50/50 border border-lavender-100"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-lavender-700">
                          {new Date(pastSession.scheduledAt).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        <span className="text-xs bg-sage-100 text-sage-700 px-2 py-1 rounded-full">
                          Completed
                        </span>
                      </div>
                      {pastSession.momSummary && (
                        <p className="text-sm text-lavender-600 mb-2">
                          <strong>Summary:</strong> {pastSession.momSummary}
                        </p>
                      )}
                      {pastSession.actionItems && (
                        <p className="text-sm text-lavender-500">
                          <strong>Action Items:</strong> {pastSession.actionItems}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        ) : (
          /* No Coach Assigned - Request Coaching */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-lavender-200 to-rose-200 flex items-center justify-center mx-auto mb-6">
              <FiHeart className="w-12 h-12 text-lavender-500" />
            </div>
            <h2 className="text-2xl font-bold text-lavender-800 mb-4">
              Get Personalized Support
            </h2>
            <p className="text-lavender-600 max-w-md mx-auto mb-8">
              Our trained coaches are here to help you apply the Thrive 5 principles
              to your unique situation. Get one-on-one support via Zoom.
            </p>
            <button
              onClick={requestCoaching}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-lavender-500 to-rose-400 text-white font-semibold hover:shadow-lg transition-shadow btn-glow"
            >
              Request a Coach
            </button>
            <p className="text-sm text-lavender-400 mt-4">
              Free for all participants in our program
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
