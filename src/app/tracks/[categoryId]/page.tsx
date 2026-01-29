'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiCheck, FiLock, FiPlay } from 'react-icons/fi'

interface Track {
  id: string
  title: string
  description: string
  order: number
  positionX: number
  positionY: number
  completed?: boolean
  inProgress?: boolean
}

interface Category {
  id: string
  name: string
  description: string
  color: string
  tracks: Track[]
}

const categoryColors: Record<string, { bg: string; node: string; line: string }> = {
  'emotional-wellness': {
    bg: 'from-rose-50 to-rose-100',
    node: 'from-rose-400 to-rose-500',
    line: 'rgba(255, 133, 159, 0.4)',
  },
  'physical-health': {
    bg: 'from-sage-50 to-sage-100',
    node: 'from-sage-400 to-sage-500',
    line: 'rgba(130, 170, 130, 0.4)',
  },
  'relationships-&-support': {
    bg: 'from-sky-50 to-sky-100',
    node: 'from-sky-400 to-sky-500',
    line: 'rgba(125, 211, 252, 0.4)',
  },
  'baby-care-basics': {
    bg: 'from-peach-50 to-peach-100',
    node: 'from-peach-400 to-peach-500',
    line: 'rgba(255, 194, 166, 0.4)',
  },
  'self-care-&-mindfulness': {
    bg: 'from-lavender-50 to-lavender-100',
    node: 'from-lavender-400 to-lavender-500',
    line: 'rgba(214, 196, 255, 0.4)',
  },
}

export default function TracksPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const categoryId = params.categoryId as string

  const [category, setCategory] = useState<Category | null>(null)
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchData()
    }
  }, [session, categoryId])

  const fetchData = async () => {
    try {
      const [categoryRes, progressRes] = await Promise.all([
        fetch(`/api/categories/${categoryId}`),
        fetch(`/api/user/track-progress?categoryId=${categoryId}`),
      ])
      const categoryData = await categoryRes.json()
      const progressData = await progressRes.json()

      setCategory(categoryData)
      setUserProgress(progressData)
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

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lavender-600">Category not found</p>
      </div>
    )
  }

  const colors = categoryColors[categoryId] || categoryColors['emotional-wellness']

  // Generate connections between tracks (sequential by order)
  const connections: { from: Track; to: Track }[] = []
  const sortedTracks = [...(category.tracks || [])].sort((a, b) => a.order - b.order)
  for (let i = 0; i < sortedTracks.length - 1; i++) {
    connections.push({ from: sortedTracks[i], to: sortedTracks[i + 1] })
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className={`bg-gradient-to-br ${colors.bg} border-b border-white/50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-lavender-600 hover:text-lavender-800 mb-4 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-lavender-800 mb-2">
              {category.name}
            </h1>
            <p className="text-lavender-600 text-lg max-w-2xl">
              {category.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Tracks Network Visualization */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          ref={containerRef}
          className="relative glass rounded-3xl p-8 overflow-hidden"
          style={{ minHeight: '500px' }}
        >
          {/* Connection Lines SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {connections.map((conn, idx) => (
              <motion.line
                key={idx}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                x1={conn.from.positionX + 40}
                y1={conn.from.positionY + 40}
                x2={conn.to.positionX + 40}
                y2={conn.to.positionY + 40}
                stroke={colors.line}
                strokeWidth="3"
                strokeDasharray="8 8"
                className="animate-pulse"
              />
            ))}
          </svg>

          {/* Track Nodes */}
          {sortedTracks.map((track, index) => {
            const isCompleted = userProgress[track.id]
            const isAvailable = index === 0 || userProgress[sortedTracks[index - 1]?.id]

            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, type: 'spring' }}
                style={{
                  position: 'absolute',
                  left: track.positionX,
                  top: track.positionY,
                }}
                className="relative"
                onMouseEnter={() => setHoveredTrack(track.id)}
                onMouseLeave={() => setHoveredTrack(null)}
              >
                <Link
                  href={isAvailable ? `/content/${track.id}` : '#'}
                  className={!isAvailable ? 'cursor-not-allowed' : ''}
                  onClick={(e) => !isAvailable && e.preventDefault()}
                >
                  <motion.div
                    whileHover={isAvailable ? { scale: 1.1 } : {}}
                    whileTap={isAvailable ? { scale: 0.95 } : {}}
                    className={`
                      w-20 h-20 rounded-full flex items-center justify-center
                      transition-all duration-300 relative
                      ${isCompleted
                        ? `bg-gradient-to-br ${colors.node} shadow-lg`
                        : isAvailable
                          ? `bg-white border-4 border-dashed hover:bg-gradient-to-br hover:${colors.node} hover:border-solid`
                          : 'bg-gray-100 border-2 border-gray-200'
                      }
                      ${isAvailable && !isCompleted ? 'node-pulse' : ''}
                    `}
                    style={{
                      borderColor: isAvailable && !isCompleted ? colors.line : undefined,
                    }}
                  >
                    {isCompleted ? (
                      <FiCheck className="w-8 h-8 text-white" />
                    ) : isAvailable ? (
                      <FiPlay className="w-8 h-8 text-lavender-500" />
                    ) : (
                      <FiLock className="w-6 h-6 text-gray-400" />
                    )}
                  </motion.div>

                  {/* Track number badge */}
                  <div className={`
                    absolute -top-2 -right-2 w-8 h-8 rounded-full
                    flex items-center justify-center text-sm font-bold
                    ${isCompleted
                      ? 'bg-white text-lavender-600'
                      : isAvailable
                        ? `bg-gradient-to-br ${colors.node} text-white`
                        : 'bg-gray-200 text-gray-500'
                    }
                  `}>
                    {index + 1}
                  </div>
                </Link>

                {/* Hover tooltip */}
                {hoveredTrack === track.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute left-1/2 -translate-x-1/2 top-24 z-10 w-64"
                  >
                    <div className="glass rounded-xl p-4 shadow-xl">
                      <h4 className="font-semibold text-lavender-800 mb-1">
                        {track.title}
                      </h4>
                      <p className="text-sm text-lavender-600 mb-2">
                        {track.description}
                      </p>
                      {isCompleted ? (
                        <span className="text-xs text-sage-600 font-medium">
                          ✓ Completed
                        </span>
                      ) : isAvailable ? (
                        <span className="text-xs text-lavender-500 font-medium">
                          Click to start
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Complete previous track to unlock
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}

          {/* Legend */}
          <div className="absolute bottom-4 right-4 glass rounded-xl p-4">
            <h4 className="text-sm font-semibold text-lavender-700 mb-2">Legend</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${colors.node} mr-2`} />
                <span className="text-lavender-600">Completed</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full border-2 border-dashed mr-2" style={{ borderColor: colors.line }} />
                <span className="text-lavender-600">Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-gray-200 mr-2" />
                <span className="text-lavender-600">Locked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Track List (Alternative View) */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-lavender-800 mb-4">All Tracks</h2>
          <div className="space-y-3">
            {sortedTracks.map((track, index) => {
              const isCompleted = userProgress[track.id]
              const isAvailable = index === 0 || userProgress[sortedTracks[index - 1]?.id]

              return (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={isAvailable ? `/content/${track.id}` : '#'}
                    onClick={(e) => !isAvailable && e.preventDefault()}
                    className={!isAvailable ? 'cursor-not-allowed' : ''}
                  >
                    <div className={`
                      glass rounded-xl p-4 flex items-center transition-all
                      ${isAvailable ? 'hover:bg-white/80 cursor-pointer' : 'opacity-60'}
                    `}>
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0
                        ${isCompleted
                          ? `bg-gradient-to-br ${colors.node}`
                          : isAvailable
                            ? 'bg-white border-2'
                            : 'bg-gray-100'
                        }
                      `}
                      style={{ borderColor: isAvailable && !isCompleted ? colors.line : undefined }}
                      >
                        {isCompleted ? (
                          <FiCheck className="w-6 h-6 text-white" />
                        ) : isAvailable ? (
                          <span className="font-bold text-lavender-600">{index + 1}</span>
                        ) : (
                          <FiLock className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lavender-800">{track.title}</h3>
                        <p className="text-sm text-lavender-500">{track.description}</p>
                      </div>
                      {isAvailable && !isCompleted && (
                        <FiPlay className="w-5 h-5 text-lavender-400" />
                      )}
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
