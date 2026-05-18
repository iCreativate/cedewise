'use client'

import { useParams } from 'next/navigation'
import ReinsurerSubmissionForm from '@/components/ReinsurerSubmissionForm'

const SubmissionPage = () => {
  const params = useParams()
  const submissionId = params.id

  const mockData = {
    cedingCompany: 'Santam',
    insuredName: 'Vulcan',
    reference: 'PRO-PR-456789-1234',
    underwriter: 'Insurer Demo',
    status: 'Pending Review',
    policyReference: 'PR-456789-1234',
    broker: 'AON',
    classOfBusiness: 'Property',
    businessOccupation: 'Mining',
    riskCountry: 'Mozambique',
    quoteRequiredPercentage: 75,
    physicalDamage: 1200000000,
    businessInterruption: 470000000,
    sumInsured: 1670000000,
    remainingShare: 50,
    premiumRate: 2.5,
    premiumAmount: 41750000,
    deductions: {
      total: 30.0,
      breakdown: [
        { name: 'Commission', percentage: 20.0 },
        { name: 'Brokerage', percentage: 10.0 },
        { name: 'Tax', percentage: 5.0 },
      ],
    },
    startDate: '01 Jan 2024',
    endDate: '31 Dec 2024',
    description: 'Mining facility with state-of-the-art equipment and safety measures.',
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ReinsurerSubmissionForm type="proportional" data={mockData} key={String(submissionId ?? 'draft')} />
    </div>
  )
}

export default SubmissionPage
