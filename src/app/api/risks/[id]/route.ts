import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isPrismaUnavailableError } from '@/lib/db-errors'

const VALID_STATUSES = ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'BOUND'] as const

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await _request.json()
    const { status } = body

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid or missing status' },
        { status: 400 }
      )
    }

    const risk = await prisma.risk.update({
      where: { id },
      data: { status },
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

    return NextResponse.json(risk)
  } catch (error) {
    console.error('Error updating risk:', error)
    if (isPrismaUnavailableError(error)) {
      return NextResponse.json(
        { error: 'Database is not configured or unreachable. Set DATABASE_URL in .env.' },
        { status: 503 }
      )
    }
    return NextResponse.json(
      { error: 'Error updating risk' },
      { status: 500 }
    )
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const risk = await prisma.risk.findUnique({
      where: { id },
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

    if (!risk) {
      return NextResponse.json({ error: 'Risk not found' }, { status: 404 })
    }

    return NextResponse.json(risk)
  } catch (error) {
    console.error('Error fetching risk:', error)
    if (isPrismaUnavailableError(error)) {
      return NextResponse.json({ error: 'Risk service unavailable' }, { status: 503 })
    }
    return NextResponse.json(
      { error: 'Error fetching risk' },
      { status: 500 }
    )
  }
}
