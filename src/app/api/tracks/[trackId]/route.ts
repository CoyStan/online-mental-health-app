import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { trackId: string } }
) {
  try {
    const track = await prisma.track.findUnique({
      where: { id: params.trackId },
      include: {
        category: true,
        contents: {
          orderBy: { order: 'asc' },
          where: { status: 'published' },
        },
      },
    })

    if (!track) {
      return NextResponse.json(
        { error: 'Track not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(track)
  } catch (error) {
    console.error('Failed to fetch track:', error)
    return NextResponse.json(
      { error: 'Failed to fetch track' },
      { status: 500 }
    )
  }
}
