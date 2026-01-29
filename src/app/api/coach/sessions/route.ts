import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const upcoming = searchParams.get('upcoming') === 'true'

    // Coaches see their sessions, admins see all
    const whereClause: any = session.user.role === 'admin'
      ? {}
      : { coachId: session.user.id }

    if (upcoming) {
      whereClause.scheduledAt = { gte: new Date() }
      whereClause.status = 'scheduled'
    }

    const sessions = await prisma.session.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        coach: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { scheduledAt: upcoming ? 'asc' : 'desc' },
      take: upcoming ? 10 : 50,
    })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error('Failed to fetch sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || !['coach', 'admin'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      )
    }

    const data = await request.json()

    const newSession = await prisma.session.create({
      data: {
        userId: data.userId,
        coachId: data.coachId || session.user.id,
        scheduledAt: new Date(data.scheduledAt),
        duration: data.duration || 30,
        zoomLink: data.zoomLink,
        status: 'scheduled',
      },
    })

    // Update assignment session count
    await prisma.coachAssignment.updateMany({
      where: {
        userId: data.userId,
        coachId: data.coachId || session.user.id,
      },
      data: {
        totalSessions: { increment: 1 },
      },
    })

    return NextResponse.json(newSession)
  } catch (error) {
    console.error('Failed to create session:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}
