import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
    return NextResponse.json(
      { error: 'Error creating risk' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const risks = await prisma.risk.findMany({
      include: {
        submitter: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(risks)
  } catch (error) {
    console.error('Error fetching risks:', error)
    return NextResponse.json(
      { error: 'Error fetching risks' },
      { status: 500 }
    )
  }
} 