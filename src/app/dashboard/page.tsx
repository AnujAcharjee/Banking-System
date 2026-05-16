'use client'
import { Suspense } from 'react'
import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  ArrowDownLeft, ArrowUpRight, ArrowLeftRight, TrendingUp,
  Eye, EyeOff, Copy, Check, X, IndianRupee, RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { TxBadge, txAmountClass, txSign } from '@/components/ui/TxBadge'
import { User, Transaction } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'

type ModalType = 'credit' | 'debit' | 'transfer' | null

function DashboardInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [copied, setCopied] = useState(false)
  const [modal, setModal] = useState<ModalType>(null)
  const [txLoading, setTxLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [toAccount, setToAccount] = useState('')
  const [txError, setTxError] = useState('')

  const fetchData = useCallback(async () => {
    try {
      const [userRes, txRes] = await Promise.all([
        fetch('/api/account/details', { cache: 'no-store' }),
        fetch('/api/transactions/history?limit=5', { cache: 'no-store' }),
      ])
      if (userRes.status === 401) { router.push('/auth/signin'); return }
      const userData = await userRes.json()
      const txData = await txRes.json()
      if (userData.success) setUser(userData.user)
      if (txData.success) setTransactions(txData.transactions)
    } catch {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    const action = searchParams.get('action')
    if (action === 'credit' || action === 'debit' || action === 'transfer') {
      setModal(action as ModalType)
    }
  }, [searchParams])

  const copyAccountNumber = () => {
    if (!user) return
    navigator.clipboard.writeText(user.accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Account number copied!')
  }

  const openModal = (type: ModalType) => {
    setModal(type)
    setAmount('')
    setDescription('')
    setToAccount('')
    setTxError('')
  }

  const closeModal = () => {
    setModal(null)
    router.replace('/dashboard')
  }

  const handleTransaction = async () => {
    const amtNum = parseFloat(amount)
    if (!amount || isNaN(amtNum) || amtNum <= 0) {
      setTxError('Please enter a valid amount greater than 0')
      return
    }
    if (modal === 'transfer' && !toAccount.trim()) {
      setTxError('Please enter the recipient account number')
      return
    }
    setTxLoading(true)
    setTxError('')
    try {
      const endpoint = `/api/transactions/${modal}`
      const body: Record<string, unknown> = { amount: amtNum, description: description || undefined }
      if (modal === 'transfer') body.toAccountNumber = toAccount.trim().toUpperCase()

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setTxError(data.error || 'Transaction failed')
      } else {
        const msg = modal === 'credit' ? `Credited ${formatCurrency(amtNum)} successfully!`
          : modal === 'debit' ? `Withdrawn ${formatCurrency(amtNum)} successfully!`
          : data.message
        toast.success(msg)
        closeModal()
        fetchData()
      }
    } catch {
      setTxError('Network error. Please try again.')
    } finally {
      setTxLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
          <div className="h-52 bg-rose-bud/40 rounded-2xl shimmer" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-28 bg-rose-bud/20 rounded-2xl shimmer" />)}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-rose-bud/10 rounded-2xl shimmer" />)}
          </div>
          <div className="h-64 bg-rose-bud/10 rounded-2xl shimmer" />
        </div>
      </DashboardLayout>
    )
  }

  const totalCredit = transactions.filter(t => t.type === 'CREDIT' || t.type === 'TRANSFER_IN').reduce((s, t) => s + t.amount, 0)
  const totalDebit  = transactions.filter(t => t.type === 'DEBIT'  || t.type === 'TRANSFER_OUT').reduce((s, t) => s + t.amount, 0)

  const stats = [
    { label: 'Received (recent)',      value: formatCurrency(totalCredit),   icon: ArrowDownLeft,  color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Spent (recent)',         value: formatCurrency(totalDebit),    icon: ArrowUpRight,   color: 'text-red-500',   bg: 'bg-red-50'   },
    { label: 'Recent Transactions',   value: String(transactions.length),   icon: TrendingUp,     color: 'text-flamingo',bg: 'bg-rose-bud/10'},
  ]

  const modalCfg = {
    credit:   { title: 'Add Money',      subtitle: 'Credit to your account',              color: 'text-green-600', btnLabel: 'Credit Now'    },
    debit:    { title: 'Withdraw Money', subtitle: 'Debit from your account',             color: 'text-red-600',   btnLabel: 'Withdraw'      },
    transfer: { title: 'Transfer Money', subtitle: 'Transfer to another NovaBank account', color: 'text-blue-600',  btnLabel: 'Transfer Now'  },
  }

  return (
    <DashboardLayout userName={user?.fullName} accountNumber={user?.accountNumber}>
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">

        {/* Balance Card */}
        <div className="flamingo-gradient rounded-2xl p-6 md:p-8 shadow-glow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-36 translate-x-36 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-52 h-52 bg-white/5 rounded-full translate-y-28 -translate-x-28 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-2">Available Balance</p>
                <div className="flex items-center gap-3">
                  <p className="text-white font-display text-4xl md:text-5xl font-bold leading-none">
                    {balanceVisible ? formatCurrency(user?.account.balance ?? 0) : '₹ ••••••'}
                  </p>
                  <button onClick={() => setBalanceVisible(!balanceVisible)} className="text-white/80 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg">
                    {balanceVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <button onClick={() => { setLoading(true); fetchData() }} className="text-white/80 hover:text-white transition-all p-2 hover:bg-white/10 rounded-xl active:scale-90" title="Refresh">
                <RefreshCw size={18} />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={copyAccountNumber} className="bg-white/10 hover:bg-white/20 transition-colors rounded-xl px-4 py-2.5 flex items-center gap-2">
                <span className="text-white/60 text-xs font-medium">Account:</span>
                <span className="text-white font-mono font-semibold text-sm tracking-wider">{user?.accountNumber}</span>
                <span className="text-white/80">{copied ? <Check size={14} /> : <Copy size={14} />}</span>
              </button>
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${user?.account.isActive ? 'bg-green-400/20 text-green-200' : 'bg-red-400/20 text-red-200'}`}>
                {user?.account.isActive ? '● Active' : '● Inactive'}
              </span>
            </div>
            {user?.fullName && (
              <p className="mt-4 text-white/80 text-sm">Welcome back, <span className="text-white font-semibold">{user.fullName}</span></p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { type: 'credit'   as ModalType, label: 'Add Money', icon: ArrowDownLeft,  bg: 'bg-green-50 hover:bg-green-100 border-green-100 hover:border-green-200', ic: 'text-green-600', tc: 'text-green-700' },
            { type: 'debit'    as ModalType, label: 'Withdraw',  icon: ArrowUpRight,   bg: 'bg-red-50 hover:bg-red-100 border-red-100 hover:border-red-200',         ic: 'text-red-500',   tc: 'text-red-700'   },
            { type: 'transfer' as ModalType, label: 'Transfer',  icon: ArrowLeftRight, bg: 'bg-blue-50 hover:bg-blue-100 border-blue-100 hover:border-blue-200',      ic: 'text-blue-600',  tc: 'text-blue-700'  },
          ].map((a) => (
            <button key={a.type!} onClick={() => openModal(a.type)}
              className={`${a.bg} border rounded-2xl p-4 md:p-6 flex flex-col items-center transition-all duration-200 hover:shadow-card hover:-translate-y-1 active:translate-y-0 group`}>
              <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm group-hover:shadow-md transition-shadow">
                <a.icon size={20} className={a.ic} />
              </div>
              <p className={`font-semibold text-sm ${a.tc}`}>{a.label}</p>
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          {stats.map((s) => (
            <Card key={s.label} padding="md">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center shrink-0`}>
                  <s.icon size={18} className={s.color} />
                </div>
                <div>
                  <p className="text-xs text-dusty-gray font-medium">{s.label}</p>
                  <p className={`font-bold text-lg ${s.color}`}>{s.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Transactions */}
        <Card padding="none">
          <div className="p-5 md:p-6 border-b border-dusty-gray/10 flex items-center justify-between">
            <h2 className="font-semibold text-mine-shaft text-lg">Recent Transactions</h2>
            <button onClick={() => router.push('/passbook')} className="text-flamingo text-sm font-medium hover:text-spicy-mix transition-colors">View All →</button>
          </div>
          {transactions.length === 0 ? (
            <div className="py-16 text-center">
              <IndianRupee size={44} className="text-rose-bud mx-auto mb-3" />
              <p className="text-dusty-gray font-medium">No transactions yet</p>
              <p className="text-dusty-gray/80 text-sm mt-1">Credit your account to get started</p>
              <button onClick={() => openModal('credit')} className="mt-4 text-flamingo text-sm font-semibold hover:text-spicy-mix transition-colors">+ Add Money</button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-4 md:p-5 flex items-center gap-4 hover:bg-rose-bud/10/40 transition-colors group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${tx.type === 'CREDIT' || tx.type === 'TRANSFER_IN' ? 'bg-green-50' : tx.type === 'DEBIT' ? 'bg-red-50' : 'bg-purple-50'}`}>
                    {tx.type === 'CREDIT' || tx.type === 'TRANSFER_IN' ? <ArrowDownLeft size={18} className="text-green-600" />
                      : tx.type === 'DEBIT' ? <ArrowUpRight size={18} className="text-red-500" />
                      : <ArrowLeftRight size={18} className="text-purple-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-mine-shaft text-sm truncate">{tx.description || tx.type.replace('_', ' ')}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <TxBadge type={tx.type} />
                      <span className="text-xs text-dusty-gray/80">{formatDate(tx.createdAt)}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-bold text-base ${txAmountClass(tx.type)}`}>{txSign(tx.type)}{formatCurrency(tx.amount)}</p>
                    <p className="text-xs text-dusty-gray/80 mt-0.5">Bal: {formatCurrency(tx.balanceAfter)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Transaction Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative z-10 bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full max-w-md p-6 animate-slide-up">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className={`font-display font-bold text-xl ${modalCfg[modal].color}`}>{modalCfg[modal].title}</h3>
                <p className="text-dusty-gray text-sm mt-0.5">{modalCfg[modal].subtitle}</p>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-dusty-gray/80 hover:text-dusty-gray"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              {modal === 'transfer' && (
                <Input label="Recipient Account Number" placeholder="NOVA12345678"
                  value={toAccount} onChange={(e) => { setToAccount(e.target.value.toUpperCase()); setTxError('') }}
                  icon={<ArrowLeftRight size={16} />} hint="Must be a valid NovaBank account" />
              )}

              <div>
                <label className="block text-sm font-medium text-dusty-gray mb-1.5">Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dusty-gray/80 font-bold text-lg pointer-events-none">₹</span>
                  <input type="number" placeholder="0.00" value={amount}
                    onChange={(e) => { setAmount(e.target.value); setTxError('') }}
                    min="1" step="0.01"
                    className="w-full pl-9 pr-4 py-3.5 rounded-xl border border-rose-bud/50 hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-flamingo focus:border-transparent transition-all text-xl font-bold text-mine-shaft" />
                </div>
              </div>

              <Input label="Description (optional)" placeholder="e.g. Salary, Rent, Coffee..."
                value={description} onChange={(e) => setDescription(e.target.value)} />

              <div>
                <p className="text-xs text-dusty-gray/80 mb-2 font-medium uppercase tracking-wider">Quick amounts</p>
                <div className="flex gap-2 flex-wrap">
                  {[100, 500, 1000, 5000, 10000].map(a => (
                    <button key={a} type="button" onClick={() => setAmount(a.toString())}
                      className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all active:scale-95 ${amount === a.toString() ? 'flamingo-gradient text-white border-transparent shadow-sm' : 'border-orange-100 text-flamingo hover:bg-rose-bud/10 hover:border-rose-bud/50'}`}>
                      ₹{a >= 1000 ? `${a/1000}K` : a}
                    </button>
                  ))}
                </div>
              </div>

              {txError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                  <X size={14} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{txError}</p>
                </div>
              )}

              {modal === 'debit' && user && (
                <div className="bg-rose-bud/10 border border-orange-100 rounded-xl p-3">
                  <p className="text-spicy-mix text-sm">Available: <strong>{formatCurrency(user.account.balance)}</strong></p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button variant="secondary" size="lg" onClick={closeModal} className="flex-1">Cancel</Button>
                <Button size="lg" loading={txLoading} onClick={handleTransaction} className="flex-1">
                  {modalCfg[modal].btnLabel}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
          <div className="h-52 bg-rose-bud/40 rounded-2xl shimmer" />
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-28 bg-rose-bud/20 rounded-2xl shimmer" />)}
          </div>
        </div>
      </DashboardLayout>
    }>
      <DashboardInner />
    </Suspense>
  )
}
