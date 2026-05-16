import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'
import { UserFilters } from '@/components/admin/UserFilters'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default async function AdminUsersPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const search = typeof resolvedParams.search === 'string' ? resolvedParams.search : undefined
  const status = typeof resolvedParams.status === 'string' ? resolvedParams.status : undefined

  // Build Prisma where clause
  const whereClause: any = {}

  if (search) {
    whereClause.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { accountNumber: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (status === 'active') {
    whereClause.account = { isActive: true }
  } else if (status === 'inactive') {
    whereClause.account = { isActive: false }
  }

  const users = await prisma.user.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: { account: true }
  })

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-mine-shaft">All Customers</h1>
        <p className="text-dusty-gray mt-1">Manage, filter, and view details for all registered banking users.</p>
      </div>

      <UserFilters />

      <div className="bg-white rounded-2xl border border-dusty-gray/30 overflow-hidden shadow-sm">
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-dusty-gray">
              <thead className="bg-whisper text-dusty-gray text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Account No</th>
                  <th className="px-6 py-4">Customer Details</th>
                  <th className="px-6 py-4">KYC Info</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Current Balance</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dusty-gray/10">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-whisper transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-mine-shaft">{user.accountNumber}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-mine-shaft">{user.fullName}</p>
                      <p className="text-xs text-dusty-gray">{user.email || user.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <p>PAN: <span className="font-mono text-dusty-gray/80">{user.panNumber}</span></p>
                      <p>UID: <span className="font-mono text-dusty-gray/80">{user.aadhaarNumber}</span></p>
                    </td>
                    <td className="px-6 py-4">
                      {user.account?.isActive ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-mine-shaft">
                      {formatCurrency(user.account?.balance || 0)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link 
                        href={`/admin/users/${user.id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-bud/10 text-flamingo hover:bg-flamingo hover:text-white transition-colors"
                        title="View Details"
                      >
                        <ArrowRight size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-dusty-gray">No customers match your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
