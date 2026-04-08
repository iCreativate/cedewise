import { NextResponse } from 'next/server'

// Mirrors the broker Non‑Proportional Facultative Reinsurance form shape.
// This gives the reinsurer "Main Submission" tab a reliable fallback on refresh/direct navigation.
const NON_PROP_FAC_SUBMISSIONS = [
  {
    id: 1,
    // Broker form fields (src/app/non-life/broker/facultative/non-proportional/page.tsx)
    policyReferenceNumber: 'NON-456789-1234',
    name: '',
    company: 'Marsh Insurance Brokers',
    insurance_company: 'Old Mutual',
    insured: 'Commercial Tower',
    classOfBusiness: 'Property',
    businessOccupation: 'Commercial Real Estate',
    riskCountry: 'Botswana',
    quoteRequiredPercentage: '75%',
    reinsurerOfferPercentage: '25%',
    remainingShare: '50%',
    reinsuranceLayer: 'R 1,200,000,000',
    primaryLayer: 'R 600,000,000',
    physicalDamage: 'R 1,200,000,000',
    businessInterruption: 'R 600,000,000',
    sumInsured: 'R 1,800,000,000',
    commission: '0',
    brokerage: '0',
    overriderCommission: '0',
    premiumAmount: 'R 36,000,000',
    premiumAmountAtReinsurer: 'R 36,000,000',
    premiumRate: '2.00',
    reinsurer_rating: 'A+',
    currency: 'USD',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    description: 'Excess of loss submission for a commercial property tower.',
    documentTypes: {
      lossHistory: true,
      surveyReport: true,
      rationalFireDesign: false,
      complianceLetter: false,
      sumInsuredCalculations: true,
    },
    documents: ['Loss History', 'Survey Report', 'Sum Insured Calculations'],
    uploadedFiles: [{ name: 'Loss History.pdf' }, { name: 'Survey Report.pdf' }],

    // Backwards-compat fields used in earlier UI versions
    cedingCompany: 'Old Mutual',
    brokerName: 'Marsh',
    excessLayer: 'R 1,200,000,000 xs R 600,000,000',
    status: 'Pending Review',
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

