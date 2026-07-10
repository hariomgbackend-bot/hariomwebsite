'use client'

export default function AdminError({ error, reset }) {
  return (
    <div className="flex items-center justify-center h-full min-h-[60vh]">
      <div className="text-center max-w-sm">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Admin Error</h2>
        <p className="text-sm text-gray-500 mb-4">Something went wrong in the admin panel.</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-[#0B1F4B] text-white text-sm font-semibold rounded-xl hover:bg-[#071035] transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
