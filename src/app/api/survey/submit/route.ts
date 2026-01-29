import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { answers } = await request.json()

    // Calculate scores from answers
    let moodScore = 0
    let anxietyLevel = 0
    let supportLevel = 0
    let count = 0

    // Save individual responses and calculate averages
    for (const [questionId, answer] of Object.entries(answers)) {
      // Upsert the response
      await prisma.surveyResponse.upsert({
        where: {
          userId_questionId: {
            userId: session.user.id,
            questionId,
          },
        },
        update: { answer: answer as string },
        create: {
          userId: session.user.id,
          questionId,
          answer: answer as string,
        },
      })

      // Get the question to understand its category
      const question = await prisma.surveyQuestion.findUnique({
        where: { id: questionId },
      })

      if (question && question.type === 'scale') {
        const value = parseInt(answer as string)
        if (question.category === 'mood' || question.category === 'energy' || question.category === 'bonding') {
          moodScore += value
          count++
        }
        if (question.category === 'anxiety') {
          anxietyLevel = 8 - value // Invert so higher = more anxiety
        }
        if (question.category === 'support') {
          supportLevel = value
        }
      }
    }

    // Update user profile with survey results
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        surveyCompleted: true,
        moodScore: count > 0 ? Math.round(moodScore / count) : null,
        anxietyLevel,
        supportLevel,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to submit survey:', error)
    return NextResponse.json(
      { error: 'Failed to submit survey' },
      { status: 500 }
    )
  }
}
