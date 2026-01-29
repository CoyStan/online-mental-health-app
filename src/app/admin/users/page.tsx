'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiSearch, FiUser, FiMail, FiCalendar, FiDownload } from 'react-icons/fi'

interface User {
  id: string
  name: string
  email: string
  role: string
  stage: string
  surveyCompleted: boolean
  createdAt: string
  _count: { progress: number; sessions: number }
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session?.user?.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [status, session, router])

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchUsers()
    }
  }, [session])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      setUsers(data)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    return matchesSearch && matchesRole
  })

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
                href="/admin"
                className="mr-4 text-lavender-600 hover:text-lavender-800"
              >
                <FiArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-lavender-800">User Management</h1>
                <p className="text-sm text-lavender-500">{filteredUsers.length} users</p>
              </div>
            </div>
            <a
              href="/api/admin/export?type=users"
              className="flex items-center px-4 py-2 rounded-lg glass text-lavender-600 hover:bg-white/80"
            >
              <FiDownload className="mr-2" />
              Export
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lavender-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-12 pr-4 py-3 rounded-xl glass focus:ring-2 focus:ring-lavender-300 outline-none"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-3 rounded-xl glass focus:ring-2 focus:ring-lavender-300 outline-none"
          >
            <option value="all">All Roles</option>
            <option value="user">Users (Moms)</option>
            <option value="coach">Coaches</option>
            <option value="admin">Admins</option>
          </select>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-lavender-100">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-lavender-700">User</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-lavender-700">Role</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-lavender-700">Stage</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-lavender-700">Progress</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-lavender-700">Sessions</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-lavender-700">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, idx) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="border-b border-lavender-50 hover:bg-lavender-50/50 cursor-pointer"
                    onClick={() => router.push(`/admin/users/${user.id}`)}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lavender-400 to-rose-400 flex items-center justify-center mr-3">
                          <FiUser className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-lavender-800">{user.name}</p>
                          <p className="text-sm text-lavender-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        ${user.role === 'admin' ? 'bg-rose-100 text-rose-700' :
                          user.role === 'coach' ? 'bg-sky-100 text-sky-700' :
                          'bg-lavender-100 text-lavender-700'}
                      `}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-lavender-600">
                      {user.stage || '-'}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-lavender-700">
                        {user._count?.progress || 0} tracks
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-lavender-700">
                        {user._count?.sessions || 0}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-lavender-500 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
