'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FiArrowLeft, FiPlus, FiEdit2, FiTrash2,
  FiFolder, FiFileText, FiEye, FiEyeOff
} from 'react-icons/fi'

interface Category {
  id: string
  name: string
  description: string
  color: string
  _count: { tracks: number }
}

interface Track {
  id: string
  title: string
  description: string
  status: string
  categoryId: string
  _count: { contents: number }
}

export default function AdminContentPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [tracks, setTracks] = useState<Track[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
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
      fetchData()
    }
  }, [session])

  useEffect(() => {
    if (selectedCategory) {
      fetchTracks(selectedCategory)
    }
  }, [selectedCategory])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
      if (data.length > 0) {
        setSelectedCategory(data[0].id)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTracks = async (categoryId: string) => {
    try {
      const res = await fetch(`/api/admin/tracks?categoryId=${categoryId}`)
      const data = await res.json()
      setTracks(data)
    } catch (error) {
      console.error('Failed to fetch tracks:', error)
    }
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-lavender-200 border-t-lavender-500 rounded-full animate-spin" />
      </div>
    )
  }

  const selectedCategoryData = categories.find(c => c.id === selectedCategory)

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="glass border-b border-lavender-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/admin"
                className="mr-4 text-lavender-600 hover:text-lavender-800"
              >
                <FiArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-lavender-800">Content Manager</h1>
                <p className="text-sm text-lavender-500">Manage tracks and content for Thrive 5</p>
              </div>
            </div>
            <Link
              href="/admin/content/new"
              className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-lavender-500 to-rose-400 text-white hover:shadow-lg transition-shadow"
            >
              <FiPlus className="mr-2" />
              Add Content
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                px-4 py-2 rounded-xl font-medium transition-all
                ${selectedCategory === category.id
                  ? 'text-white shadow-lg'
                  : 'glass text-lavender-600 hover:bg-white/80'
                }
              `}
              style={{
                background: selectedCategory === category.id ? category.color : undefined,
              }}
            >
              <FiFolder className="inline-block mr-2" />
              {category.name}
              <span className="ml-2 opacity-70">({category._count.tracks})</span>
            </button>
          ))}
        </motion.div>

        {/* Category Info */}
        {selectedCategoryData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 mb-8"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-lavender-800 mb-2">
                  {selectedCategoryData.name}
                </h2>
                <p className="text-lavender-600 max-w-2xl">
                  {selectedCategoryData.description}
                </p>
              </div>
              <Link
                href={`/admin/content/track/new?categoryId=${selectedCategory}`}
                className="flex items-center px-4 py-2 rounded-lg glass text-lavender-600 hover:bg-white/80"
              >
                <FiPlus className="mr-2" />
                Add Track
              </Link>
            </div>
          </motion.div>
        )}

        {/* Tracks List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {tracks.map((track, idx) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass rounded-xl p-4 flex items-center justify-between group hover:bg-white/80"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-lavender-100 flex items-center justify-center mr-4">
                  <FiFileText className="w-5 h-5 text-lavender-600" />
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="font-semibold text-lavender-800">{track.title}</h3>
                    {track.status !== 'published' && (
                      <span className={`
                        ml-2 px-2 py-0.5 rounded-full text-xs
                        ${track.status === 'draft' ? 'bg-yellow-100 text-yellow-700' : 'bg-sky-100 text-sky-700'}
                      `}>
                        {track.status}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-lavender-500">{track.description}</p>
                  <p className="text-xs text-lavender-400 mt-1">
                    {track._count.contents} content items
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link
                  href={`/admin/content/track/${track.id}`}
                  className="p-2 rounded-lg hover:bg-lavender-100 text-lavender-600"
                  title="Edit"
                >
                  <FiEdit2 className="w-5 h-5" />
                </Link>
                <Link
                  href={`/content/${track.id}`}
                  className="p-2 rounded-lg hover:bg-lavender-100 text-lavender-600"
                  title="Preview"
                  target="_blank"
                >
                  <FiEye className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          ))}

          {tracks.length === 0 && (
            <div className="text-center py-12 glass rounded-xl">
              <FiFileText className="w-12 h-12 text-lavender-300 mx-auto mb-4" />
              <p className="text-lavender-500">No tracks in this category yet</p>
              <Link
                href={`/admin/content/track/new?categoryId=${selectedCategory}`}
                className="inline-flex items-center mt-4 text-lavender-600 hover:text-lavender-800"
              >
                <FiPlus className="mr-2" />
                Add the first track
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
