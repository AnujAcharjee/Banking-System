import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffbf7] p-6 font-body">
      <div className="max-w-md w-full text-center animate-slide-up">
        <div className="w-24 h-24 flamingo-gradient rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow">
          <span className="text-white font-display font-bold text-4xl">404</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-mine-shaft mb-3">Page not found</h1>
        <p className="text-dusty-gray mb-10 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl flamingo-gradient text-white font-semibold hover:shadow-glow transition-all active:scale-95 shadow-md"
          >
            <Home size={16} />
            Home
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-bud/10 text-spicy-mix border border-rose-bud/50 font-semibold hover:bg-rose-bud/20 transition-all active:scale-95"
          >
            <ArrowLeft size={16} />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
