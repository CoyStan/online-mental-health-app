import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all'

    let data: any = {}

    // Export users (anonymized)
    if (type === 'users' || type === 'all') {
      const users = await prisma.user.findMany({
        where: { role: 'user' },
        select: {
          id: true,
          stage: true,
          surveyCompleted: true,
          stimulationScore: true,
          nutritionScore: true,
          safetyScore: true,
          caregivingScore: true,
          sleepScore: true,
          createdAt: true,
          _count: {
            select: {
              progress: { where: { completed: true } },
              sessions: { where: { status: 'completed' } },
            },
          },
        },
      })

      data.users = users.map((user, idx) => ({
        anonymousId: `USER_${String(idx + 1).padStart(4, '0')}`,
        stage: user.stage,
        surveyCompleted: user.surveyCompleted,
        thrive5Scores: {
          stimulation: user.stimulationScore,
          nutrition: user.nutritionScore,
          safety: user.safetyScore,
          caregiving: user.caregivingScore,
          sleep: user.sleepScore,
        },
        tracksCompleted: user._count.progress,
        sessionsCompleted: user._count.sessions,
        enrolledDate: user.createdAt.toISOString().split('T')[0],
      }))

      data.usersSummary = {
        totalUsers: users.length,
        surveyCompletionRate: Math.round((users.filter(u => u.surveyCompleted).length / users.length) * 100),
        averageTracksCompleted: Math.round(users.reduce((sum, u) => sum + u._count.progress, 0) / users.length * 10) / 10,
        averageSessionsCompleted: Math.round(users.reduce((sum, u) => sum + u._count.sessions, 0) / users.length * 10) / 10,
      }
    }

    // Export sessions
    if (type === 'sessions' || type === 'all') {
      const sessions = await prisma.session.findMany({
        select: {
          id: true,
          scheduledAt: true,
          duration: true,
          status: true,
          thriveFocusAreas: true,
          riskLevel: true,
          completedAt: true,
        },
      })

      data.sessions = sessions.map((s, idx) => ({
        sessionId: `SESSION_${String(idx + 1).padStart(4, '0')}`,
        date: s.scheduledAt.toISOString().split('T')[0],
        duration: s.duration,
        status: s.status,
        thriveFocusAreas: s.thriveFocusAreas ? JSON.parse(s.thriveFocusAreas) : [],
        riskLevel: s.riskLevel,
      }))

      data.sessionsSummary = {
        totalSessions: sessions.length,
        completedSessions: sessions.filter(s => s.status === 'completed').length,
        cancelledSessions: sessions.filter(s => s.status === 'cancelled').length,
        noShowSessions: sessions.filter(s => s.status === 'no-show').length,
        averageDuration: Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length),
      }
    }

    // Export progress by category
    if (type === 'progress' || type === 'all') {
      const categories = await prisma.category.findMany({
        include: {
          tracks: {
            include: {
              progress: {
                where: { completed: true },
              },
            },
          },
        },
      })

      data.progressByCategory = categories.map(cat => ({
        category: cat.name,
        totalTracks: cat.tracks.length,
        totalCompletions: cat.tracks.reduce((sum, t) => sum + t.progress.length, 0),
        tracksWithMostCompletions: cat.tracks
          .map(t => ({ title: t.title, completions: t.progress.length }))
          .sort((a, b) => b.completions - a.completions)
          .slice(0, 3),
      }))
    }

    // Add export metadata
    data.exportMetadata = {
      exportDate: new Date().toISOString(),
      exportedBy: session.user.email,
      type,
    }

    // Return as JSON (can be converted to CSV by client)
    return NextResponse.json(data, {
      headers: {
        'Content-Disposition': `attachment; filename="thrive5-export-${type}-${new Date().toISOString().split('T')[0]}.json"`,
      },
    })
  } catch (error) {
    console.error('Failed to export data:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}
