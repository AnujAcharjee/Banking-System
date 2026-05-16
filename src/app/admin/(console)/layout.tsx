import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminLayout } from '@/components/layout/AdminLayout'

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authUser = await getAuthUser()

  if (!authUser || authUser.type !== 'ADMIN') {
    redirect('/admin/login')
  }

  const admin = await prisma.admin.findUnique({
    where: { id: authUser.userId },
    select: { fullName: true, adminId: true },
  })

  return (
    <AdminLayout adminName={admin?.fullName} accountNumber={admin?.adminId}>
      {children}
    </AdminLayout>
  )
}
