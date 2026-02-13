import SharedLayout from "@/components/SharedLayout";

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SharedLayout>{children}</SharedLayout>
  );
} 