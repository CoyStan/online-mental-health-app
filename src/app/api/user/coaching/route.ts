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

    // Get assignment if exists
    const assignment = await prisma.coachAssignment.findUnique({
      where: { userId: session.user.id },
      include: {
        coach: {
          select: {
            name: true,
            coachProfile: {
              select: {
                bio: true,
                photoUrl: true,
                languages: true,
                zoomLink: true,
              },
            },
          },
        },
      },
    })

    // Get sessions
    const sessions = await prisma.session.findMany({
      where: { userId: session.user.id },
      orderBy: { scheduledAt: 'desc' },
      select: {
        id: true,
        scheduledAt: true,
        duration: true,
        status: true,
        zoomLink: true,
        momSummary: true,
        actionItems: true,
      },
    })

    // Get homework
    const homework = await prisma.homework.findMany({
      where: {
        userId: session.user.id,
        status: { not: 'completed' },
      },
      orderBy: { assignedAt: 'desc' },
    })

    return NextResponse.json({
      coach: assignment?.coach || null,
      sessions,
      homework,
    })
  } catch (error) {
    console.error('Failed to fetch coaching data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch coaching data' },
      { status: 500 }
    )
  }
}
