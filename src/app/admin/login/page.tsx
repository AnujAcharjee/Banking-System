'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock, CreditCard, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ adminId: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.adminId.trim()) e.adminId = 'Admin ID is required'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await fetch('/api/auth/admin-signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: form.adminId.trim().toUpperCase(),
          password: form.password,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Sign in failed')
        if (data.error?.toLowerCase().includes('credentials')) {
          setErrors({ password: 'Invalid Admin ID or password' })
        }
      } else {
        toast.success(`Welcome back, Admin ${data.user.fullName.split(' ')[0]}!`)
        router.push('/admin')
        router.refresh()
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex font-body bg-mine-shaft text-white">
      {/* Left — decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-mine-shaft relative overflow-hidden flex-col justify-between p-12 border-r border-dusty-gray/30">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />
        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-10 h-10 bg-mine-shaft/90 rounded-xl flex items-center justify-center border border-dusty-gray/20">
            <ShieldCheck className="text-flamingo" size={24} />
          </div>
          <span className="font-display font-bold text-2xl">NovaBank <span className="text-dusty-gray/80 font-normal">Admin</span></span>
        </Link>

        <div className="relative z-10">
          <h2 className="font-display text-5xl font-bold leading-tight mb-6">
            Secure Admin<br />Portal
          </h2>
          <p className="text-dusty-gray/80 text-lg leading-relaxed max-w-sm">
            Authorized personnel only. Monitor transactions, manage users, and oversee the banking ecosystem.
          </p>
        </div>

        <p className="text-dusty-gray text-sm relative z-10">© 2024 NovaBank Operations. Internal Use Only.</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-mine-shaft">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-mine-shaft/90 border border-dusty-gray/20 rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-flamingo" size={18} />
            </div>
            <span className="font-display font-bold text-xl text-white">NovaBank Admin</span>
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-white mb-2">Admin Sign In</h1>
            <p className="text-dusty-gray/80">Enter your credentials to access the console</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-dusty-gray/60">Admin ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-dusty-gray">
                  <CreditCard size={16} />
                </div>
                <input
                  type="text"
                  placeholder="ADMIN_001"
                  value={form.adminId}
                  onChange={(e) => setForm({ ...form, adminId: e.target.value.toUpperCase() })}
                  className="w-full pl-10 pr-4 py-2.5 bg-mine-shaft/90 border border-dusty-gray/20 rounded-xl focus:ring-2 focus:ring-flamingo focus:border-transparent transition-all outline-none text-white placeholder-slate-500"
                  autoComplete="username"
                />
              </div>
              {errors.adminId && <p className="text-red-400 text-sm mt-1">{errors.adminId}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-dusty-gray/60">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-dusty-gray">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-2.5 bg-mine-shaft/90 border border-dusty-gray/20 rounded-xl focus:ring-2 focus:ring-flamingo focus:border-transparent transition-all outline-none text-white placeholder-slate-500"
                  autoComplete="current-password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-dusty-gray hover:text-flamingo transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              loading={loading}
              size="lg"
              className="w-full mt-4"
              icon={<ArrowRight size={18} />}
            >
              Sign In to Console
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
