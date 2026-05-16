'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowDownLeft, ArrowUpRight, Search, Filter,
  ChevronLeft, ChevronRight, Download, BookOpen
} from 'lucide-react'
import toast from 'react-hot-toast'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { TxBadge, txAmountClass, txSign } from '@/components/ui/TxBadge'
import { Transaction, PaginationMeta, TransactionType } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'

const TYPE_FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'Credits', value: 'CREDIT' },
  { label: 'Debits', value: 'DEBIT' },
  { label: 'Transfer In', value: 'TRANSFER_IN' },
  { label: 'Transfer Out', value: 'TRANSFER_OUT' },
]

export default function PassbookPage() {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [pagination, setPagination] = useState<PaginationMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [typeFilter, setTypeFilter] = useState('')
  const [search, setSearch] = useState('')

  const fetchUser = useCallback(async () => {
    const res = await fetch('/api/account/details')
    if (res.status === 401) { router.push('/auth/signin'); return }
    const data = await res.json()
    if (data.success) {
      setUserName(data.user.fullName)
      setAccountNumber(data.user.accountNumber)
    }
  }, [router])

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: '10' })
      if (typeFilter) params.set('type', typeFilter)
      const res = await fetch(`/api/transactions/history?${params}`)
      if (res.status === 401) { router.push('/auth/signin'); return }
      const data = await res.json()
      if (data.success) {
        setTransactions(data.transactions)
        setPagination(data.pagination)
      }
    } catch {
      toast.error('Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }, [page, typeFilter, router])

  useEffect(() => { fetchUser() }, [fetchUser])
  useEffect(() => { fetchTransactions() }, [fetchTransactions])

  const filtered = search
    ? transactions.filter(t =>
        t.description?.toLowerCase().includes(search.toLowerCase()) ||
        t.referenceNumber.toLowerCase().includes(search.toLowerCase())
      )
    : transactions

  const totalCredit = transactions
    .filter(t => t.type === 'CREDIT' || t.type === 'TRANSFER_IN')
    .reduce((s, t) => s + t.amount, 0)
  const totalDebit = transactions
    .filter(t => t.type === 'DEBIT' || t.type === 'TRANSFER_OUT')
    .reduce((s, t) => s + t.amount, 0)

  return (
    <DashboardLayout userName={userName} accountNumber={accountNumber}>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-mine-shaft flex items-center gap-2">
              <BookOpen size={24} className="text-flamingo" />
              Passbook
            </h1>
            <p className="text-dusty-gray text-sm mt-1">Complete transaction history</p>
          </div>
          <button
            onClick={() => toast('Export coming soon', { icon: '📥' })}
            className="flex items-center gap-2 text-sm text-flamingo font-medium hover:text-spicy-mix transition-colors bg-rose-bud/10 hover:bg-rose-bud/20 px-4 py-2 rounded-xl border border-orange-100"
          >
            <Download size={15} />
            Export
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                <ArrowDownLeft size={16} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-dusty-gray">Total Received</p>
                <p className="font-bold text-green-600">{formatCurrency(totalCredit)}</p>
              </div>
            </div>
          </Card>
          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                <ArrowUpRight size={16} className="text-red-500" />
              </div>
              <div>
                <p className="text-xs text-dusty-gray">Total Spent</p>
                <p className="font-bold text-red-500">{formatCurrency(totalDebit)}</p>
              </div>
            </div>
          </Card>
          <Card padding="md" className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-rose-bud/10 rounded-xl flex items-center justify-center shrink-0">
                <Filter size={16} className="text-flamingo" />
              </div>
              <div>
                <p className="text-xs text-dusty-gray">Showing</p>
                <p className="font-bold text-flamingo">{pagination?.total ?? 0} entries</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card padding="md">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dusty-gray/80" />
              <input
                type="text"
                placeholder="Search by description or reference..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-rose-bud/50 hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-flamingo focus:border-transparent transition-all text-sm"
              />
            </div>

            {/* Type filter */}
            <div className="flex gap-2 flex-wrap">
              {TYPE_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => { setTypeFilter(f.value); setPage(1) }}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-150 ${typeFilter === f.value ? 'flamingo-gradient text-white border-transparent shadow-sm' : 'border-orange-100 text-dusty-gray hover:border-orange-300 hover:text-flamingo'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Transactions Table */}
        <Card padding="none">
          {/* Desktop header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-dusty-gray/10 text-xs font-semibold text-dusty-gray/80 uppercase tracking-wider">
            <div className="col-span-1">Type</div>
            <div className="col-span-4">Description</div>
            <div className="col-span-3">Reference</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>

          {loading ? (
            <div className="p-6 space-y-4">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-14 bg-rose-bud/10 rounded-xl shimmer" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <BookOpen size={48} className="text-rose-bud mx-auto mb-3" />
              <p className="text-dusty-gray font-medium">No transactions found</p>
              <p className="text-dusty-gray/80 text-sm mt-1">
                {search || typeFilter ? 'Try clearing your filters' : 'Your transaction history will appear here'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map((tx) => (
                <div key={tx.id} className="p-4 md:px-6 md:py-4 hover:bg-rose-bud/10/30 transition-colors">
                  {/* Mobile */}
                  <div className="md:hidden flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${tx.type === 'CREDIT' || tx.type === 'TRANSFER_IN' ? 'bg-green-50' : 'bg-red-50'}`}>
                      {tx.type === 'CREDIT' || tx.type === 'TRANSFER_IN'
                        ? <ArrowDownLeft size={16} className="text-green-600" />
                        : <ArrowUpRight size={16} className="text-red-500" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-mine-shaft text-sm truncate">{tx.description || tx.type}</p>
                        <p className={`font-bold shrink-0 ${txAmountClass(tx.type)}`}>
                          {txSign(tx.type)}{formatCurrency(tx.amount)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <TxBadge type={tx.type} />
                        <span className="text-xs text-dusty-gray/80">{formatDate(tx.createdAt)}</span>
                      </div>
                      <p className="text-xs text-dusty-gray/80 font-mono mt-1">{tx.referenceNumber}</p>
                    </div>
                  </div>

                  {/* Desktop */}
                  <div className="hidden md:grid grid-cols-12 gap-4 items-center text-sm">
                    <div className="col-span-1">
                      <TxBadge type={tx.type} />
                    </div>
                    <div className="col-span-4">
                      <p className="font-medium text-mine-shaft truncate">{tx.description || tx.type}</p>
                      <p className="text-xs text-dusty-gray/80 mt-0.5">Bal after: {formatCurrency(tx.balanceAfter)}</p>
                    </div>
                    <div className="col-span-3">
                      <p className="font-mono text-xs text-dusty-gray truncate">{tx.referenceNumber}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-dusty-gray text-xs">{formatDate(tx.createdAt)}</p>
                    </div>
                    <div className="col-span-2 text-right">
                      <p className={`font-bold ${txAmountClass(tx.type)}`}>
                        {txSign(tx.type)}{formatCurrency(tx.amount)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-dusty-gray/10 flex items-center justify-between">
              <p className="text-sm text-dusty-gray">
                Page {pagination.page} of {pagination.totalPages} · {pagination.total} entries
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="p-2 rounded-xl border border-orange-100 hover:bg-rose-bud/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} className="text-flamingo" />
                </button>
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="p-2 rounded-xl border border-orange-100 hover:bg-rose-bud/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} className="text-flamingo" />
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}
