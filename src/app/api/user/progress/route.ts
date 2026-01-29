import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const totalTracks = await prisma.track.count({
      where: { status: 'published' },
    })

    const completedTracks = await prisma.userProgress.count({
      where: {
        userId: session.user.id,
        completed: true,
      },
    })

    return NextResponse.json({
      totalTracks,
      completedTracks,
    })
  } catch (error) {
    console.error('Failed to fetch progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { trackId, completed } = await request.json()

    const progress = await prisma.userProgress.upsert({
      where: {
        userId_trackId: {
          userId: session.user.id,
          trackId,
        },
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
      },
      create: {
        userId: session.user.id,
        trackId,
        completed,
        completedAt: completed ? new Date() : null,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: completed ? 'track_completed' : 'track_started',
        targetType: 'track',
        targetId: trackId,
      },
    })

    return NextResponse.json(progress)
  } catch (error) {
    console.error('Failed to update progress:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}
