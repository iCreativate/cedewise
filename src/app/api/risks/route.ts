import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isPrismaUnavailableError } from '@/lib/db-errors'

export async function POST(request: Request) {
  try {
    const json = await request.json()

    const risk = await prisma.risk.create({
      data: {
        title: json.title,
        description: json.description,
        premium: parseFloat(json.premium),
        coverage: json.coverage,
        status: 'DRAFT',
        submitterId: json.submitterId,
      },
    })

    return NextResponse.json(risk)
  } catch (error) {
    console.error('Error creating risk:', error)
    if (isPrismaUnavailableError(error)) {
      return NextResponse.json(
        { error: 'Database is not configured or unreachable. Set DATABASE_URL in .env.' },
        { status: 503 }
      )
    }
    return NextResponse.json(
      { error: 'Error creating risk' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where = status
      ? { status: status as 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED' | 'BOUND' }
      : {}

    const risks = await prisma.risk.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        submitter: {
          select: {
            name: true,
            email: true,
            company: true,
          },
        },
      },
    })

    return NextResponse.json(risks)
  } catch (error) {
    console.error('Error fetching risks:', error)
    if (isPrismaUnavailableError(error)) {
      return NextResponse.json([])
    }
    return NextResponse.json(
      { error: 'Error fetching risks' },
      { status: 500 }
    )
  }
} 