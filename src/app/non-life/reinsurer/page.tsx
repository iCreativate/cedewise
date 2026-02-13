'use client'

import React, { useState } from 'react'
import RoleGuard from '@/components/RoleGuard'
import { ReinsurerDashboard } from './dashboard'
import ExcelJS from 'exceljs'

// Helper function to export data to Excel
const exportToExcel = async (data: any[], fileName: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Data');

  // Add headers
  const headers = Object.keys(data[0]);
  worksheet.addRow(headers);

  // Add data
  data.forEach(item => {
    worksheet.addRow(Object.values(item));
  });

  // Generate blob
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Create download link and trigger download
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
};

// Sample facultative reinsurance data - updated to match Submission interface
const facultativeData = [
  {
    id: 1,
    company: 'Global Insurance Ltd',
    insured: 'Tech Manufacturing Co.',
    brokerName: 'ABC Brokers',
    policyNo: 'POL-12345-2023',
    riskCountry: 'South Africa',
    classOfBusiness: 'Property',
    businessOccupation: 'Manufacturing',
    sumInsured: 750000000,
    status: 'Active',
    remainingShare: 100,
    premiumRate: '0.5',
    premiumAmount: '3,750,000.00',
    commission: '15',
    reinsurer_rating: 'A+',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    description: 'High value manufacturing facility with comprehensive coverage.',
    reinsurers: [
      { name: 'Global Re', quotedShare: 50, premium: 1875000 },
      { name: 'African Re', quotedShare: 30, premium: 1125000 },
      { name: 'Munich Re', quotedShare: 20, premium: 750000 }
    ],
    documents: [
      'Policy Schedule.pdf',
      'Risk Assessment.xlsx',
      'Engineering Report.pdf'
    ]
  },
  {
    id: 2,
    company: 'Continental Insurance',
    insured: 'Ocean Shipping Inc.',
    brokerName: 'Marine Brokers Ltd',
    policyNo: 'MAR-78901-2023',
    riskCountry: 'Mozambique',
    classOfBusiness: 'Marine',
    businessOccupation: 'Shipping',
    sumInsured: 350000000,
    status: 'Active',
    remainingShare: 100,
    premiumRate: '0.64',
    premiumAmount: '2,250,000.00',
    commission: '12',
    reinsurer_rating: 'A',
    startDate: '2023-03-15',
    endDate: '2024-03-14',
    description: 'Fleet of 5 container vessels with international coverage.',
    reinsurers: [
      { name: 'Swiss Re', quotedShare: 40, premium: 900000 },
      { name: 'Partner Re', quotedShare: 35, premium: 787500 },
      { name: 'Hannover Re', quotedShare: 25, premium: 562500 }
    ],
    documents: [
      'Marine Survey.pdf',
      'Fleet Details.xlsx',
      'Navigation Records.pdf'
    ]
  },
];

// Sample proportional FAC data
const proportionalFacData = [
  {
    id: 1,
    company: 'Santam',
    insured: 'Vulcan',
    brokerName: 'AON',
    policyNo: 'POL-V12345-2023',
    riskCountry: 'Mozambique',
    classOfBusiness: 'Assets all Risk',
    businessOccupation: 'Mining',
    sumInsured: 1670000000,
    status: 'Quoted',
    remainingShare: 30,
    premiumRate: '2.5',
    premiumAmount: '41,750,000.00',
    commission: '15',
    reinsurer_rating: 'A+',
    startDate: '2023-12-01',
    endDate: '2024-12-01',
    description: 'Mining facility with state-of-the-art equipment and safety measures.',
    reinsurers: [
      { name: 'Global Re', quotedShare: 25, premium: 125000000 },
      { name: 'African Re', quotedShare: 15, premium: 75000000 },
      { name: 'Munich Re', quotedShare: 30, premium: 150000000 }
    ],
    documents: [
      'Loss History.pdf',
      'Survey Report.xlsx',
      'Rational Fire Design.pdf',
      'Sum Insured Calculations.xlsx'
    ]
  },
];

// Sample non-proportional FAC data
const nonProportionalFacData = [
  {
    id: 1,
    company: 'Liberty Insurance',
    insured: 'Tech Industries',
    brokerName: 'Willis Towers',
    policyNo: 'POL-TI789-2023',
    riskCountry: 'South Africa',
    classOfBusiness: 'Property',
    businessOccupation: 'Manufacturing',
    sumInsured: 950000000,
    status: 'Bound',
    remainingShare: 0,
    premiumRate: '3.2',
    premiumAmount: '30,400,000.00',
    commission: '12',
    reinsurer_rating: 'A',
    startDate: '2023-11-15',
    endDate: '2024-11-15',
    description: 'Technology manufacturing facility with specialized infrastructure.',
    reinsurers: [
      { name: 'Swiss Re', quotedShare: 40, premium: 152000000 },
      { name: 'Partner Re', quotedShare: 30, premium: 114000000 },
      { name: 'Hannover Re', quotedShare: 30, premium: 114000000 }
    ],
    documents: [
      'Risk Assessment.pdf',
      'Fire Protection Systems.docx',
      'Financial Statements.xlsx'
    ]
  },
];

function ReinsurerPage(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('proportional');

  // Handle export function
  const handleExport = () => {
    if (activeTab === 'proportional') {
      exportToExcel(proportionalFacData, 'Proportional_FAC_Portfolio');
    } else {
      exportToExcel(nonProportionalFacData, 'Non_Proportional_FAC_Portfolio');
    }
  };

  return (
    <ReinsurerDashboard
      facultativeData={facultativeData}
      proportionalFacData={proportionalFacData}
      nonProportionalFacData={nonProportionalFacData}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      handleExport={handleExport}
    />
  );
}

// Wrap the component with RoleGuard for role-based access control
export default function ProtectedReinsurerPage() {
  return (
    <RoleGuard allowedRoles={['reinsurer', 'insurer']}>
      <ReinsurerPage />
    </RoleGuard>
  )
} 