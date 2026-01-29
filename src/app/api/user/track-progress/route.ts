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
    const categoryId = searchParams.get('categoryId')

    const whereClause: any = {
      userId: session.user.id,
      completed: true,
    }

    if (categoryId) {
      whereClause.track = {
        categoryId,
      }
    }

    const progress = await prisma.userProgress.findMany({
      where: whereClause,
      select: {
        trackId: true,
        completed: true,
      },
    })

    // Convert to a simple object for easy lookup
    const progressMap: Record<string, boolean> = {}
    progress.forEach((p) => {
      progressMap[p.trackId] = p.completed
    })

    return NextResponse.json(progressMap)
  } catch (error) {
    console.error('Failed to fetch track progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch track progress' },
      { status: 500 }
    )
  }
}
