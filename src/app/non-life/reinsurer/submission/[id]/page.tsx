'use client';

import React from 'react';
import ReinsurerSubmissionForm from '@/components/ReinsurerSubmissionForm';
import { useParams } from 'next/navigation';

const SubmissionPage = () => {
  const params = useParams();
  const submissionId = params.id;

  // TODO: Fetch submission data using the ID
  // For now using mock data
  const mockData = {
    cedingCompany: "Santam",
    insuredName: "Vulcan",
    reference: "PRO-PR-456789-1234",
    underwriter: "Insurer Demo",
    status: "Pending Review",
    policyReference: "PR-456789-1234",
    broker: "AON",
    classOfBusiness: "Property",
    businessOccupation: "Mining",
    riskCountry: "Mozambique",
    quoteRequiredPercentage: 75,
    physicalDamage: 1200000000,
    businessInterruption: 470000000,
    sumInsured: 1670000000,
    remainingShare: 50,
    premiumRate: 2.5,
    premiumAmount: 41750000,
    deductions: {
      total: 30.00,
      breakdown: [
        { name: 'Commission', percentage: 20.00 },
        { name: 'Brokerage', percentage: 10.00 },
        { name: 'Tax', percentage: 5.00 }
      ]
    },
    startDate: "01 Jan 2024",
    endDate: "31 Dec 2024",
    description: "Mining facility with state-of-the-art equipment and safety measures."
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ReinsurerSubmissionForm
        type="proportional"
        data={mockData}
      />
    </div>
  );
};

export default SubmissionPage; 