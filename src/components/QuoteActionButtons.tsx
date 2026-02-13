'use client';

import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface QuoteActionButtonsProps {
  onAcceptValues: () => void;
  onProposeNewValues: () => void;
  onShowDetails: () => void;
}

const QuoteActionButtons: React.FC<QuoteActionButtonsProps> = ({
  onAcceptValues,
  onProposeNewValues,
  onShowDetails,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleShowDetails = () => {
    setShowDetails(!showDetails);
    onShowDetails();
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onAcceptValues}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Accept Broker Values
      </button>
      <button
        onClick={onProposeNewValues}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Propose New Values
      </button>
      <button
        onClick={handleShowDetails}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
      >
        Show Details
        <ChevronDownIcon
          className={`ml-1 h-4 w-4 transform transition-transform ${
            showDetails ? 'rotate-180' : ''
          }`}
        />
      </button>
    </div>
  );
};

export default QuoteActionButtons;
