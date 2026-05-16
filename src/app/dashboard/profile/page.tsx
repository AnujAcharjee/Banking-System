'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Phone, MapPin, CreditCard, Calendar, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { User as UserType } from '@/types'
import { formatDate, formatCurrency } from '@/lib/utils'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/account/details')
      .then(res => {
        if (res.status === 401) { router.push('/auth/signin'); return null }
        return res.json()
      })
      .then(data => { if (data?.success) setUser(data.user) })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [router])

  const fields = user ? [
    { icon: User, label: 'Full Name', value: user.fullName },
    { icon: Phone, label: 'Phone', value: user.phone },
    { icon: MapPin, label: 'Address', value: user.address },
    { icon: CreditCard, label: 'PAN Number', value: user.panNumber },
    { icon: Shield, label: 'Aadhaar', value: `XXXX XXXX ${user.aadhaarNumber.slice(-4)}` },
    { icon: Calendar, label: 'Member Since', value: formatDate(user.createdAt) },
  ] : []

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse max-w-2xl mx-auto">
          <div className="h-32 bg-rose-bud/20 rounded-2xl shimmer" />
          <div className="h-64 bg-rose-bud/10 rounded-2xl shimmer" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userName={user?.fullName} accountNumber={user?.accountNumber}>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="font-display text-2xl font-bold text-mine-shaft">My Profile</h1>
          <p className="text-dusty-gray text-sm mt-1">Your personal and account information</p>
        </div>

        {/* Account banner */}
        <div className="flamingo-gradient rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-24 translate-x-24" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold">
              {user?.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-rose-bud text-xs uppercase tracking-wider">Account Holder</p>
              <p className="text-white font-display font-bold text-2xl">{user?.fullName}</p>
              <p className="text-rose-bud font-mono text-sm mt-1">{user?.accountNumber}</p>
            </div>
          </div>
          <div className="relative z-10 mt-4 flex gap-4">
            <div className="bg-white/10 rounded-xl px-4 py-2.5">
              <p className="text-rose-bud text-xs">Balance</p>
              <p className="text-white font-bold">{formatCurrency(user?.account.balance ?? 0)}</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-2.5">
              <p className="text-rose-bud text-xs">Status</p>
              <p className="text-white font-bold">{user?.account.isActive ? 'Active' : 'Inactive'}</p>
            </div>
          </div>
        </div>

        {/* Profile fields */}
        <Card padding="none">
          <div className="p-5 border-b border-dusty-gray/10">
            <h2 className="font-semibold text-mine-shaft">Personal Details</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {fields.map((f) => (
              <div key={f.label} className="flex items-start gap-4 p-5">
                <div className="w-9 h-9 bg-rose-bud/10 rounded-xl flex items-center justify-center shrink-0">
                  <f.icon size={16} className="text-flamingo" />
                </div>
                <div>
                  <p className="text-xs text-dusty-gray mb-0.5">{f.label}</p>
                  <p className="font-medium text-mine-shaft">{f.value}</p>
                </div>
              </div>
            ))}
            {user?.email && (
              <div className="flex items-start gap-4 p-5">
                <div className="w-9 h-9 bg-rose-bud/10 rounded-xl flex items-center justify-center shrink-0">
                  <User size={16} className="text-flamingo" />
                </div>
                <div>
                  <p className="text-xs text-dusty-gray mb-0.5">Email</p>
                  <p className="font-medium text-mine-shaft">{user.email}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-700">
          <p className="font-medium mb-1">⚠ Profile updates</p>
          <p>To update your KYC details, please visit a NovaBank branch with valid documents.</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
