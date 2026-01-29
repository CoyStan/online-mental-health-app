import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      )
    }

    // Get current date info for "this month" stats
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    // Parallel queries for better performance
    const [
      totalUsers,
      totalCoaches,
      totalSessions,
      completedSessions,
      activeAssignments,
      usersThisMonth,
      sessionsThisMonth,
      completedTracks,
      totalTracks,
      categoryProgress,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'user' } }),
      prisma.user.count({ where: { role: 'coach' } }),
      prisma.session.count(),
      prisma.session.count({ where: { status: 'completed' } }),
      prisma.coachAssignment.count({ where: { status: 'active' } }),
      prisma.user.count({
        where: {
          role: 'user',
          createdAt: { gte: startOfMonth },
        },
      }),
      prisma.session.count({
        where: {
          createdAt: { gte: startOfMonth },
        },
      }),
      prisma.userProgress.count({ where: { completed: true } }),
      prisma.track.count({ where: { status: 'published' } }),
      prisma.userProgress.groupBy({
        by: ['trackId'],
        where: { completed: true },
        _count: true,
      }),
    ])

    // Get category IDs for each completed track
    const trackCategories = await prisma.track.findMany({
      select: { id: true, categoryId: true },
    })

    const trackToCategory = new Map(
      trackCategories.map((t) => [t.id, t.categoryId])
    )

    // Count completions per category
    const categoryCounts: Record<string, number> = {}
    for (const progress of categoryProgress) {
      const categoryId = trackToCategory.get(progress.trackId)
      if (categoryId) {
        categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + progress._count
      }
    }

    // Calculate average completion rate
    const avgCompletionRate =
      totalUsers > 0 && totalTracks > 0
        ? Math.round((completedTracks / (totalUsers * totalTracks)) * 100)
        : 0

    return NextResponse.json({
      totalUsers,
      totalCoaches,
      totalSessions,
      completedSessions,
      activeAssignments,
      usersThisMonth,
      sessionsThisMonth,
      avgCompletionRate,
      categoryCounts,
    })
  } catch (error) {
    console.error('Failed to fetch admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
