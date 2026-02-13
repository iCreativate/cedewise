'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ReinsurerDashboardPage() {
  const { userRole } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Redirect to analytics page since we're removing the dashboard overview
    if (mounted && userRole === 'reinsurer') {
      router.replace('/analytics');
    }
  }, [mounted, userRole, router]);

  if (!mounted) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (userRole !== 'reinsurer') {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Access Denied</h1>
        <p className="mt-2 text-gray-600">You must be logged in as a reinsurer to view this page.</p>
      </div>
    );
  }

  return null;
} 