'use client'

import SharedLayout from '@/components/SharedLayout';

export default function ReinsurerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SharedLayout>
      {children}
    </SharedLayout>
  )
} 