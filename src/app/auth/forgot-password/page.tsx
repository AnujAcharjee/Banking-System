'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CreditCard, Phone, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

type Step = 'request' | 'verify' | 'reset' | 'done'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('request')
  const [loading, setLoading] = useState(false)
  const [devOtp, setDevOtp] = useState<string>('')
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({
    accountNumber: '', phone: '',
    otp: '',
    newPassword: '', confirmPassword: '',
  })
  const [errors, setErrors] = useState<typeof form>({
    accountNumber: '', phone: '', otp: '', newPassword: '', confirmPassword: '',
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value })

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = { ...errors }
    if (!form.accountNumber.trim()) errs.accountNumber = 'Required'
    if (!form.phone.trim()) errs.phone = 'Required'
    else if (!/^\d{10}$/.test(form.phone)) errs.phone = '10 digits only'
    setErrors(errs)
    if (Object.values(errs).some(Boolean)) return

    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountNumber: form.accountNumber.toUpperCase(), phone: form.phone }),
      })
      const data = await res.json()
      if (data.devOtp) setDevOtp(data.devOtp)
      toast.success('OTP sent (check console in dev mode)')
      setStep('verify')
    } catch {
      toast.error('Failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = { ...errors }
    if (!form.otp || form.otp.length !== 6) errs.otp = '6-digit OTP required'
    if (!form.newPassword || form.newPassword.length < 8) errs.newPassword = 'Min. 8 characters'
    if (form.newPassword !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    setErrors(errs)
    if (errs.otp || errs.newPassword || errs.confirmPassword) return

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountNumber: form.accountNumber.toUpperCase(), otp: form.otp, newPassword: form.newPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Reset failed')
        if (data.error?.includes('OTP')) setErrors({ ...errors, otp: data.error })
      } else {
        setStep('done')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'done') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffbf7] p-6">
        <div className="max-w-md w-full text-center animate-slide-up">
          <div className="w-20 h-20 flamingo-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
            <CheckCircle size={40} className="text-white" />
          </div>
          <h2 className="font-display text-3xl font-bold text-mine-shaft mb-3">Password Reset!</h2>
          <p className="text-dusty-gray mb-8">Your password has been updated. Sign in with your new password.</p>
          <Button size="lg" className="w-full" onClick={() => router.push('/auth/signin')}>
            Go to Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffbf7] p-6 font-body">
      <div className="w-full max-w-md animate-fade-in">
        <Link href="/auth/signin" className="inline-flex items-center gap-2 text-dusty-gray hover:text-flamingo transition-colors mb-8 text-sm">
          <ArrowLeft size={16} />
          Back to Sign In
        </Link>

        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 flamingo-gradient rounded-xl flex items-center justify-center shadow-glow">
            <span className="text-white font-bold">N</span>
          </div>
          <span className="font-display font-bold text-xl text-mine-shaft">NovaBank</span>
        </div>

        <h1 className="font-display text-3xl font-bold text-mine-shaft mb-2">Forgot Password</h1>
        <p className="text-dusty-gray mb-8">
          {step === 'request' ? "Enter your account number and phone to receive an OTP." : "Enter the OTP and set a new password."}
        </p>

        {/* Step progress */}
        <div className="flex gap-2 mb-8">
          {['Verify Identity', 'Reset Password'].map((s, i) => (
            <div key={s} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${(step === 'verify' && i === 0) || step === 'verify' || (step !== 'request' && i === 0) ? 'bg-flamingo' : 'bg-rose-bud/20'} ${step !== 'request' && i === 1 ? 'bg-flamingo' : ''}`} />
          ))}
        </div>

        {step === 'request' && (
          <form onSubmit={handleRequest} className="space-y-5">
            <Input
              label="Account Number"
              placeholder="NOVA12345678"
              value={form.accountNumber}
              onChange={(e) => setForm({ ...form, accountNumber: e.target.value.toUpperCase() })}
              error={errors.accountNumber}
              icon={<CreditCard size={16} />}
            />
            <Input
              label="Registered Phone Number"
              placeholder="9876543210"
              value={form.phone}
              onChange={set('phone')}
              error={errors.phone}
              icon={<Phone size={16} />}
              maxLength={10}
            />
            <Button type="submit" size="lg" loading={loading} className="w-full">
              Send OTP
            </Button>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={handleVerifyAndReset} className="space-y-5">
            {devOtp && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-amber-700 text-sm font-medium">🛠 Dev Mode OTP:</p>
                <p className="font-mono text-2xl font-bold text-amber-800 mt-1 tracking-widest">{devOtp}</p>
              </div>
            )}
            <Input
              label="OTP"
              placeholder="123456"
              value={form.otp}
              onChange={(e) => setForm({ ...form, otp: e.target.value.replace(/\D/g, '') })}
              error={errors.otp}
              maxLength={6}
              hint="6-digit OTP sent to your phone"
            />
            <Input
              label="New Password"
              type={showPass ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              value={form.newPassword}
              onChange={set('newPassword')}
              error={errors.newPassword}
              icon={<Lock size={16} />}
              suffix={
                <button type="button" onClick={() => setShowPass(!showPass)} className="hover:text-flamingo transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Re-enter password"
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
              error={errors.confirmPassword}
              icon={<Lock size={16} />}
            />
            <Button type="submit" size="lg" loading={loading} className="w-full">
              Reset Password
            </Button>
            <button
              type="button"
              onClick={() => setStep('request')}
              className="w-full text-sm text-dusty-gray hover:text-flamingo transition-colors"
            >
              Resend OTP
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
