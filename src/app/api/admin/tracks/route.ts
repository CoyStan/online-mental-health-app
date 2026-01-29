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
    const categoryId = searchParams.get('categoryId')

    const tracks = await prisma.track.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: {
        _count: {
          select: { contents: true },
        },
      },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(tracks)
  } catch (error) {
    console.error('Failed to fetch tracks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tracks' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      )
    }

    const data = await request.json()

    const track = await prisma.track.create({
      data: {
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        order: data.order || 0,
        positionX: data.positionX || 100,
        positionY: data.positionY || 100,
        status: data.status || 'draft',
      },
    })

    return NextResponse.json(track)
  } catch (error) {
    console.error('Failed to create track:', error)
    return NextResponse.json(
      { error: 'Failed to create track' },
      { status: 500 }
    )
  }
}
