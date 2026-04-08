import { NextResponse } from 'next/server'

// Mirrors the broker Non‑Proportional Facultative Reinsurance mock shape.
// This gives the reinsurer "Main Submission" tab a reliable fallback on refresh/direct navigation.
const NON_PROP_FAC_SUBMISSIONS = [
  {
    id: 1,
    cedingCompany: 'Santam',
    policyReferenceNumber: 'NPR-2024-001',
    brokerName: 'AON',
    insured: 'XYZ Corporation',
    classOfBusiness: 'Property',
    businessOccupation: 'Manufacturing',
    riskCountry: 'South Africa',
    excessLayer: 'R 100,000,000 xs R 50,000,000',
    status: 'Pending Review',
    sumInsured: 'R 850,000,000',
    currency: 'ZAR',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    premiumRate: '0.5',
    premiumAmount: 'R 4,250,000',
    commission: '5',
    brokerage: '2.5',
    overriderCommission: '1',
    description: 'Property risk for manufacturing facility in Johannesburg',
    documents: ['Risk Survey.pdf', 'Financials.xlsx'],
  },
] as const

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const intId = Number.parseInt(id, 10)
  if (!Number.isFinite(intId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const submission = NON_PROP_FAC_SUBMISSIONS.find((s) => s.id === intId)
  if (!submission) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(submission)
}

