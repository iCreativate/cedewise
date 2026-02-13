export default async function TreatyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Treaty details</h1>
      <p className="text-gray-600 mt-2">Treaty ID: {id}</p>
    </div>
  );
}
