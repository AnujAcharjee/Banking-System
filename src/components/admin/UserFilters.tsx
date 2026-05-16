'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { useTransition } from 'react'

export function UserFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('search', term)
    } else {
      params.delete('search')
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`)
    })
  }

  const handleStatus = (status: string) => {
    const params = new URLSearchParams(searchParams)
    if (status && status !== 'all') {
      params.set('status', status)
    } else {
      params.delete('status')
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className="bg-white p-4 rounded-2xl border border-dusty-gray/30 shadow-sm flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-dusty-gray/80">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search by Name, Account Number, or Phone..."
          defaultValue={searchParams.get('search') || ''}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-whisper border border-dusty-gray/30 rounded-xl focus:ring-2 focus:ring-flamingo focus:border-transparent transition-all outline-none text-slate-700 placeholder-slate-400"
        />
      </div>
      
      <div className="w-full md:w-48 shrink-0">
        <select
          defaultValue={searchParams.get('status') || 'all'}
          onChange={(e) => handleStatus(e.target.value)}
          className="w-full px-4 py-2 bg-whisper border border-dusty-gray/30 rounded-xl focus:ring-2 focus:ring-flamingo focus:border-transparent transition-all outline-none text-slate-700"
        >
          <option value="all">All Accounts</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {isPending && <div className="hidden md:flex items-center text-sm text-dusty-gray/80 animate-pulse">Updating...</div>}
    </div>
  )
}
