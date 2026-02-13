'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RoleGuard from '@/components/RoleGuard'

// Define a proper interface for params
interface PageParams {
  id: string;
}

function ProportionalSubmissionPage({ params }: { params: any }) {
  const router = useRouter();
  // Use React.use() to unwrap params Promise with proper typing
  const { id: submissionId } = React.use(params) as PageParams;
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('submission');
  
  // Add state for interactive buttons
  const [isProposingNewValues, setIsProposingNewValues] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  
  // States for form data
  const [shareOffer, setShareOffer] = useState<string>('');
  const [premiumAmount, setPremiumAmount] = useState<string>('');
  const [quoteConditions, setQuoteConditions] = useState<string>('');
  const [brokerage, setBrokerage] = useState<string>('');
  const [overrider, setOverrider] = useState<string>('');
  const [acceptBrokerCommission, setAcceptBrokerCommission] = useState<boolean>(false);
  const [proposingNewCommission, setProposingNewCommission] = useState<boolean>(false);
  const [proposedBrokerage, setProposedBrokerage] = useState<string>('');
  const [proposedOverrider, setProposedOverrider] = useState<string>('');
  const [acceptRate, setAcceptRate] = useState<boolean>(false);
  const [proposingNewRate, setProposingNewRate] = useState<boolean>(false);
  const [proposedRate, setProposedRate] = useState<string>('');
  const [showDeductions, setShowDeductions] = useState<boolean>(false);
  
  // File upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  // Add state for messages
  const [messages, setMessages] = useState<Array<{
    id: number,
    sender: 'reinsurer' | 'broker',
    text: string,
    timestamp: Date
  }>>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  
  // Load submission data from sessionStorage
  useEffect(() => {
    const storedSubmission = sessionStorage.getItem('selectedSubmission');
    if (storedSubmission) {
      const parsedSubmission = JSON.parse(storedSubmission);
      if (parsedSubmission.id === parseInt(submissionId)) {
        setSubmission(parsedSubmission);
      } else {
        // ID mismatch, try to fetch from API
        fetchSubmission(submissionId);
      }
    } else {
      // No stored submission, fetch from API
      fetchSubmission(submissionId);
    }
    setLoading(false);
  }, [submissionId]);

  const fetchSubmission = async (id: string) => {
    // In a real application, you would fetch the submission from your API
    // For now, we'll show a message that we couldn't find the data
    console.log(`Would fetch submission with ID: ${id}`);
    // setLoading(false);
  };

  // Format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  // Calculate total deduction
  const calculateTotalDeduction = (): string => {
    if (!submission) return '0';
    
    const commission = parseFloat(submission.commission || '0');
    const brokerageValue = parseFloat(submission.brokerage || '0');
    const overriderCommission = parseFloat(submission.overriderCommission || '0');
    
    if (isNaN(commission) && isNaN(brokerageValue) && isNaN(overriderCommission)) {
      return '0';
    }
    
    const total = (isNaN(commission) ? 0 : commission) + 
                 (isNaN(brokerageValue) ? 0 : brokerageValue) + 
                 (isNaN(overriderCommission) ? 0 : overriderCommission);
    
    return total.toFixed(2);
  };

  // View document
  const viewDocument = (document: string) => {
    // In a real application, this would open the document
    console.log(`Viewing document: ${document}`);
    alert(`Viewing document: ${document}`);
  };

  // Submit quote
  const submitQuote = () => {
    if (!submission) return;
    
    // Here you would typically send the data to your backend
    console.log('Submitting quote for', submission.id, {
      shareOffer,
      premiumAmount,
      quoteConditions,
      brokerage,
      overrider,
      acceptBrokerCommission,
      proposingNewCommission,
      proposedBrokerage,
      proposedOverrider,
      acceptRate,
      proposingNewRate,
      proposedRate
    });
    
    // Redirect back to the dashboard or show a success message
    router.push('/non-life/reinsurer?success=true');
  };

  // Add function to send a message
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg = {
        id: Date.now(),
        sender: 'reinsurer' as const,
        text: newMessage.trim(),
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, newMsg]);
      setNewMessage('');
      
      // In a real app, you'd send this to your backend API
      console.log('Message sent:', newMsg);
    }
  };

  // Add function to format message timestamp
  const formatMessageTime = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  // Add document upload handler function before the submitQuote function
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prevFiles => [...prevFiles, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const uploadFiles = () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        setUploadProgress(0);
        
        // Add files to submission document list (in a real app, you'd send these to your backend)
        console.log('Files uploaded:', selectedFiles);
        
        // Clear selected files after successful upload
        setSelectedFiles([]);
        
        // Notification would happen here in a real app
        alert('Documents uploaded successfully');
      }
    }, 300);
  };

  // Button handlers
  const handleProposeNewValues = () => {
    setIsProposingNewValues(true);
    setShowDetails(true); // Automatically show details when proposing new values
  };

  const handleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleAcceptBrokerValues = () => {
    setIsProposingNewValues(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <span className="ml-4 text-lg text-gray-700">Loading submission details...</span>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Submission Not Found</h2>
        <p className="text-gray-600 mb-6">We couldn't find the submission details you're looking for.</p>
        <button
          onClick={() => router.push('/non-life/reinsurer')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page title and info - now includes back button on the right */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Proportional Facultative Reinsurance
              </h1>
              <p className="text-blue-100 mt-1">
                Submission from {submission.company} • Reference: {submission.policyReferenceNumber}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                submission.status === 'Bound' ? 'bg-green-100 text-green-800' :
                submission.status === 'Quoted' ? 'bg-blue-100 text-blue-800' :
                submission.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {submission.status}
              </span>
              <button
                onClick={() => router.push('/non-life/reinsurer')}
                className="inline-flex items-center text-sm font-medium text-white hover:text-blue-100 bg-blue-700 bg-opacity-30 px-3 py-2 rounded-md"
              >
                <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 text-center py-4 px-4 font-medium text-sm ${
                activeTab === 'submission'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('submission')}
            >
              Submission Details
            </button>
            <button
              className={`flex-1 text-center py-4 px-4 font-medium text-sm ${
                activeTab === 'quote'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('quote')}
            >
              Your Quote
            </button>
            <button
              className={`flex-1 text-center py-4 px-4 font-medium text-sm ${
                activeTab === 'documents'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('documents')}
            >
              Documents
            </button>
            <button
              className={`flex-1 text-center py-4 px-4 font-medium text-sm ${
                activeTab === 'communication'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('communication')}
            >
              Communication
            </button>
          </div>

          <div className="p-6">
            {/* Tab content here */}
          </div>
        </div>
        
        {/* Content based on active tab */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {activeTab === 'submission' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Submission Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-gray-700">
                    {submission.company}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Insured
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-gray-700">
                    {submission.insured}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Policy Reference Number
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-gray-700">
                    {submission.policyReferenceNumber}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Broker
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-gray-700">
                    {submission.brokerName}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class of Business
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-gray-700">
                    {submission.classOfBusiness}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Occupation
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-gray-700">
                    {submission.businessOccupation}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Risk Country
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-gray-700">
                    {submission.riskCountry}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quote Required Percentage
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-gray-700">
                    {submission.quoteRequiredPercentage}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Physical Damage
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-gray-700">
                    {submission.physicalDamage || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Interruption
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-gray-700">
                    {submission.businessInterruption || 'N/A'}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sum Insured
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-gray-700">
                    {submission.sumInsured} {submission.currency}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remaining Share
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-gray-700">
                    {submission.remainingShare}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Premium Rate (%)
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-gray-700">
                    {submission.premiumRate}%
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Premium Amount
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-gray-700">
                    {submission.premiumAmount}
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                <div 
                  className="flex items-center justify-between cursor-pointer" 
                  onClick={() => setShowDeductions(!showDeductions)}
                >
                  <div className="flex items-center">
                    <h3 className="text-md font-medium text-gray-700">
                      Deductions (%)
                    </h3>
                    <span className="ml-2 text-sm text-gray-500">
                      Total: {calculateTotalDeduction()}%
                    </span>
                  </div>
                  <svg 
                    className={`h-5 w-5 text-gray-500 transform transition-transform ${
                      showDeductions ? 'rotate-180' : ''
                    }`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                
                {showDeductions && (
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Commission (%)
                      </label>
                      <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-gray-700">
                        {submission.commission || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Brokerage (%)
                      </label>
                      <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-gray-700">
                        {submission.brokerage || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Overrider Commission (%)
                      </label>
                      <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-gray-700">
                        {submission.overriderCommission || 'N/A'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-gray-700">
                    {formatDate(submission.startDate)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-gray-700">
                    {formatDate(submission.endDate)}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-gray-700 min-h-[80px]">
                  {submission.description || 'No description provided.'}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6 mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Communication with Broker</h3>
                
                <div className="flex-1 bg-gray-50 rounded-lg p-4 mb-4 h-60 overflow-y-auto border border-gray-200">
                  {messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map(msg => (
                        <div 
                          key={msg.id} 
                          className={`flex ${msg.sender === 'reinsurer' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
                              msg.sender === 'reinsurer' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-200 text-gray-800'
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                            <p className="text-xs text-gray-500 mt-1 text-right">
                              {formatMessageTime(msg.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center flex items-center justify-center h-full">
                      <div>
                        <p className="text-gray-500 text-sm mb-2">No messages yet.</p>
                        <p className="text-gray-500 text-xs">Start the conversation with the broker about this submission.</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-auto">
                  <form 
                    onSubmit={sendMessage}
                    className="flex space-x-2"
                  >
                    <input
                      type="text"
                      name="message"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                      placeholder="Type your message here..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Send
                    </button>
                  </form>
                  <p className="text-xs text-gray-500 mt-2">
                    All messages are visible to both parties. Communication is recorded for audit purposes.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'quote' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 mb-6">
                <h2 className="text-lg font-medium text-blue-800 mb-2">Your Quote</h2>
                <p className="text-sm text-blue-600">Provide your proposal for this reinsurance submission</p>
              </div>
              
              {/* Quote Actions Section */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Quote Actions</h2>
                </div>

                <div className="flex items-center space-x-4 mb-6">
                  <button
                    type="button"
                    onClick={handleAcceptBrokerValues}
                    className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md ${
                      !isProposingNewValues 
                        ? 'text-white bg-blue-600 hover:bg-blue-700'
                        : 'text-gray-700 bg-white hover:bg-gray-50'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    Accept Broker Values
                  </button>
                  <button
                    type="button"
                    onClick={handleProposeNewValues}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                      isProposingNewValues
                        ? 'text-white bg-blue-600 hover:bg-blue-700'
                        : 'text-gray-700 bg-white hover:bg-gray-50 border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    Propose New Values
                  </button>
                  <button
                    type="button"
                    onClick={handleShowDetails}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  >
                    {showDetails ? 'Hide Details' : 'Show Details'}
                    <svg 
                      className={`ml-1 h-5 w-5 transform transition-transform ${showDetails ? 'rotate-180' : ''}`} 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {/* Quote Form */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Share Offer (%)</label>
                      <input
                        type="number"
                        value={shareOffer}
                        onChange={(e) => setShareOffer(e.target.value)}
                        disabled={!isProposingNewValues}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Enter share percentage"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Premium Amount</label>
                      <input
                        type="number"
                        value={premiumAmount}
                        onChange={(e) => setPremiumAmount(e.target.value)}
                        disabled={!isProposingNewValues}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Enter premium amount"
                      />
                    </div>
                  </div>

                  {/* Additional Details Section */}
                  {showDetails && (
                    <div className="mt-6 space-y-6">
                      <h3 className="text-lg font-medium text-gray-900">Additional Details</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Premium Rate (%)</label>
                          <input
                            type="number"
                            value={proposedRate}
                            onChange={(e) => setProposedRate(e.target.value)}
                            disabled={!isProposingNewValues}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="Enter premium rate"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Brokerage (%)</label>
                          <input
                            type="number"
                            value={proposedBrokerage}
                            onChange={(e) => setProposedBrokerage(e.target.value)}
                            disabled={!isProposingNewValues}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="Enter brokerage percentage"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Overrider (%)</label>
                          <input
                            type="number"
                            value={proposedOverrider}
                            onChange={(e) => setProposedOverrider(e.target.value)}
                            disabled={!isProposingNewValues}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="Enter overrider percentage"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700">Quote Conditions</label>
                    <textarea
                      value={quoteConditions}
                      onChange={(e) => setQuoteConditions(e.target.value)}
                      disabled={!isProposingNewValues}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter any conditions or notes"
                    />
                  </div>
                </div>
              </div>
              
              {/* Document upload section */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
                <h3 className="text-base font-medium text-gray-900 mb-4">Supporting Documents</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Documents
                  </label>
                  <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex justify-center text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload files</span>
                          <input 
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            className="sr-only"
                            multiple
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF, DOCX, XLSX up to 10MB</p>
                    </div>
                  </div>
                </div>
                
                {selectedFiles.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files</h4>
                    <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden">
                      {selectedFiles.map((file, index) => (
                        <li key={index} className="px-4 py-3 flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <svg className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a3 3 0 006 0V7a1 1 0 112 0v4a5 5 0 01-10 0V7a5 5 0 0110 0"></path>
                            </svg>
                            <span className="truncate">{file.name}</span>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="ml-4 flex-shrink-0 text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={uploadFiles}
                        disabled={isUploading}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                          isUploading ? 'bg-gray-300 text-gray-500' : 'text-white bg-blue-600 hover:bg-blue-700'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                      >
                        {isUploading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Uploading ({uploadProgress}%)
                          </>
                        ) : (
                          'Upload Files'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 px-6 py-4 rounded-lg border border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => router.push('/non-life/reinsurer')}
                  className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={submitQuote}
                  className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit Quote
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Documents</h2>
              
              {submission.documents && submission.documents.length > 0 ? (
                <div className="border border-gray-200 rounded-md p-4">
                  <ul className="divide-y divide-gray-200">
                    {submission.documents.map((doc: string, index: number) => {
                      const fileExtension = doc.split('.').pop()?.toLowerCase() || '';
                      let fileIcon = '📄';
                      let fileColor = 'text-gray-600';
                      
                      // Determine file type and icon
                      if (['pdf'].includes(fileExtension)) {
                        fileIcon = '📕';
                        fileColor = 'text-red-600';
                      } else if (['xlsx', 'xls', 'csv'].includes(fileExtension)) {
                        fileIcon = '📗';
                        fileColor = 'text-green-600';
                      } else if (['docx', 'doc'].includes(fileExtension)) {
                        fileIcon = '📘';
                        fileColor = 'text-blue-600';
                      } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
                        fileIcon = '🖼️';
                        fileColor = 'text-purple-600';
                      }
                      
                      return (
                        <li key={index} className="py-3">
                          <button 
                            onClick={() => viewDocument(doc)}
                            className={`flex items-center space-x-3 hover:text-blue-600 ${fileColor} w-full text-left`}
                          >
                            <span className="text-2xl">{fileIcon}</span>
                            <div>
                              <p className="font-medium">{doc}</p>
                              <p className="text-xs text-gray-500">Uploaded by {submission.brokerName}</p>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-500">No documents available for this submission.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Wrap the component with RoleGuard for role-based access control
export default function ProtectedProportionalSubmissionPage({ params }: { params: any }) {
  return (
    <RoleGuard allowedRoles={['reinsurer', 'insurer']}>
      <ProportionalSubmissionPage params={params} />
    </RoleGuard>
  );
} 