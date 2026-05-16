'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, BookOpen, LogOut, Menu, X,
  ArrowDownLeft, ArrowUpRight, ArrowLeftRight, User
} from 'lucide-react'
import toast from 'react-hot-toast'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/passbook', label: 'Passbook', icon: BookOpen },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
]

interface DashboardLayoutProps {
  children: React.ReactNode
  userName?: string
  accountNumber?: string
}

export function DashboardLayout({ children, userName, accountNumber }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      toast.success('Signed out successfully')
      router.push('/')
      router.refresh()
    } catch {
      toast.error('Failed to sign out')
    } finally {
      setSigningOut(false)
    }
  }

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-white border-r border-orange-100 w-64">
      {/* Logo */}
      <div className="p-6 border-b border-orange-100">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 flamingo-gradient rounded-xl flex items-center justify-center shadow-glow shrink-0">
            <span className="text-white font-bold">N</span>
          </div>
          <div>
            <p className="font-display font-bold text-mine-shaft text-lg leading-none">NovaBank</p>
            <p className="text-xs text-dusty-gray/80 mt-0.5">Digital Banking</p>
          </div>
        </Link>
      </div>

      {/* User info */}
      {userName && (
        <div className="mx-4 my-4 p-3.5 bg-rose-bud/10 rounded-xl border border-orange-100">
          <p className="text-xs text-flamingo font-medium uppercase tracking-wider mb-1">Logged in as</p>
          <p className="font-semibold text-mine-shaft text-sm truncate">{userName}</p>
          <p className="text-xs text-dusty-gray font-mono mt-0.5">{accountNumber}</p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-4 py-2">
        <p className="text-xs font-semibold text-dusty-gray/80 uppercase tracking-widest mb-3 px-2">Navigation</p>
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium
                transition-all duration-200 group
                ${active
                  ? 'flamingo-gradient text-white shadow-md'
                  : 'text-dusty-gray hover:bg-rose-bud/10 hover:text-spicy-mix'
                }
              `}
            >
              <item.icon size={18} className={active ? 'text-white' : 'text-dusty-gray/80 group-hover:text-flamingo'} />
              {item.label}
            </Link>
          )
        })}

        <div className="mt-4 pt-4 border-t border-dusty-gray/10">
          <p className="text-xs font-semibold text-dusty-gray/80 uppercase tracking-widest mb-3 px-2">Quick Actions</p>
          {[
            { href: '/dashboard?action=credit', icon: ArrowDownLeft, label: 'Add Money', color: 'text-green-600' },
            { href: '/dashboard?action=debit', icon: ArrowUpRight, label: 'Withdraw', color: 'text-red-500' },
            { href: '/dashboard?action=transfer', icon: ArrowLeftRight, label: 'Transfer', color: 'text-blue-600' },
          ].map((a) => (
            <Link
              key={a.label}
              href={a.href}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium text-dusty-gray hover:bg-rose-bud/10 hover:text-spicy-mix transition-all duration-200 group"
            >
              <a.icon size={18} className={`${a.color} group-hover:scale-110 transition-transform`} />
              {a.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t border-orange-100">
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 disabled:opacity-60"
        >
          <LogOut size={18} />
          {signingOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen bg-whisper overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-50 flex">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-orange-100 flex items-center justify-between px-6 shrink-0">
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-rose-bud/10 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} className="text-dusty-gray" />
          </button>
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-7 h-7 flamingo-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-display font-bold text-mine-shaft">NovaBank</span>
          </div>
          <div className="hidden lg:block">
            <p className="text-dusty-gray text-sm">
              Welcome back, <span className="text-flamingo font-semibold">{userName?.split(' ')[0]}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flamingo-gradient rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">
                {userName?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
