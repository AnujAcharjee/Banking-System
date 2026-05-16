import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/Card'
import { Users, DollarSign, Activity } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { TxBadge } from '@/components/ui/TxBadge'

export default async function AdminDashboardPage() {
  const [totalUsers, totalTransactions, sumResult, recentTxs] = await Promise.all([
    prisma.user.count(),
    prisma.transaction.count(),
    prisma.account.aggregate({ _sum: { balance: true } }),
    prisma.transaction.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { fullName: true, accountNumber: true } }
      }
    })
  ])

  const totalMoney = sumResult._sum.balance || 0

  const stats = [
    { label: 'Total Customers', value: totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-100' },
    { label: 'Total Bank Holdings', value: formatCurrency(totalMoney), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total Tx Volume', value: totalTransactions, icon: Activity, color: 'text-flamingo', bg: 'bg-rose-bud/20' },
  ]

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-mine-shaft">Platform Overview</h1>
        <p className="text-dusty-gray mt-1">High-level metrics across the entire NovaBank system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <Card key={i} className="p-6 flex items-start gap-4 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
              <s.icon size={24} className={s.color} />
            </div>
            <div>
              <p className="text-sm font-medium text-dusty-gray">{s.label}</p>
              <p className="text-2xl font-bold text-mine-shaft mt-1">{s.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="font-display text-xl font-bold text-mine-shaft mb-4">Latest System Activity</h2>
        <div className="bg-white rounded-2xl border border-dusty-gray/30 overflow-hidden shadow-sm">
          {recentTxs.length > 0 ? (
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm text-dusty-gray">
                 <thead className="bg-whisper text-dusty-gray text-xs uppercase font-semibold">
                   <tr>
                     <th className="px-6 py-4">Ref</th>
                     <th className="px-6 py-4">Customer</th>
                     <th className="px-6 py-4">Type</th>
                     <th className="px-6 py-4 text-right">Amount</th>
                     <th className="px-6 py-4 text-right">Date</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-dusty-gray/10">
                   {recentTxs.map((tx) => (
                     <tr key={tx.id} className="hover:bg-whisper transition-colors">
                       <td className="px-6 py-4 font-mono text-xs text-dusty-gray/80">{tx.referenceNumber}</td>
                       <td className="px-6 py-4">
                         <p className="font-medium text-mine-shaft">{tx.user?.fullName || 'System'}</p>
                         <p className="text-xs text-dusty-gray">{tx.user?.accountNumber}</p>
                       </td>
                       <td className="px-6 py-4">
                         <TxBadge type={tx.type} />
                       </td>
                       <td className="px-6 py-4 text-right font-medium text-mine-shaft">
                         {formatCurrency(tx.amount)}
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
            <div className="p-8 text-center text-dusty-gray">
              No transactions recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
