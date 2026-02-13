'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import DocumentUpload from '@/components/DocumentUpload'
import { Link, ArrowLeft, MapPin } from 'lucide-react'
import Chat from '@/components/Chat'

interface FormData {
  cedingCompany: string
  insured: string
  broker: string
  policyReferenceNumber: string
  reinsurerRating: string
  reinsurers: string[]
  currency: string
  brokerCompanyName: string
  insuranceCompany: string
  insuredName: string
  classOfBusiness: string
  businessOccupation: string
  riskCountry: string
  quoteRequiredPercentage: string
  reinsurerOfferPercentage: string
  remainingShare: string
  premiumRate: string
  deductions: string
  commission: string
  brokerage: string
  overriderCommission: string
  physicalDamage: string
  businessInterruption: string
  sumInsured: string
  premiumAmount: string
  startDate: string
  endDate: string
  description: string
  requiredDocuments: {
    surveyReport: boolean
    claimsHistoryReport: boolean
    financialStatement: boolean
    riskDetails: boolean
  }
  supportingDocuments: any[]
  riskAddress: {
    lat: number;
    lng: number;
    address: string;
  };
  additionalCovers: {
    burglaryTheft: boolean
    goodsInTransit: boolean
    glass: boolean
    money: boolean
    fidelityGuarantee: boolean
  }
  constructionType: string
  lossRatio: string
}

const classOfBusinessOptions = [
  { id: 'property', name: 'Property' },
  { id: 'marine', name: 'Marine' },
  { id: 'aviation', name: 'Aviation' },
  { id: 'engineering', name: 'Engineering' },
  { id: 'liability', name: 'Liability' },
]

const currencyOptions = [
  { id: 'USD', name: 'USD' },
  { id: 'EUR', name: 'EUR' },
  { id: 'GBP', name: 'GBP' },
]

const constructionTypeOptions = [
  { id: 'standard', name: 'Standard' },
  { id: 'non-standard', name: 'Non-Standard' },
]

export default function NonProportionalFacultativeReinsurancePage() {
  const router = useRouter()
  const { userRole, userName } = useUser()
  const [reinsuranceCompany] = useState('Munich Re')
  
  // Fields that reinsurers can edit
  const reinsurerEditableFields = [
    'reinsurerRating',
    'reinsurerOfferPercentage',
    'remainingShare',
    'premiumRate',
    'deductions'
  ]

  // Helper function to determine if a field should be editable
  const isFieldEditable = (fieldName: string) => {
    if (userRole === 'reinsurer') {
      return reinsurerEditableFields.includes(fieldName)
    }
    return true
  }

  // Helper function to get input classes based on editability
  const getInputClasses = (fieldName: string) => {
    const baseClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
    return isFieldEditable(fieldName) 
      ? baseClasses 
      : `${baseClasses} bg-gray-50 cursor-not-allowed`
  }

  // Calculate total deduction
  const calculateTotalDeduction = (): string => {
    const commission = parseFloat(formData.commission || '0');
    const brokerage = parseFloat(formData.brokerage || '0');
    const overriderCommission = parseFloat(formData.overriderCommission || '0');
    
    if (isNaN(commission) && isNaN(brokerage) && isNaN(overriderCommission)) {
      return '0.00';
    }
    
    const total = (isNaN(commission) ? 0 : commission) + 
                 (isNaN(brokerage) ? 0 : brokerage) + 
                 (isNaN(overriderCommission) ? 0 : overriderCommission);
    
    return total.toFixed(2);
  };

  const [formData, setFormData] = useState<FormData>({
    cedingCompany: 'Santam',
    insured: 'Vulcan',
    broker: 'AON',
    policyReferenceNumber: 'NPR-456789-1234',
    reinsurerRating: '',
    reinsurers: [],
    currency: 'USD',
    brokerCompanyName: 'Broker Demo',
    insuranceCompany: '',
    insuredName: '',
    classOfBusiness: 'Property',
    businessOccupation: 'Mining',
    riskCountry: 'Mozambique',
    quoteRequiredPercentage: '75%',
    reinsurerOfferPercentage: '',
    remainingShare: '50%',
    premiumRate: '2.5%',
    deductions: 'Total: 30.00%',
    commission: '15',
    brokerage: '12.5',
    overriderCommission: '2.5',
    physicalDamage: '1,200,000,000',
    businessInterruption: '470,000,000',
    sumInsured: 'R 1,670,000,000 USD',
    premiumAmount: 'R 41,750,000',
    startDate: '01 Jan 2024',
    endDate: '31 Dec 2024',
    description: 'Mining facility with state-of-the-art equipment and safety measures.',
    requiredDocuments: {
      surveyReport: false,
      claimsHistoryReport: false,
      financialStatement: false,
      riskDetails: false
    },
    supportingDocuments: [],
    riskAddress: {
      lat: -26.2041, // Default to Johannesburg
      lng: 28.0473,
      address: '123 Main Street, Sandton, Johannesburg, South Africa'
    },
    additionalCovers: {
      burglaryTheft: false,
      goodsInTransit: false,
      glass: false,
      money: false,
      fidelityGuarantee: false
    },
    constructionType: 'standard',
    lossRatio: '65%',
  })
  const [submissionId] = useState('sub_654321')
  const [activeTab, setActiveTab] = useState<'details' | 'quote' | 'documents' | 'risk-address' | 'currency-calculator' | 'submissions'>('details')
  const [mapError, setMapError] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<google.maps.Map | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showDeductions, setShowDeductions] = useState(false)
  const [isLoadingBrokerSubmissions, setIsLoadingBrokerSubmissions] = useState(false)
  const [nonProportionalFacData, setNonProportionalFacData] = useState([
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
      documents: ['Risk Survey.pdf', 'Financials.xlsx']
    },
    // Add more mock data as needed
  ])
  const [currencyAmount, setCurrencyAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [convertedAmount, setConvertedAmount] = useState('')

  useEffect(() => {
    if (activeTab === 'risk-address' && mapRef.current && !googleMapRef.current) {
      const loadGoogleMapsScript = () => {
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        script.async = true
        script.defer = true
        script.onerror = () => {
          setMapError('Failed to load Google Maps. Please try again later.')
        }
        script.onload = () => {
          try {
            const center = {
              lat: formData.riskAddress.lat,
              lng: formData.riskAddress.lng
            }
            
            googleMapRef.current = new google.maps.Map(mapRef.current!, {
              center,
              zoom: 15,
            })

            new google.maps.Marker({
              position: center,
              map: googleMapRef.current,
              title: 'Risk Location'
            })
          } catch (error) {
            console.error('Error initializing map:', error)
            setMapError('Failed to initialize map. Please try again later.')
          }
        }
        document.head.appendChild(script)
      }

      loadGoogleMapsScript()
    }
  }, [activeTab, formData.riskAddress.lat, formData.riskAddress.lng])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({
      ...prev,
      requiredDocuments: {
        ...prev.requiredDocuments,
        [name]: checked
      }
    }))
  }

  const handleDocumentUpload = (fileData: any) => {
    setFormData(prev => ({
      ...prev,
      supportingDocuments: [...prev.supportingDocuments, fileData]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  const handleSaveDraft = () => {
    console.log('Draft saved:', formData)
  }

  const handleViewSubmission = (id: number) => {
    // Store the selected submission in sessionStorage
    const submission = nonProportionalFacData.find(sub => sub.id === id)
    if (submission) {
      sessionStorage.setItem('selectedSubmission', JSON.stringify(submission))
      router.push(`/non-life/reinsurer/submissions/non-proportional/${id}`)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 px-8 py-6 rounded-b-2xl shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xl font-semibold text-white mb-2">Non-Proportional Facultative Reinsurance</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-2">
                <div className="text-blue-100 text-sm">
                  <span className="text-blue-200">Submission from:</span> Ceding Company
                </div>
                <div className="text-blue-100 text-sm">
                  <span className="text-blue-200">Insured Name:</span> Vulcan
                </div>
                <div className="text-blue-100 text-sm">
                  <span className="text-blue-200">Reference:</span> NPR-{formData.policyReferenceNumber}
                </div>
                <div className="text-blue-100 text-sm">
                  <span className="text-blue-200">Underwriter:</span> {userName || 'Smith Mangena'}
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">Pending Review</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto mt-8">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-3 -mb-px border-b-2 font-semibold bg-white rounded-t-md ${activeTab === 'details' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-blue-700'}`}
            onClick={() => setActiveTab('details')}
          >
            Submission Details
          </button>
          <button
            className={`px-6 py-3 -mb-px border-b-2 font-semibold bg-white rounded-t-md ${activeTab === 'quote' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-blue-700'}`}
            onClick={() => setActiveTab('quote')}
          >
            My Quote
          </button>
          <button
            className={`px-6 py-3 -mb-px border-b-2 font-semibold bg-white rounded-t-md ${activeTab === 'documents' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-blue-700'}`}
            onClick={() => setActiveTab('documents')}
          >
            My Documents
          </button>
          <button
            className={`px-6 py-3 -mb-px border-b-2 font-semibold bg-white rounded-t-md ${activeTab === 'risk-address' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-blue-700'}`}
            onClick={() => setActiveTab('risk-address')}
          >
            Risk Address
          </button>
          <button
            className={`px-6 py-3 -mb-px border-b-2 font-semibold bg-white rounded-t-md ${activeTab === 'currency-calculator' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-blue-700'}`}
            onClick={() => setActiveTab('currency-calculator')}
          >
            Currency Calculator
          </button>
          <button
            className={`px-6 py-3 -mb-px border-b-2 font-semibold bg-white rounded-t-md ${activeTab === 'submissions' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-blue-700'}`}
            onClick={() => setActiveTab('submissions')}
          >
            Submissions
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-8">
            {activeTab === 'details' && (
              <>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Submission Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Ceding Company</label>
                    <input value={formData.cedingCompany} readOnly className="w-full bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-gray-700 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Insured</label>
                    <input value={formData.insured} readOnly className="w-full bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-gray-700 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Broker</label>
                    <input value={formData.broker} readOnly className="w-full bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-gray-700 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Policy Reference Number</label>
                    <input value={formData.policyReferenceNumber} readOnly className="w-full bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-gray-700 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Class of Business</label>
                    <input value={formData.classOfBusiness} readOnly className="w-full bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-gray-700 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Business Occupation</label>
                    <input value={formData.businessOccupation} readOnly className="w-full bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-gray-700 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Risk Country</label>
                    <input value={formData.riskCountry} readOnly className="w-full bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-gray-700 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Construction Type</label>
                    <select
                      name="constructionType"
                      value={formData.constructionType}
                      onChange={handleInputChange}
                      className="w-full bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-gray-700 text-sm"
                    >
                      {constructionTypeOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Quote Required Percentage</label>
                    <input value={formData.quoteRequiredPercentage} readOnly className="w-full bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-gray-700 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Physical Damage</label>
                    <input value={formData.physicalDamage} readOnly className="w-full bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-gray-700 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Business Interruption</label>
                    <input value={formData.businessInterruption} readOnly className="w-full bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-gray-700 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Sum Insured</label>
                    <input value={formData.sumInsured} readOnly className="w-full bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-gray-700 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Remaining Share</label>
                    <input value={formData.remainingShare} readOnly className="w-full bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-gray-700 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Premium Rate (%)</label>
                    <input value={formData.premiumRate} readOnly className="w-full bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-gray-700 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Premium Amount</label>
                    <input value={formData.premiumAmount} readOnly className="w-full bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-gray-700 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Quote</label>
                    <input value={formData.premiumAmount} readOnly className="w-full bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-gray-700 text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">Deductions (%)</label>
                    <div className="relative">
                      <input value={formData.deductions} readOnly className="w-full bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-gray-700 text-sm pr-10" />
                      <span className="absolute right-3 top-2 text-gray-400 pointer-events-none">▼</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                    <input value={formData.startDate} readOnly className="w-full bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-gray-700 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">End Date</label>
                    <input value={formData.endDate} readOnly className="w-full bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-gray-700 text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">Description</label>
                    <textarea value={formData.description} readOnly rows={2} className="w-full bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-gray-700 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Loss Ratio (%)</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="lossRatio"
                        value={formData.lossRatio}
                        onChange={handleInputChange}
                        className="w-full bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-gray-700 text-sm pr-8"
                        placeholder="Enter loss ratio"
                      />
                      <span className="absolute right-3 top-2 text-gray-400 pointer-events-none">%</span>
                    </div>
                  </div>
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Loss History Period Start Date</label>
                      <input value={formData.startDate} readOnly className="w-full bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-gray-700 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Loss History Period End Date</label>
                      <input value={formData.endDate} readOnly className="w-full bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-gray-700 text-sm" />
                    </div>
                  </div>
                </div>
              </>
            )}
            {activeTab === 'quote' && (
              <div className="bg-[#F7FAFC] rounded-xl p-8 border border-gray-200">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-blue-900 mb-1">{reinsuranceCompany}'s Quote</h2>
                  <div className="text-sm text-gray-500">Provide your proposal for this non-proportional reinsurance submission</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Share Offer (%)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter share percentage"
                        value={formData.reinsurerOfferPercentage}
                        onChange={e => setFormData(prev => ({ ...prev, reinsurerOfferPercentage: e.target.value }))}
                      />
                      <span className="text-gray-400">%</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Enter the percentage share you wish to offer</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sum Insured Amount</label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 bg-gray-100"
                      value={formData.sumInsured}
                      readOnly
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deductions (%)</label>
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 bg-gray-100"
                    value={formData.deductions}
                    readOnly
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <button className="w-full md:w-auto bg-gray-100 text-gray-700 px-6 py-2 rounded-md font-medium border border-gray-200 hover:bg-gray-200">Accept Broker Values</button>
                  <button className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700">Propose New Values</button>
                  <div className="flex-1 flex items-center justify-end">
                    <button
                      className="text-blue-700 text-sm font-medium flex items-center gap-1 hover:underline"
                      type="button"
                      onClick={() => setShowDetails((prev) => !prev)}
                    >
                      {showDetails ? 'Hide Details' : 'Show Details'}
                      <svg className={`h-4 w-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                  </div>
                </div>
                {showDetails && (
                  <div className="mb-6 bg-white border border-blue-100 rounded-lg p-6 text-sm text-gray-700">
                    <div className="mb-2 font-semibold text-blue-900">Quote Details</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><span className="font-medium">Remaining Share:</span> {formData.remainingShare}</div>
                      <div><span className="font-medium">Deductions:</span> {formData.deductions}</div>
                      <div><span className="font-medium">Sum Insured:</span> {formData.sumInsured}</div>
                      <div><span className="font-medium">Premium Rate:</span> {formData.premiumRate}%</div>
                      <div><span className="font-medium">Share Offer:</span> {formData.reinsurerOfferPercentage}%</div>
                      <div><span className="font-medium">Calculated Premium:</span> {formData.premiumAmount}</div>
                    </div>
                  </div>
                )}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quote Conditions & Comments</label>
                  <textarea
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 min-h-[80px]"
                    placeholder="Enter any conditions or comments related to your quote..."
                  />
                </div>
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Supporting Documents</label>
                  <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center min-h-[120px]">
                    <svg className="h-10 w-10 text-blue-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-4 4h-4a1 1 0 01-1-1v-4h6v4a1 1 0 01-1 1z" /></svg>
                    <div className="text-gray-500 text-sm mb-1">Upload files or drag and drop</div>
                    <div className="text-xs text-gray-400">PDF, DOCX, XLSX up to 10MB</div>
                    <button className="mt-3 text-blue-600 hover:underline text-sm font-medium">Upload files</button>
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-100">Cancel</button>
                  <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-300" type="button" onClick={handleSaveDraft}>Save Draft</button>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700">Submit Quote</button>
                </div>
              </div>
            )}
            {activeTab === 'documents' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-6">My Documents</h2>
                <div className="mb-4">
                  <h3 className="text-base font-semibold text-gray-700 mb-2">Required Documents</h3>
                  <ul className="list-disc pl-6 text-sm text-gray-700">
                    <li>Survey Report</li>
                    <li>Claims History Report</li>
                    <li>Financial Statement</li>
                    <li>Risk Details</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-700 mb-2">Supporting Documents</h3>
                  <ul className="list-disc pl-6 text-sm text-gray-700">
                    <li>Policy Schedule.pdf <span className="text-blue-600 cursor-pointer ml-2">Download</span></li>
                    <li>Risk Assessment.docx <span className="text-blue-600 cursor-pointer ml-2">Download</span></li>
                  </ul>
                </div>
              </div>
            )}
            {activeTab === 'risk-address' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Risk Location</h2>
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin className="h-5 w-5" />
                    <span>{formData.riskAddress.address}</span>
                  </div>
                  {mapError ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                      {mapError}
                    </div>
                  ) : (
                    <div 
                      ref={mapRef} 
                      style={{ width: '100%', height: '500px' }}
                      className="rounded-lg border border-gray-200"
                    />
                  )}
                </div>
              </div>
            )}
            {activeTab === 'currency-calculator' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Currency Converter & Calculator</h2>
                <div className="space-y-6">
                  {/* Currency Converter */}
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h3 className="text-base font-semibold text-gray-700 mb-4">Currency Converter</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={currencyAmount}
                            onChange={(e) => setCurrencyAmount(e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter amount"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">From Currency</label>
                        <select
                          value={fromCurrency}
                          onChange={(e) => setFromCurrency(e.target.value)}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="USD">USD - US Dollar</option>
                          <option value="EUR">EUR - Euro</option>
                          <option value="GBP">GBP - British Pound</option>
                          <option value="ZAR">ZAR - South African Rand</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">To Currency</label>
                        <select
                          value={toCurrency}
                          onChange={(e) => setToCurrency(e.target.value)}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="EUR">EUR - Euro</option>
                          <option value="USD">USD - US Dollar</option>
                          <option value="GBP">GBP - British Pound</option>
                          <option value="ZAR">ZAR - South African Rand</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Converted Amount</label>
                        <div className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700">
                          {convertedAmount || '0.00'} {toCurrency}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => {
                          // Mock conversion - in real app, this would use an API
                          const rate = 1.1; // Example rate
                          const converted = parseFloat(currencyAmount) * rate;
                          setConvertedAmount(converted.toFixed(2));
                        }}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Convert Currency
                      </button>
                    </div>
                  </div>

                  {/* Premium Calculator */}
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h3 className="text-base font-semibold text-gray-700 mb-4">Premium Calculator</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sum Insured</label>
                        <input
                          type="text"
                          value={formData.sumInsured}
                          readOnly
                          className="w-full rounded-md border-gray-300 bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Premium Rate (%)</label>
                        <input
                          type="text"
                          value={formData.premiumRate}
                          readOnly
                          className="w-full rounded-md border-gray-300 bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Calculated Premium</label>
                        <input
                          type="text"
                          value={formData.premiumAmount}
                          readOnly
                          className="w-full rounded-md border-gray-300 bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                        <input
                          type="text"
                          value={formData.currency}
                          readOnly
                          className="w-full rounded-md border-gray-300 bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'submissions' && (
              <div className="overflow-x-auto">
                {isLoadingBrokerSubmissions ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                    <span className="ml-4 text-gray-700">Loading submissions...</span>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Ceding Company</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Reference Number</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Broker</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Insured</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Class of Business</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Risk Country</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Excess Layer</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {nonProportionalFacData.map((submission) => (
                        <tr key={submission.id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {submission.cedingCompany}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {submission.policyReferenceNumber}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {submission.brokerName}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {submission.insured}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {submission.classOfBusiness}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {submission.riskCountry}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {submission.excessLayer}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              submission.status === 'Bound' ? 'bg-green-100 text-green-800' :
                              submission.status === 'Quoted' ? 'bg-blue-100 text-blue-800' :
                              submission.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {submission.status}
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={() => handleViewSubmission(submission.id)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>

          {/* Communication Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h3 className="text-base font-semibold text-gray-800 mb-4">Communication with Broker</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-2">
                <Chat submissionId={submissionId} />
              </div>
              <div className="text-xs text-gray-500 mt-1">All messages are visible to both parties. Communication is recorded for audit purposes.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 