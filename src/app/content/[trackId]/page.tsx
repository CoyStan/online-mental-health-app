'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiArrowLeft, FiArrowRight, FiCheck, FiBookOpen,
  FiPlay, FiHeadphones, FiClipboard, FiCheckSquare
} from 'react-icons/fi'

interface Content {
  id: string
  title: string
  body: string
  contentType: string
  mediaUrl?: string
  duration?: number
  order: number
}

interface Track {
  id: string
  title: string
  description: string
  categoryId: string
  category: { name: string; color: string }
  contents: Content[]
}

const contentTypeIcons: Record<string, any> = {
  article: FiBookOpen,
  video: FiPlay,
  audio: FiHeadphones,
  exercise: FiClipboard,
  checklist: FiCheckSquare,
}

const categoryColors: Record<string, string> = {
  'environmental-stimulation': 'from-sage-400 to-sage-500',
  'nutrition': 'from-peach-400 to-peach-500',
  'neighborhood-safety': 'from-sky-400 to-sky-500',
  'positive-caregiving': 'from-rose-400 to-rose-500',
  'sleep-circadian-rhythms': 'from-lavender-400 to-lavender-500',
}

export default function ContentPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const trackId = params.trackId as string

  const [track, setTrack] = useState<Track | null>(null)
  const [currentContentIndex, setCurrentContentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchTrack()
    }
  }, [session, trackId])

  const fetchTrack = async () => {
    try {
      const res = await fetch(`/api/tracks/${trackId}`)
      const data = await res.json()
      setTrack(data)
    } catch (error) {
      console.error('Failed to fetch track:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async () => {
    setCompleting(true)
    try {
      await fetch('/api/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackId, completed: true }),
      })
      router.push(`/tracks/${track?.categoryId}`)
    } catch (error) {
      console.error('Failed to mark complete:', error)
    } finally {
      setCompleting(false)
    }
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-lavender-200 border-t-lavender-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!track) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lavender-600">Content not found</p>
      </div>
    )
  }

  const currentContent = track.contents[currentContentIndex]
  const isLastContent = currentContentIndex === track.contents.length - 1
  const gradient = categoryColors[track.categoryId] || 'from-lavender-400 to-lavender-500'
  const ContentIcon = contentTypeIcons[currentContent?.contentType] || FiBookOpen

  // Simple markdown-to-HTML (basic parsing)
  const renderMarkdown = (text: string) => {
    return text
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-lavender-800 mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold text-lavender-700 mt-8 mb-3">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-lavender-600 mt-6 mb-2">$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-lavender-300 pl-4 py-2 my-4 bg-lavender-50 rounded-r-lg italic text-lavender-700">$1</blockquote>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 mb-2">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-2 list-decimal">$1</li>')
      .replace(/\n\n/gim, '</p><p class="mb-4 leading-relaxed text-lavender-700">')
      .replace(/\n/gim, '<br/>')
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className={`bg-gradient-to-r ${gradient} text-white`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href={`/tracks/${track.categoryId}`}
            className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to {track.category.name}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {track.title}
            </h1>
            <p className="text-white/80">
              {track.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content Progress */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-lavender-600">
            Part {currentContentIndex + 1} of {track.contents.length}
          </span>
          <div className="flex items-center text-sm text-lavender-500">
            <ContentIcon className="w-4 h-4 mr-1" />
            {currentContent?.contentType}
          </div>
        </div>
        <div className="h-2 bg-white/50 rounded-full overflow-hidden glass">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentContentIndex + 1) / track.contents.length) * 100}%` }}
            className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
          />
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {track.contents.map((content, idx) => (
            <button
              key={content.id}
              onClick={() => setCurrentContentIndex(idx)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all
                ${idx === currentContentIndex
                  ? `bg-gradient-to-r ${gradient} text-white`
                  : 'glass text-lavender-600 hover:bg-white/80'
                }
              `}
            >
              {idx + 1}. {content.title.length > 20 ? content.title.substring(0, 20) + '...' : content.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentContent?.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-3xl p-6 md:p-10 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-lavender-800 mb-6 flex items-center">
              <ContentIcon className={`w-6 h-6 mr-3 text-lavender-500`} />
              {currentContent?.title}
            </h2>

            {/* Video/Audio player if applicable */}
            {currentContent?.mediaUrl && (currentContent.contentType === 'video' || currentContent.contentType === 'audio') && (
              <div className="mb-6 rounded-xl overflow-hidden bg-lavender-100">
                {currentContent.contentType === 'video' ? (
                  <div className="aspect-video bg-lavender-200 flex items-center justify-center">
                    <FiPlay className="w-16 h-16 text-lavender-400" />
                    <p className="ml-4 text-lavender-600">Video: {currentContent.mediaUrl}</p>
                  </div>
                ) : (
                  <div className="p-6 flex items-center justify-center">
                    <FiHeadphones className="w-12 h-12 text-lavender-400 mr-4" />
                    <p className="text-lavender-600">Audio: {currentContent.mediaUrl}</p>
                  </div>
                )}
              </div>
            )}

            {/* Markdown Content */}
            <div
              className="prose-maternal"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(currentContent?.body || '') }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentContentIndex(prev => prev - 1)}
            disabled={currentContentIndex === 0}
            className={`
              flex items-center px-6 py-3 rounded-xl font-medium transition-all
              ${currentContentIndex === 0
                ? 'opacity-50 cursor-not-allowed text-lavender-400'
                : 'glass text-lavender-700 hover:bg-white/80'
              }
            `}
          >
            <FiArrowLeft className="mr-2" />
            Previous
          </button>

          {isLastContent ? (
            <button
              onClick={handleComplete}
              disabled={completing}
              className={`
                flex items-center px-8 py-3 rounded-xl font-semibold transition-all
                bg-gradient-to-r ${gradient} text-white hover:shadow-lg btn-glow
              `}
            >
              {completing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Mark Complete
                  <FiCheck className="ml-2" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setCurrentContentIndex(prev => prev + 1)}
              className={`
                flex items-center px-8 py-3 rounded-xl font-semibold transition-all
                bg-gradient-to-r ${gradient} text-white hover:shadow-lg btn-glow
              `}
            >
              Continue
              <FiArrowRight className="ml-2" />
            </button>
          )}
        </div>

        {/* Encouragement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-lavender-500 italic">
            "Taking time to learn is taking care of your baby. You're doing great."
          </p>
        </motion.div>
      </div>
    </div>
  )
}
