'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-xl bg-white shadow-sm border border-gray-200 p-6">
          <h1 className="text-lg font-semibold text-gray-900">Application error</h1>
          <p className="mt-2 text-sm text-gray-600">
            A fatal error occurred.
          </p>
          <pre className="mt-3 text-xs text-gray-700 whitespace-pre-wrap break-words bg-gray-50 border border-gray-200 rounded-md p-3">
            {error?.message}
          </pre>
          <button
            type="button"
            onClick={reset}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  )
}

