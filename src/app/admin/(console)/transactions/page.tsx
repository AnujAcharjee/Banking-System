import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate } from '@/lib/utils'
import { TxBadge } from '@/components/ui/TxBadge'

export default async function AdminTransactionsPage() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { fullName: true, accountNumber: true } }
    }
  })

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-mine-shaft">Transaction Ledger</h1>
        <p className="text-dusty-gray mt-1">Global view of all transactions across the platform.</p>
      </div>

      <div className="bg-white rounded-2xl border border-dusty-gray/30 overflow-hidden shadow-sm">
        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-dusty-gray">
              <thead className="bg-whisper text-dusty-gray text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Reference</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dusty-gray/10">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-whisper transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-dusty-gray/80">{tx.referenceNumber}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-mine-shaft">{tx.user?.fullName || 'System'}</p>
                      <p className="text-xs text-dusty-gray">{tx.user?.accountNumber}</p>
                    </td>
                    <td className="px-6 py-4">
                      <TxBadge type={tx.type} />
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {tx.description || <span className="text-dusty-gray/60 italic">No description</span>}
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
          <div className="p-12 text-center">
            <p className="text-dusty-gray">No transactions recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
