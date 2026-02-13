import SharedLayout from "@/components/SharedLayout";

export default function SubmissionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SharedLayout>{children}</SharedLayout>
  );
} 