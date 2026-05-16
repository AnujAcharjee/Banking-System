'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, Users, Activity, LogOut, Menu, ShieldCheck
} from 'lucide-react'
import toast from 'react-hot-toast'

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'All Users', icon: Users },
  { href: '/admin/transactions', label: 'Transactions Ledger', icon: Activity },
]

interface AdminLayoutProps {
  children: React.ReactNode
  adminName?: string
  accountNumber?: string
}

export function AdminLayout({ children, adminName, accountNumber }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      toast.success('Admin signed out')
      router.push('/admin/login')
      router.refresh()
    } catch {
      toast.error('Failed to sign out')
    } finally {
      setSigningOut(false)
    }
  }

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-mine-shaft border-r border-dusty-gray/30 w-64 text-white">
      {/* Logo */}
      <div className="p-6 border-b border-dusty-gray/30">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-mine-shaft/90 rounded-xl flex items-center justify-center border border-dusty-gray/20 shrink-0">
            <ShieldCheck size={20} className="text-flamingo" />
          </div>
          <div>
            <p className="font-display font-bold text-white text-lg leading-none">NovaBank</p>
            <p className="text-xs text-dusty-gray/80 mt-0.5 uppercase tracking-widest">Admin Console</p>
          </div>
        </Link>
      </div>

      {/* User info */}
      {adminName && (
        <div className="mx-4 my-4 p-3.5 bg-mine-shaft rounded-xl border border-dusty-gray/30">
          <p className="text-xs text-flamingo font-medium uppercase tracking-wider mb-1">Administrator</p>
          <p className="font-semibold text-white text-sm truncate">{adminName}</p>
          <p className="text-xs text-dusty-gray font-mono mt-0.5">{accountNumber}</p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-4 py-2">
        <p className="text-xs font-semibold text-dusty-gray uppercase tracking-widest mb-3 px-2">Console Operations</p>
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium
                transition-all duration-200 group
                ${active
                  ? 'bg-flamingo text-white shadow-lg shadow-orange-500/20'
                  : 'text-dusty-gray/80 hover:bg-mine-shaft/90 hover:text-white'
                }
              `}
            >
              <item.icon size={18} className={active ? 'text-white' : 'text-dusty-gray group-hover:text-flamingo/80'} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t border-dusty-gray/30">
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-950 hover:text-red-300 transition-all duration-200 disabled:opacity-60"
        >
          <LogOut size={18} />
          {signingOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen bg-whisper overflow-hidden font-body">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-mine-shaft/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-50 flex">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-dusty-gray/30 flex items-center justify-between px-6 shrink-0">
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors text-dusty-gray"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          <div className="lg:hidden flex items-center gap-2">
            <ShieldCheck className="text-flamingo" size={20} />
            <span className="font-display font-bold text-mine-shaft">Admin Console</span>
          </div>
          <div className="hidden lg:flex items-center gap-2">
             <span className="bg-rose-bud/20 text-spicy-mix text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">Live System</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-mine-shaft rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">
                {adminName?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-whisper">
          {children}
        </main>
      </div>
    </div>
  )
}
