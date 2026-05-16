'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock, CreditCard, Eye, EyeOff, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function SignInPage() {
  const router = useRouter()
  const [form, setForm] = useState({ accountNumber: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.accountNumber.trim()) e.accountNumber = 'Account number is required'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountNumber: form.accountNumber.trim().toUpperCase(),
          password: form.password,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Sign in failed')
        if (data.error?.toLowerCase().includes('credentials')) {
          setErrors({ password: 'Invalid account number or password' })
        }
      } else {
        toast.success(`Welcome back, ${data.user.fullName.split(' ')[0]}!`)
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex font-body">
      {/* Left — decorative */}
      <div className="hidden lg:flex lg:w-1/2 flamingo-gradient relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />
        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <span className="text-white font-display font-bold text-2xl">NovaBank</span>
        </Link>

        <div className="relative z-10">
          <h2 className="text-white font-display text-5xl font-bold leading-tight mb-6">
            Good to see<br />you again
          </h2>
          <p className="text-rose-bud/50 text-lg leading-relaxed max-w-sm">
            Access your account, check your balance, and manage your money — all in one place.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              { label: 'Secure Login', value: 'JWT Auth' },
              { label: 'Uptime', value: '99.9%' },
              { label: 'Transactions', value: 'Instant' },
              { label: 'Support', value: '24/7' },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl p-4">
                <p className="text-rose-bud text-xs">{s.label}</p>
                <p className="text-white font-bold text-lg mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-rose-bud text-sm relative z-10">© 2024 NovaBank. All rights reserved.</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#fffbf7]">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 flamingo-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
            <span className="font-display font-bold text-xl text-mine-shaft">NovaBank</span>
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-mine-shaft mb-2">Sign In</h1>
            <p className="text-dusty-gray">Enter your account number and password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Account Number"
              placeholder="NOVA12345678"
              value={form.accountNumber}
              onChange={(e) => setForm({ ...form, accountNumber: e.target.value.toUpperCase() })}
              error={errors.accountNumber}
              icon={<CreditCard size={16} />}
              autoComplete="username"
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password}
              icon={<Lock size={16} />}
              suffix={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-flamingo transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              autoComplete="current-password"
            />

            <div className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-flamingo hover:text-spicy-mix font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              loading={loading}
              size="lg"
              className="w-full"
              icon={<ArrowRight size={18} />}
            >
              Sign In
            </Button>
          </form>

          <p className="mt-8 text-center text-dusty-gray text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-flamingo font-semibold hover:text-spicy-mix transition-colors">
              Open one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
