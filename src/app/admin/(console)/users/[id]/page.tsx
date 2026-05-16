import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { formatCurrency, formatDate } from '@/lib/utils'
import { TxBadge } from '@/components/ui/TxBadge'
import { DeleteUserButton } from '@/components/admin/DeleteUserButton'
import Link from 'next/link'
import { ArrowLeft, User, Phone, MapPin, CreditCard, ShieldCheck, Activity } from 'lucide-react'

export default async function AdminUserDetailsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  
  const user = await prisma.user.findUnique({
    where: { id: resolvedParams.id },
    include: {
      account: true,
      transactions: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!user) {
    notFound()
  }

  const { account, transactions } = user

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/admin/users" 
          className="p-2 rounded-xl bg-white border border-dusty-gray/30 text-dusty-gray hover:text-mine-shaft hover:bg-whisper transition-colors shadow-sm"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-mine-shaft flex items-center gap-3">
            {user.fullName}
            {account?.isActive ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 uppercase tracking-wider">Active</span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 uppercase tracking-wider">Inactive</span>
            )}
          </h1>
          <p className="text-dusty-gray font-mono text-sm mt-0.5">Account: {user.accountNumber}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: KYC & Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-dusty-gray/30 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-dusty-gray/80 uppercase tracking-widest mb-4 flex items-center gap-2">
              <User size={16} /> Customer Details
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-dusty-gray/80 mb-0.5">Full Name</p>
                <p className="font-medium text-mine-shaft">{user.fullName}</p>
              </div>
              <div>
                <p className="text-dusty-gray/80 mb-0.5">Email Address</p>
                <p className="font-medium text-mine-shaft">{user.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-dusty-gray/80 mb-0.5">Phone Number</p>
                <p className="font-medium text-mine-shaft flex items-center gap-1.5"><Phone size={14} className="text-dusty-gray/80"/> {user.phone}</p>
              </div>
              <div>
                <p className="text-dusty-gray/80 mb-0.5">Residential Address</p>
                <p className="font-medium text-mine-shaft flex items-start gap-1.5"><MapPin size={14} className="text-dusty-gray/80 shrink-0 mt-0.5"/> {user.address}</p>
              </div>
              <div>
                <p className="text-dusty-gray/80 mb-0.5">Joined</p>
                <p className="font-medium text-mine-shaft">{formatDate(user.createdAt.toISOString())}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-dusty-gray/30 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-dusty-gray/80 uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldCheck size={16} /> KYC Documents
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-dusty-gray/80 mb-0.5">PAN Number</p>
                <p className="font-mono font-medium text-mine-shaft bg-whisper px-2 py-1 rounded inline-block border border-dusty-gray/10">{user.panNumber}</p>
              </div>
              <div>
                <p className="text-dusty-gray/80 mb-0.5">Aadhaar Number (UID)</p>
                <p className="font-mono font-medium text-mine-shaft bg-whisper px-2 py-1 rounded inline-block border border-dusty-gray/10">{user.aadhaarNumber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Balance & Transactions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-mine-shaft rounded-2xl border border-dusty-gray/30 p-6 shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-10">
               <CreditCard size={100} className="text-white" />
             </div>
             <div className="relative z-10">
               <p className="text-dusty-gray/80 font-medium mb-1">Current Balance</p>
               <h2 className="text-5xl font-display font-bold text-white tracking-tight">
                 {formatCurrency(account?.balance || 0)}
               </h2>
               <div className="mt-6 flex gap-3">
                 <DeleteUserButton userId={user.id} />
               </div>
             </div>
          </div>

          <div className="bg-white rounded-2xl border border-dusty-gray/30 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-dusty-gray/10 flex items-center justify-between">
              <h2 className="text-lg font-bold text-mine-shaft flex items-center gap-2">
                <Activity size={18} className="text-flamingo" /> Transaction Ledger
              </h2>
              <span className="text-sm text-dusty-gray">{transactions.length} records</span>
            </div>
            {transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-dusty-gray">
                  <thead className="bg-whisper text-dusty-gray text-xs uppercase font-semibold">
                    <tr>
                      <th className="px-6 py-4">Reference</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                      <th className="px-6 py-4 text-right">Closing Bal</th>
                      <th className="px-6 py-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dusty-gray/10">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-whisper transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-dusty-gray/80">
                          {tx.referenceNumber}
                          {tx.description && <p className="text-xs text-dusty-gray font-sans mt-0.5 max-w-[150px] truncate">{tx.description}</p>}
                        </td>
                        <td className="px-6 py-4">
                          <TxBadge type={tx.type} />
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-mine-shaft">
                          {formatCurrency(tx.amount)}
                        </td>
                        <td className="px-6 py-4 text-right text-dusty-gray text-xs">
                          {formatCurrency(tx.balanceAfter)}
                        </td>
                        <td className="px-6 py-4 text-right text-xs">
                          {formatDate(tx.createdAt.toISOString())}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-dusty-gray">This user has no transaction history.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
