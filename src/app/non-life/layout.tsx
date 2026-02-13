'use client'

import { CurrencyProvider } from '@/context/CurrencyContext';
import SharedLayout from "@/components/SharedLayout";

export default function NonLifeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CurrencyProvider>
      <SharedLayout>{children}</SharedLayout>
    </CurrencyProvider>
  );
} 