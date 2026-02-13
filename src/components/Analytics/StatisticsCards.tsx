'use client'

interface StatisticsCardsProps {
  newSubmissions: {
    count: number
    change: number
  }
  pendingRenewals: {
    count: number
    urgent: number
  }
  activePolicies: {
    count: number
    totalPremium: number
  }
  totalPremium: {
    amount: number
    averagePerPolicy: number
  }
}

export default function StatisticsCards({
  newSubmissions,
  pendingRenewals,
  activePolicies,
  totalPremium
}: StatisticsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* New Submissions */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-start">
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <h3 className="mt-4 text-sm font-medium text-gray-500">New Submissions</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-2xl font-semibold text-gray-900">{newSubmissions.count}</p>
          <span className={`text-sm ${newSubmissions.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {newSubmissions.change >= 0 ? '+' : ''}{newSubmissions.change} from last week
          </span>
        </div>
        <div className="mt-2 h-1 w-full bg-blue-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }} />
        </div>
      </div>

      {/* Pending Renewals */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-start">
          <div className="p-2 bg-amber-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <h3 className="mt-4 text-sm font-medium text-gray-500">Pending Renewals</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-2xl font-semibold text-gray-900">{pendingRenewals.count}</p>
          {pendingRenewals.urgent > 0 && (
            <span className="text-sm text-red-600">
              {pendingRenewals.urgent} Urgent
            </span>
          )}
        </div>
        <div className="mt-2 h-1 w-full bg-amber-100 rounded-full overflow-hidden">
          <div className="h-full bg-amber-500 rounded-full" style={{ width: '25%' }} />
        </div>
      </div>

      {/* Active Policies */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-start">
          <div className="p-2 bg-green-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <h3 className="mt-4 text-sm font-medium text-gray-500">Active Policies</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-2xl font-semibold text-gray-900">{activePolicies.count}</p>
          <span className="text-sm text-gray-500">
            R {(activePolicies.totalPremium / 1000000).toFixed(0)}M Premium
          </span>
        </div>
        <div className="mt-2 h-1 w-full bg-green-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }} />
        </div>
      </div>

      {/* Total Premium */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-start">
          <div className="p-2 bg-purple-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <h3 className="mt-4 text-sm font-medium text-gray-500">Total Premium</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-2xl font-semibold text-gray-900">R {(totalPremium.amount / 1000000).toFixed(0)}M</p>
          <span className="text-sm text-gray-500">
            R {(totalPremium.averagePerPolicy / 1000000).toFixed(0)}M avg
          </span>
        </div>
        <div className="mt-2 h-1 w-full bg-purple-100 rounded-full overflow-hidden">
          <div className="h-full bg-purple-500 rounded-full" style={{ width: '85%' }} />
        </div>
      </div>
    </div>
  )
}
