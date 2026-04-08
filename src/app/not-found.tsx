export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl bg-white shadow-sm border border-gray-200 p-6">
        <h1 className="text-lg font-semibold text-gray-900">Page not found</h1>
        <p className="mt-2 text-sm text-gray-600">
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <a
          href="/"
          className="mt-4 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Go to home
        </a>
      </div>
    </div>
  )
}

