import SharedLayout from "@/components/SharedLayout";

export default function LearningPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SharedLayout>{children}</SharedLayout>
  );
} 