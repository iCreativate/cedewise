import React from 'react';

interface CommissionBadgeProps {
  commissionValue: string;
  isFOC?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * A reusable component for displaying commission values with special handling for FOC (Free of Commission)
 * 
 * @param commissionValue - The commission value to display (e.g. "10%", "FOC")
 * @param isFOC - Whether this commission is FOC (Free of Commission)
 * @param size - The size of the badge (sm, md, lg)
 * @param className - Additional CSS classes to apply
 */
const CommissionBadge: React.FC<CommissionBadgeProps> = ({ 
  commissionValue, 
  isFOC = false, 
  size = 'md',
  className = ''
}) => {
  // Determine size classes
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  // Base classes for the badge
  const baseClasses = 'inline-flex items-center rounded-full font-medium';
  
  // Color classes based on FOC status
  const colorClasses = isFOC 
    ? 'bg-green-100 text-green-800' 
    : 'bg-gray-100 text-gray-800';
  
  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${colorClasses} ${className}`}>
      {isFOC ? 'FOC' : commissionValue}
    </span>
  );
};

export default CommissionBadge; 