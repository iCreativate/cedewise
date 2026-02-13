import SharedLayout from "@/components/SharedLayout";

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SharedLayout>{children}</SharedLayout>
  );
} 