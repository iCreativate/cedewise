import { CurrencyProvider } from '@/context/CurrencyContext';
import SharedLayout from "@/components/SharedLayout";

export default function ReinsuranceLayout({
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