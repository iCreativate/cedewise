import { CurrencyProvider } from '@/context/CurrencyContext';
import SharedLayout from "@/components/SharedLayout";

export default function SettingsLayout({
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