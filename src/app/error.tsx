'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffbf7] p-6 font-body">
      <div className="max-w-md w-full text-center animate-slide-up">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-100">
          <AlertTriangle size={30} className="text-red-500" />
        </div>
        <h1 className="font-display text-2xl font-bold text-mine-shaft mb-2">Something went wrong</h1>
        <p className="text-dusty-gray mb-8 text-sm leading-relaxed">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl flamingo-gradient text-white text-sm font-semibold hover:shadow-glow transition-all active:scale-95"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 text-dusty-gray text-sm font-semibold hover:bg-gray-200 transition-all active:scale-95"
          >
            <Home size={15} />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
