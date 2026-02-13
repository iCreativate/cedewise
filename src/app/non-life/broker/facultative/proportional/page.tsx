'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { countries } from '../../../../../app/utils/countries'
import { currencies } from '../../../../../app/utils/currencies'
import { useUser } from '@/context/UserContext'
import DocumentUpload, { UploadedFileData } from '@/components/DocumentUpload'
import ChatbotAssistant from '@/components/ChatbotAssistant'
import CurrencyConverter from '@/components/CurrencyConverter'
import MultiSelect from '@/components/MultiSelect'
import { logger } from '@/lib/logger'
import Link from 'next/link'
import { ArrowLeftIcon, ArrowPathIcon, TrashIcon, ScaleIcon } from '@heroicons/react/24/outline'
import { reinsurers, Reinsurer } from '@/app/utils/reinsurers'
import TabCard from '@/components/TabCard'

// Add AWS Lex bot configuration - define variables that were previously used without definition
const AWS_BOT_ID = "TSTALIASID"; // Placeholder ID - replace with actual bot ID in production
const AWS_BOT_ALIAS_ID = "TSTAUTHID"; // Placeholder ID - replace with actual alias ID in production

// Function to generate a unique policy reference number
const generatePolicyReferenceNumber = () => {
  const currentYear = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `PRO-${currentYear}-${timestamp}-${random}`;
};

// Format number with commas (e.g., 1000 -> 1,000, 1000000 -> 1,000,000)
const formatNumberWithCommas = (value: string) => {
  // Remove any existing commas first
  const numberValue = value.replace(/,/g, '');
  
  // If it's not a valid number, return as is
  if (isNaN(Number(numberValue))) return value;
  
  // Format with commas for numbers of any size, including millions and billions
  // This regex adds commas for every 3 digits from the right
  return numberValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Parse formatted number by removing commas
const parseFormattedNumber = (value: string) => {
  // Remove commas for calculations
  return value.replace(/,/g, '');
};

export default function ProportionalFacultativePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { userRole, userName, brokerCompany } = useUser()
  
  const [formData, setFormData] = useState({
    policyReferenceNumber: generatePolicyReferenceNumber(), // Add policy reference number
    name: '',
    company: '',
    insurance_company: '',
    insured: '',
    classOfBusiness: '',
    businessOccupation: '',
    riskCountry: '',
    quoteRequiredPercentage: '',
    reinsurerOfferPercentage: '',
    remainingShare: '',
    premiumRate: '',
    commission: '',
    brokerage: '',
    overriderCommission: '',
    physicalDamage: '',
    businessInterruption: '',
    sumInsured: '',
    premiumAmount: '',
    reinsurer_rating: '',
    currency: 'USD',
    startDate: '',
    endDate: '',
    description: '',
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const [documentTypes, setDocumentTypes] = useState({
    lossHistory: false,
    surveyReport: false,
    rationalFireDesign: false,
    complianceLetter: false,
    sumInsuredCalculations: false,
  })

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [fileError, setFileError] = useState<string | null>(null)

  const [chatMessages, setChatMessages] = useState<Array<{
    sender: 'broker' | 'reinsurer';
    message: string;
    timestamp: string;
  }>>([
    { 
      sender: 'reinsurer', 
      message: 'Hello, I have some questions about this submission. Can you provide more details about the insured property?', 
      timestamp: new Date(Date.now() - 86400000).toISOString() 
    },
    { 
      sender: 'broker', 
      message: 'Sure, it\'s a manufacturing facility with state-of-the-art fire protection systems. What specific details do you need?', 
      timestamp: new Date(Date.now() - 75600000).toISOString() 
    },
    { 
      sender: 'reinsurer', 
      message: 'Thanks, I need more information about the fire protection systems and any previous loss history.', 
      timestamp: new Date(Date.now() - 43200000).toISOString() 
    }
  ])

  // Add state for reinsurer data and loading state
  const [reinsurerData, setReinsurerData] = useState<{
    commission: string;
    freeOfCommission: boolean;
    premiumAmount: string;
  } | null>(null);
  
  const [isLoadingReinsurerData, setIsLoadingReinsurerData] = useState(false);
  
  // Mock function to fetch reinsurer data - in real app this would be an API call
  const fetchReinsurerData = () => {
    // This is mock data - in a real app this would be fetched from your API
    setIsLoadingReinsurerData(true);
    setReinsurerData({
      commission: '7.5',
      freeOfCommission: Math.random() > 0.5, // Random for demo purposes
      premiumAmount: '325,000' // Added premium amount from reinsurer
    });
    setIsLoadingReinsurerData(false);
  };
  
  // Fetch reinsurer data on mount
  useEffect(() => {
    fetchReinsurerData();
  }, []);
  
  // Update commission based on reinsurer data when it changes
  useEffect(() => {
    if (reinsurerData) {
      setFormData(prev => ({
        ...prev,
        commission: reinsurerData.freeOfCommission ? '' : reinsurerData.commission,
        brokerage: reinsurerData.freeOfCommission ? '' : reinsurerData.commission,
        overriderCommission: reinsurerData.freeOfCommission ? '' : reinsurerData.commission,
        premiumAmount: reinsurerData.premiumAmount // Update premium amount from reinsurer data
      }));
    }
  }, [reinsurerData]);

  // Calculate remaining share when quote required or reinsurer offer changes
  useEffect(() => {
    if (formData.quoteRequiredPercentage && formData.reinsurerOfferPercentage) {
      const quoteRequired = parseFloat(parseFormattedNumber(formData.quoteRequiredPercentage));
      const reinsurerOffer = parseFloat(parseFormattedNumber(formData.reinsurerOfferPercentage));
      
      if (!isNaN(quoteRequired) && !isNaN(reinsurerOffer)) {
        const remaining = Math.max(0, quoteRequired - reinsurerOffer);
        setFormData(prev => ({
          ...prev,
          remainingShare: formatNumberWithCommas(remaining.toString())
        }));
      }
    }
  }, [formData.quoteRequiredPercentage, formData.reinsurerOfferPercentage]);

  // Calculate premium amount when sum insured or premium rate changes
  useEffect(() => {
    if (formData.sumInsured && formData.premiumRate) {
      const sumInsured = parseFloat(parseFormattedNumber(formData.sumInsured));
      const premiumRate = parseFloat(parseFormattedNumber(formData.premiumRate));
      
      if (!isNaN(sumInsured) && !isNaN(premiumRate)) {
        const premiumAmount = (sumInsured * premiumRate) / 100;
        setFormData(prev => ({
          ...prev,
          premiumAmount: formatNumberWithCommas(premiumAmount.toFixed(2))
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        premiumAmount: ''
      }));
    }
  }, [formData.sumInsured, formData.premiumRate]);

  // Calculate sum insured from physical damage and business interruption
  useEffect(() => {
    if (formData.physicalDamage || formData.businessInterruption) {
      const physicalDamage = parseFloat(parseFormattedNumber(formData.physicalDamage)) || 0;
      const businessInterruption = parseFloat(parseFormattedNumber(formData.businessInterruption)) || 0;
      
      if (physicalDamage > 0 || businessInterruption > 0) {
        const total = physicalDamage + businessInterruption;
        setFormData(prev => ({
          ...prev,
          sumInsured: formatNumberWithCommas(total.toString())
        }));
      }
    }
  }, [formData.physicalDamage, formData.businessInterruption]);

  // Add state for S3 uploaded files
  const [s3UploadedFiles, setS3UploadedFiles] = useState<UploadedFileData[]>([]);
  
  // Handle file upload completion from S3
  const handleFileUploaded = (fileData: UploadedFileData) => {
    setS3UploadedFiles(prev => [...prev, fileData]);
    
    // Log the file upload event
    logger.trackUserAction('PROPORTIONAL_FAC_DOCUMENT_UPLOAD', userName || 'unknown', {
      fileName: fileData.name,
      fileType: fileData.type,
      fileSize: fileData.size
    });
  };
  
  const [selectedReinsurers, setSelectedReinsurers] = useState<Reinsurer[]>([]);

  // Handle reinsurer selection change
  const handleReinsurerChange = (selected: Reinsurer[]) => {
    setSelectedReinsurers(selected);
    
    // Log the selection for tracking purposes
    logger.trackUserAction('REINSURER_SELECTION_CHANGE', userRole || 'unknown', {
      formType: 'proportional',
      selectedReinsurers: selected.map(r => r.id)
    });
  };
  
  // Track form submission events
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Log the form submission attempt
    logger.info('Proportional facultative form submission', {
      context: 'FORM_SUBMISSION',
      data: {
        formData,
        documentTypes,
        uploadedFiles: s3UploadedFiles.map(f => ({ 
          name: f.name, 
          type: f.type,
          key: f.key
        })),
        selectedReinsurers
      }
    });
    
    // Form validation - check for required fields
    const requiredFields = [
      'company', 
      'insured', 
      'classOfBusiness', 
      'businessOccupation',
      'riskCountry',
      'premiumRate',
      'physicalDamage',
      'businessInterruption',
      'commission',
      'startDate',
      'endDate'
    ]
    
    const newErrors: Record<string, string> = {};
    let hasError = false;
    
    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = 'This field is required';
        hasError = true;
      }
    });
    
    if (hasError) {
      setFormErrors(newErrors);
      return;
    }
    
    // Add the S3 uploaded files to the form submission data
    const submissionData = {
      ...formData,
      documents: s3UploadedFiles.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        key: file.key,
        url: file.url
      })),
      selectedReinsurers
    };
    
    // In a real app, you would send this data to your backend
    console.log('Form submitted:', submissionData);
    
    // Reset form after submission and generate a new policy reference number
    setFormData({
      ...formData,
      policyReferenceNumber: generatePolicyReferenceNumber()
    });
    
    setSelectedReinsurers([]);
    
    // Navigate back to the facultative listing page
    router.push('/non-life/broker/facultative');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    // Format numeric fields with commas
    if (['sumInsured', 'physicalDamage', 'businessInterruption', 'quoteRequiredPercentage', 'reinsurerOfferPercentage', 'premiumRate', 'commission', 'brokerage', 'overriderCommission'].includes(name) && value) {
      // Remove non-numeric characters except decimal point
      const cleanValue = value.replace(/[^0-9.]/g, '')
      
      // Only allow one decimal point
      const parts = cleanValue.split('.')
      const formattedValue = parts[0] + (parts.length > 1 ? '.' + parts[1] : '')
      
      setFormData(prev => ({ ...prev, [name]: formatNumberWithCommas(formattedValue) }))
    } else {
      const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      setFormData(prev => ({ ...prev, [name]: val }))
    }
  }

  const handleDocumentTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setDocumentTypes(prev => ({ ...prev, [name]: checked }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target
    setFileError(null)
    
    if (files && files.length > 0) {
      const fileArray = Array.from(files)
      
      // Check file size (5MB limit)
      const oversizedFiles = fileArray.filter(file => file.size > 5 * 1024 * 1024)
      if (oversizedFiles.length > 0) {
        setFileError(`Some files exceed the 5MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`)
        return
      }
      
      setUploadedFiles(prev => [...prev, ...fileArray])
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Function to format timestamp
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  // Function to handle sending a new chat message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const messageInput = document.getElementById('chatMessage') as HTMLInputElement;
    const message = messageInput.value.trim();
    
    if (message) {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'broker',
          message,
          timestamp: new Date().toISOString()
        }
      ]);
      messageInput.value = '';
    }
  };

  // Set broker company from user context when component mounts
  useEffect(() => {
    if (brokerCompany) {
      setFormData(prevState => ({
        ...prevState,
        company: brokerCompany
      }));
    }
  }, [brokerCompany]);

  const [drafts, setDrafts] = useState<Array<{
    id: string;
    date: string;
    lastEditedDate: string;
    data: any;
    name: string;
    selectedReinsurers?: Reinsurer[];
  }>>([]);
  
  const [isOffline, setIsOffline] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [showDraftNameInput, setShowDraftNameInput] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  
  // Load saved drafts when component mounts
  useEffect(() => {
    // Check if online
    const handleOnlineStatusChange = () => {
      setIsOffline(!navigator.onLine);
    };
    
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    
    // Initial check
    setIsOffline(!navigator.onLine);
    
    // Load drafts from localStorage and check for expired drafts
    const loadDrafts = () => {
      try {
        const savedDrafts = localStorage.getItem('proportionalDrafts');
        if (savedDrafts) {
          const parsedDrafts = JSON.parse(savedDrafts);
          
          // Filter out drafts older than 1 month
          const now = new Date();
          const filteredDrafts = parsedDrafts.filter((draft: any) => {
            const lastEditDate = new Date(draft.lastEditedDate || draft.date);
            const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
            return lastEditDate > oneMonthAgo;
          });
          
          // If we filtered out any drafts, save the updated list
          if (filteredDrafts.length !== parsedDrafts.length) {
            localStorage.setItem('proportionalDrafts', JSON.stringify(filteredDrafts));
            logger.trackUserAction('EXPIRED_DRAFTS_DELETED', userRole || 'unknown', {
              formType: 'proportional',
              numberDeleted: parsedDrafts.length - filteredDrafts.length
            });
          }
          
          setDrafts(filteredDrafts);
        }
      } catch (error) {
        console.error('Error loading drafts:', error);
      }
    };
    
    loadDrafts();
    
    // Set up interval to check for expired drafts every hour
    const checkExpiredDraftsInterval = setInterval(loadDrafts, 60 * 60 * 1000);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
      clearInterval(checkExpiredDraftsInterval);
    };
  }, [userRole]);
  
  // Function to handle save as draft
  const handleSaveAsDraft = () => {
    setShowDraftNameInput(true);
  };
  
  // Function to actually save the draft with name
  const saveDraft = () => {
    const now = new Date().toISOString();
    const draftId = `draft-${Date.now()}`;
    const newDraft = {
      id: draftId,
      date: now,
      lastEditedDate: now,
      data: {...formData},
      name: draftName || `Draft ${drafts.length + 1}`,
      selectedReinsurers: selectedReinsurers
    };
    
    const updatedDrafts = [...drafts, newDraft];
    setDrafts(updatedDrafts);
    
    // Save to localStorage
    try {
      localStorage.setItem('proportionalDrafts', JSON.stringify(updatedDrafts));
      setShowDraftNameInput(false);
      setDraftName('');
      
      // Log the draft save event
      logger.trackUserAction('SAVE_DRAFT', userRole || 'unknown', {
        formType: 'proportional',
        draftId
      });
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };
  
  // Function to update an existing draft
  const updateDraft = (draftId: string) => {
    const now = new Date().toISOString();
    const updatedDrafts = drafts.map(draft => {
      if (draft.id === draftId) {
        return {
          ...draft,
          data: {...formData},
          lastEditedDate: now,
          selectedReinsurers: selectedReinsurers
        };
      }
      return draft;
    });
    
    setDrafts(updatedDrafts);
    
    // Save to localStorage
    try {
      localStorage.setItem('proportionalDrafts', JSON.stringify(updatedDrafts));
      
      // Log the draft update event
      logger.trackUserAction('UPDATE_DRAFT', userRole || 'unknown', {
        formType: 'proportional',
        draftId
      });
    } catch (error) {
      console.error('Error updating draft:', error);
    }
  };
  
  // Function to load a draft
  const loadDraft = (draft: any) => {
    setFormData(draft.data);
    
    // Load selected reinsurers if available
    if (draft.selectedReinsurers) {
      setSelectedReinsurers(draft.selectedReinsurers);
    }
    
    // Store the current draft ID for potential updates
    setCurrentDraftId(draft.id);
    
    // Log the draft load event
    logger.trackUserAction('LOAD_DRAFT', userRole || 'unknown', {
      formType: 'proportional',
      draftId: draft.id
    });
  };
  
  // Function to delete a draft
  const deleteDraft = (draftId: string) => {
    const updatedDrafts = drafts.filter(draft => draft.id !== draftId);
    setDrafts(updatedDrafts);
    
    // If we're deleting the currently loaded draft, clear currentDraftId
    if (currentDraftId === draftId) {
      setCurrentDraftId(null);
    }
    
    // Save updated drafts to localStorage
    try {
      localStorage.setItem('proportionalDrafts', JSON.stringify(updatedDrafts));
      
      // Log the draft delete event
      logger.trackUserAction('DELETE_DRAFT', userRole || 'unknown', {
        formType: 'proportional',
        draftId
      });
    } catch (error) {
      console.error('Error deleting draft:', error);
    }
  };

  // Function to handle "Update Draft" button click
  const handleUpdateDraft = () => {
    if (currentDraftId) {
      updateDraft(currentDraftId);
    }
  };

  // Calculate time remaining for each draft
  const getDraftTimeRemaining = (lastEditedDate: string) => {
    const editDate = new Date(lastEditedDate || '');
    const expiryDate = new Date(editDate);
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    
    const now = new Date();
    const timeRemaining = expiryDate.getTime() - now.getTime();
    
    // Convert to days
    const daysRemaining = Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60 * 24)));
    
    return daysRemaining;
  };

  // Add this state after the other useState declarations 
  const [showDeductionDetails, setShowDeductionDetails] = useState(false);
  
  // Add this function to calculate total deductions (after other helper functions)
  const calculateTotalDeduction = (): string => {
    const commission = parseFloat(parseFormattedNumber(formData.commission || '0')) || 0;
    const brokerage = parseFloat(parseFormattedNumber(formData.brokerage || '0')) || 0;
    const overrider = parseFloat(parseFormattedNumber(formData.overriderCommission || '0')) || 0;
    return formatNumberWithCommas((commission + brokerage + overrider).toFixed(2));
  };

  const [activeTab, setActiveTab] = useState('details');

  return (
    <div className="mx-auto max-w-7xl p-4 lg:p-6 bg-gray-50">
      {/* Offline banner */}
      {isOffline && (
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 mb-6 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>You are currently offline. Your changes will be saved locally and synchronized when you're back online.</span>
          </div>
        </div>
      )}
      
      {/* Form header - as a green bar outside the TabCard */}
      <div className="bg-green-600 rounded-t-xl p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-green-500 p-2 rounded-lg mr-4">
            <ScaleIcon className="h-6 w-6 text-white" />
          </div>
          <div className="text-white">
            <h1 className="text-xl font-bold">Proportional Facultative Reinsurance</h1>
            <p className="text-sm text-white/80">Please fill in the quota share facultative reinsurance details below.</p>
          </div>
        </div>
        <Link
          href="/non-life/broker/facultative"
          className="inline-flex items-center px-4 py-2 border border-green-400 rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-400"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Facultative Dashboard
        </Link>
      </div>
      
      {/* Two column layout for form and chat */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Form column */}
        <div className="flex-1">
          <div className="bg-white shadow-md ring-1 ring-gray-200 ring-opacity-50 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="policyReferenceNumber" className="block text-sm font-medium text-gray-700">
                      Policy Reference Number
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="policyReferenceNumber"
                        name="policyReferenceNumber"
                        value={formData.policyReferenceNumber}
                        readOnly
                        className="block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm text-gray-500 sm:text-sm"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Unique reference ID for this submission. This number will be used to track your submission.
                    </p>
                  </div>
                  <div>
                    <label htmlFor="reinsurer_rating" className="block text-sm font-medium text-gray-700">
                      Reinsurer Rating
                    </label>
                  <input
                      id="reinsurer_rating"
                      name="reinsurer_rating"
                      value={formData.reinsurer_rating}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter reinsurer rating"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Please enter the rating of the reinsurer (e.g., A+, A, B++, etc.)
                  </p>
                </div>
              </div>
              
              {/* Add Reinsurer Selection field */}
              <div className={userRole === 'broker' ? 'block' : 'hidden'}>
                <MultiSelect
                  id="reinsurers"
                  label="Choose Reinsurer(s)"
                  options={reinsurers.map(r => ({ ...r, disabled: !r.registered }))}
                  selectedOptions={selectedReinsurers}
                  onChange={handleReinsurerChange}
                  placeholder="Select reinsurers (optional)"
                  displayField="name"
                  secondaryField="rating"
                  disabledMessage="Not Registered"
                  className="mb-6"
                />
                <p className="text-xs text-gray-500 mb-6">
                  If no reinsurer is selected, the submission will be seen by all registered reinsurers.
                  Greyed out reinsurers have not yet created profiles in the app.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900"
                    >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </option>
                    ))}
                    </select>
                  {userRole === 'broker' && (
                    <CurrencyConverter baseCurrency={formData.currency} />
                  )}
                  </div>
                </div>
              
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  Broker Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  readOnly={!!brokerCompany} // Make readonly if broker company is available
                  className={`mt-1 block w-full rounded-md ${brokerCompany ? 'bg-gray-100 text-gray-600' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900`}
                />
              </div>
              <div>
                <label htmlFor="insurance_company" className="block text-sm font-medium text-gray-700">
                  Insurance Company
                </label>
                <input
                  type="text"
                  id="insurance_company"
                  name="insurance_company"
                  value={formData.insurance_company}
                  onChange={handleChange}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="insured" className="block text-sm font-medium text-gray-700">
                  Insured Name
                </label>
                <input
                    type="text"
                    id="insured"
                    name="insured"
                    value={formData.insured}
                    onChange={handleChange}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="classOfBusiness" className="block text-sm font-medium text-gray-700">
                  Class of Business
                </label>
                <input
                    type="text"
                    id="classOfBusiness"
                    name="classOfBusiness"
                    value={formData.classOfBusiness}
                    onChange={handleChange}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
                    required
                />
              </div>
            </div>

            {/* Business Occupation section */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="businessOccupation" className="block text-sm font-medium text-gray-700">
                  Business Occupation
                </label>
                <input
                  type="text"
                  id="businessOccupation"
                  name="businessOccupation"
                  value={formData.businessOccupation}
                  onChange={handleChange}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
                />
              </div>
            </div>

                {/* Risk Country and Quote Required Percentage */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="riskCountry" className="block text-sm font-medium text-gray-700">
                  Risk Country
                </label>
                <select
                  id="riskCountry"
                  name="riskCountry"
                  value={formData.riskCountry}
                  onChange={handleChange}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
                >
                  <option value="">Select country</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="quoteRequiredPercentage" className="block text-sm font-medium text-gray-700">
                  Quote Required Percentage
                </label>
                <input
                  type="text"
                  id="quoteRequiredPercentage"
                  name="quoteRequiredPercentage"
                  value={formData.quoteRequiredPercentage}
                  onChange={handleChange}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
                />
              </div>
            </div>

                {/* Reinsurer Offer and Remaining Share */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="reinsurerOfferPercentage" className="block text-sm font-medium text-gray-700">
                  Reinsurer Offer Percentage
                </label>
                <input
                  type="text"
                  id="reinsurerOfferPercentage"
                  name="reinsurerOfferPercentage"
                  value={formData.reinsurerOfferPercentage}
                  onChange={handleChange}
                  disabled={userRole === 'broker' || userRole === 'insurer'}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${(userRole === 'broker' || userRole === 'insurer') ? 'bg-gray-100 text-gray-500' : 'text-gray-900'}`}
                />
              </div>
              <div>
                <label htmlFor="remainingShare" className="block text-sm font-medium text-gray-700">
                  Remaining Share
                </label>
                <input
                  type="text"
                  id="remainingShare"
                  name="remainingShare"
                  value={formData.remainingShare}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
                />
              </div>
            </div>

                {/* Premium Rate and Deductions - Updated fields */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                    <label htmlFor="premiumRate" className="block text-sm font-medium text-gray-700">
                      Premium Rate (%)
                    </label>
                    <input
                      type="text"
                      id="premiumRate"
                      name="premiumRate"
                      value={formData.premiumRate}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900"
                    />
                  </div>
                </div>

                {/* Deductions section in its own row */}
                <div>
                  <label htmlFor="deductions" className="block text-sm font-medium text-gray-700">
                    Deductions (%)
                  </label>
                  
                  <div className="mt-1">
                    {/* Total deduction field (clickable) */}
                    <div 
                      onClick={() => setShowDeductionDetails(!showDeductionDetails)}
                      className="cursor-pointer rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Deduction: {calculateTotalDeduction()}%</span>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-4 w-4 transition-transform ${showDeductionDetails ? 'rotate-180' : ''}`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Detailed deduction fields */}
                    {showDeductionDetails && (
                      <div className="grid grid-cols-3 gap-3 mt-3">
                    <div>
                      <label htmlFor="commission" className="block text-xs font-medium text-gray-500">
                        Commission
                      </label>
                      <input
                        type="text"
                        id="commission"
                        name="commission"
                        value={formData.commission}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="brokerage" className="block text-xs font-medium text-gray-500">
                        Brokerage
                      </label>
                      <input
                        type="text"
                        id="brokerage"
                        name="brokerage"
                        value={formData.brokerage}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="overriderCommission" className="block text-xs font-medium text-gray-500">
                        Overrider Commission
                      </label>
                      <input
                        type="text"
                        id="overriderCommission"
                        name="overriderCommission"
                        value={formData.overriderCommission}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sum Insured fields */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="physicalDamage" className="block text-sm font-medium text-gray-700">
                      Physical Damage
                </label>
                <input
                  type="text"
                  id="physicalDamage"
                  name="physicalDamage"
                  value={formData.physicalDamage}
                  onChange={handleChange}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
                />
              </div>
              <div>
                    <label htmlFor="businessInterruption" className="block text-sm font-medium text-gray-700">
                      Business Interruption - Loss of Profits
                </label>
                <input
                  type="text"
                  id="businessInterruption"
                  name="businessInterruption"
                  value={formData.businessInterruption}
                  onChange={handleChange}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                    <label htmlFor="sumInsured" className="block text-sm font-medium text-gray-700">
                      Sum Insured (Total)
                </label>
                    <input
                      type="text"
                      id="sumInsured"
                      name="sumInsured"
                      value={formData.sumInsured}
                      readOnly
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm text-gray-500 sm:text-sm"
                    />
                    {formData.physicalDamage && formData.businessInterruption && (
                      <p className="mt-1 text-xs text-gray-500">
                        PD: {parseFormattedNumber(formData.physicalDamage)} + BI: {parseFormattedNumber(formData.businessInterruption)}
                      </p>
                    )}
              </div>
              <div>
                    <label htmlFor="premiumAmount" className="block text-sm font-medium text-gray-700">
                      Premium Amount
                    </label>
                    <input
                      type="text"
                      id="premiumAmount"
                      name="premiumAmount"
                      value={formData.premiumAmount}
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
                    />
                    {formData.sumInsured && formData.premiumRate && (
                      <p className="mt-1 text-xs text-gray-500">
                        {parseFormattedNumber(formData.sumInsured)} × {parseFormattedNumber(formData.premiumRate)}%
                      </p>
                    )}
              </div>
            </div>

                {/* Start Date and End Date */}
            <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Period of Insurance</h4>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    disabled
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900"
                  />
                </div>
              </div>
            </div>

                {/* Description textarea */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                        rows={3}
                value={formData.description}
                onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900"
                  ></textarea>
            </div>

                {/* Document upload section with color coding */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-2">Documents</h4>
              <p className="text-sm text-gray-500 mb-4">Please select the types of documents you are submitting:</p>
              
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                        <h4 className="font-medium text-amber-800 mb-3">Required Documents</h4>
                        <div className="space-y-3">
                          <div className="flex items-center">
                    <input
                      id="lossHistory"
                      name="lossHistory"
                      type="checkbox"
                      checked={documentTypes.lossHistory}
                      onChange={handleDocumentTypeChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                            <label htmlFor="lossHistory" className="ml-2 block text-sm text-gray-700">
                      Loss History
                    </label>
                  </div>
                          <div className="flex items-center">
                    <input
                      id="surveyReport"
                      name="surveyReport"
                      type="checkbox"
                      checked={documentTypes.surveyReport}
                      onChange={handleDocumentTypeChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                            <label htmlFor="surveyReport" className="ml-2 block text-sm text-gray-700">
                      Survey Report
                    </label>
                  </div>
                          <div className="flex items-center">
                    <input
                      id="rationalFireDesign"
                      name="rationalFireDesign"
                      type="checkbox"
                      checked={documentTypes.rationalFireDesign}
                      onChange={handleDocumentTypeChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                            <label htmlFor="rationalFireDesign" className="ml-2 block text-sm text-gray-700">
                      Rational Fire Design
                    </label>
                  </div>
                          <div className="flex items-center">
                    <input
                      id="complianceLetter"
                      name="complianceLetter"
                      type="checkbox"
                      checked={documentTypes.complianceLetter}
                      onChange={handleDocumentTypeChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                            <label htmlFor="complianceLetter" className="ml-2 block text-sm text-gray-700">
                      Compliance Letter
                    </label>
                  </div>
                          <div className="flex items-center">
                    <input
                      id="sumInsuredCalculations"
                      name="sumInsuredCalculations"
                      type="checkbox"
                      checked={documentTypes.sumInsuredCalculations}
                      onChange={handleDocumentTypeChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                            <label htmlFor="sumInsuredCalculations" className="ml-2 block text-sm text-gray-700">
                      Sum Insured Calculations
                    </label>
                  </div>
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="mt-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h5>
                    <ul className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                                <li key={index} className="flex items-center justify-between py-2 px-3 bg-white rounded-md border border-gray-200">
                                  <span className="text-sm text-gray-600 truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                                      className="ml-2 text-red-600 hover:text-red-900"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

                {/* Replace file upload section with S3 component */}
                <div className="col-span-2">
                  <label htmlFor="document-upload" className="block text-sm font-medium text-gray-700 mb-2">Upload Supporting Documents</label>
                  <DocumentUpload 
                    bucketName="cedewise-documents"
                    folderPath={`proportional/${formData.policyReferenceNumber}`}
                    multiple={true}
                    onFileUploaded={handleFileUploaded}
                  />
                </div>

          {/* Submit button and Save as Draft button */}
          <div className="pt-4 flex space-x-3">
              <button
                type="submit"
              className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Submit
              </button>
            {currentDraftId ? (
              <button
                type="button"
                onClick={handleUpdateDraft}
                className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update Draft
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveAsDraft}
                className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save as Draft
              </button>
            )}
            </div>
          </form>
            </div>
          
      {/* Saved Drafts Section */}
      {drafts.length > 0 && (
        <TabCard
          title="Saved Drafts"
          description={`You have ${drafts.length} saved draft${drafts.length > 1 ? 's' : ''}`}
          color="blue"
          className="mt-8"
        >
          <ul className="divide-y divide-gray-200">
            {drafts.map((draft) => (
              <li key={draft.id} className="p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{draft.name}</h4>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(draft.date).toLocaleString()}
                    </p>
                    {draft.lastEditedDate && draft.lastEditedDate !== draft.date && (
                      <p className="text-xs text-gray-500">
                        Last edited: {new Date(draft.lastEditedDate).toLocaleString()}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {draft.data.classOfBusiness && 
                        `Class: ${draft.data.classOfBusiness} | `}
                      {draft.data.sumInsured && 
                        `Sum Insured: ${draft.data.sumInsured} ${draft.data.currency}`}
                    </p>
                    <p className="text-xs font-medium mt-1 text-amber-600">
                      Expires in {getDraftTimeRemaining(draft.lastEditedDate || draft.date)} days
                    </p>
          </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => loadDraft(draft)}
                      className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      title="Load Draft"
                    >
                      <ArrowPathIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteDraft(draft.id)}
                      className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      title="Delete Draft"
                    >
                      <TrashIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
        </div>
            </div>
              </li>
            ))}
          </ul>
        </TabCard>
      )}
        </div>
        
        {/* Chat column */}
        <div className="lg:w-80">
          <div className="sticky top-6">
            <TabCard
              title="Assistance"
              description="Get help with your submission"
              color="purple"
              className="rounded-none"
            >
              {/* Add the Lex chatbot assistant */}
              <ChatbotAssistant 
                botId={AWS_BOT_ID}
                botAliasId={AWS_BOT_ALIAS_ID}
                localeId="en_US"
                initialMessage="Hello! I'm your reinsurance assistant. How can I help with your proportional facultative submission?"
              />
            </TabCard>
          </div>
        </div>
      </div>
    </div>
  )
} 