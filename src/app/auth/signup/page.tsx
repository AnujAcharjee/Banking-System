'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  User, Phone, MapPin, CreditCard, Lock, Eye, EyeOff,
  ArrowRight, ArrowLeft, CheckCircle, Mail
} from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const STEPS = ['Personal Info', 'KYC Details', 'Set Password']

interface FormData {
  fullName: string
  email: string
  phone: string
  address: string
  panNumber: string
  aadhaarNumber: string
  password: string
  confirmPassword: string
}

export default function SignUpPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<{ accountNumber: string } | null>(null)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [form, setForm] = useState<FormData>({
    fullName: '', email: '', phone: '', address: '',
    panNumber: '', aadhaarNumber: '', password: '', confirmPassword: '',
  })

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value })

  const validateStep = (s: number) => {
    const e: Partial<FormData> = {}
    if (s === 0) {
      if (!form.fullName.trim()) e.fullName = 'Full name is required'
      if (!form.phone.trim()) e.phone = 'Phone number is required'
      else if (!/^\d{10}$/.test(form.phone)) e.phone = 'Must be 10 digits'
      if (!form.address.trim()) e.address = 'Address is required'
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email format'
    }
    if (s === 1) {
      if (!form.panNumber.trim()) e.panNumber = 'PAN number is required'
      else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.panNumber.toUpperCase())) e.panNumber = 'Invalid PAN (e.g. ABCDE1234F)'
      if (!form.aadhaarNumber.trim()) e.aadhaarNumber = 'Aadhaar is required'
      else if (!/^\d{12}$/.test(form.aadhaarNumber)) e.aadhaarNumber = 'Must be 12 digits'
    }
    if (s === 2) {
      if (!form.password) e.password = 'Password is required'
      else if (form.password.length < 8) e.password = 'At least 8 characters'
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => { if (validateStep(step)) setStep(step + 1) }
  const back = () => { setStep(step - 1); setErrors({}) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(2)) return
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim() || undefined,
          phone: form.phone.trim(),
          address: form.address.trim(),
          panNumber: form.panNumber.trim().toUpperCase(),
          aadhaarNumber: form.aadhaarNumber.trim(),
          password: form.password,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Registration failed')
      } else {
        setSuccess({ accountNumber: data.accountNumber })
      }
    } catch {
      toast.error('Network error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffbf7] p-6">
        <div className="max-w-md w-full text-center animate-slide-up">
          <div className="w-20 h-20 flamingo-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
            <CheckCircle size={40} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-mine-shaft mb-3">Account Created!</h1>
          <p className="text-dusty-gray mb-8">Your NovaBank account is ready. Save your account number below.</p>

          <div className="bg-rose-bud/10 border-2 border-rose-bud/50 rounded-2xl p-6 mb-8">
            <p className="text-flamingo text-sm font-medium mb-2">Your Account Number</p>
            <p className="font-mono text-3xl font-bold text-spicy-mix tracking-widest">{success.accountNumber}</p>
            <p className="text-flamingo text-xs mt-3">⚠ Save this — you'll need it to sign in</p>
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={() => router.push('/dashboard')}
            icon={<ArrowRight size={18} />}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex font-body">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 flamingo-gradient relative overflow-hidden flex-col justify-between p-12">
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
          <h2 className="text-white font-display text-4xl font-bold leading-tight mb-6">
            Open your account<br />in 2 minutes
          </h2>
          <div className="space-y-4">
            {STEPS.map((s, i) => (
              <div key={s} className={`flex items-center gap-3 transition-all duration-300 ${i <= step ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-300 ${i < step ? 'bg-white text-flamingo' : i === step ? 'bg-white/30 text-white ring-2 ring-white' : 'bg-white/10 text-white/60'}`}>
                  {i < step ? <CheckCircle size={16} /> : i + 1}
                </div>
                <span className={`font-medium ${i === step ? 'text-white' : 'text-rose-bud'}`}>{s}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-rose-bud text-sm relative z-10">© 2024 NovaBank</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#fffbf7] overflow-y-auto">
        <div className="w-full max-w-lg animate-fade-in">
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 flamingo-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
            <span className="font-display font-bold text-xl text-mine-shaft">NovaBank</span>
          </Link>

          {/* Step indicator — mobile */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-flamingo' : 'bg-rose-bud/20'}`} />
            ))}
          </div>

          <div className="mb-8">
            <p className="text-flamingo text-sm font-medium mb-1">Step {step + 1} of {STEPS.length}</p>
            <h1 className="font-display text-3xl font-bold text-mine-shaft">{STEPS[step]}</h1>
          </div>

          <form onSubmit={step < 2 ? (e) => { e.preventDefault(); next() } : handleSubmit} className="space-y-5">
            {/* Step 0 — Personal info */}
            {step === 0 && (
              <>
                <Input
                  label="Full Name *"
                  placeholder="Rajesh Kumar Sharma"
                  value={form.fullName}
                  onChange={set('fullName')}
                  error={errors.fullName}
                  icon={<User size={16} />}
                />
                <Input
                  label="Email (optional)"
                  type="email"
                  placeholder="raj@example.com"
                  value={form.email}
                  onChange={set('email')}
                  error={errors.email}
                  icon={<Mail size={16} />}
                />
                <Input
                  label="Phone Number *"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={set('phone')}
                  error={errors.phone}
                  icon={<Phone size={16} />}
                  maxLength={10}
                  hint="10-digit mobile number"
                />
                <div>
                  <label className="block text-sm font-medium text-dusty-gray mb-1.5">Address *</label>
                  <textarea
                    rows={3}
                    placeholder="123, MG Road, Bengaluru, Karnataka - 560001"
                    value={form.address}
                    onChange={set('address')}
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-mine-shaft placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-flamingo focus:border-transparent transition-all duration-200 resize-none ${errors.address ? 'border-red-300' : 'border-rose-bud/50 hover:border-orange-300'}`}
                  />
                  {errors.address && <p className="mt-1.5 text-xs text-red-600">{errors.address}</p>}
                </div>
              </>
            )}

            {/* Step 1 — KYC */}
            {step === 1 && (
              <>
                <div className="bg-rose-bud/10 rounded-xl p-4 border border-orange-100">
                  <p className="text-spicy-mix text-sm font-medium flex items-center gap-2">
                    🔒 Your KYC details are encrypted and stored securely
                  </p>
                </div>
                <Input
                  label="PAN Number *"
                  placeholder="ABCDE1234F"
                  value={form.panNumber}
                  onChange={(e) => setForm({ ...form, panNumber: e.target.value.toUpperCase() })}
                  error={errors.panNumber}
                  icon={<CreditCard size={16} />}
                  maxLength={10}
                  hint="Format: ABCDE1234F (5 letters + 4 digits + 1 letter)"
                />
                <Input
                  label="Aadhaar Number *"
                  placeholder="1234 5678 9012"
                  value={form.aadhaarNumber}
                  onChange={(e) => setForm({ ...form, aadhaarNumber: e.target.value.replace(/\D/g, '') })}
                  error={errors.aadhaarNumber}
                  icon={<MapPin size={16} />}
                  maxLength={12}
                  hint="12-digit Aadhaar number"
                />
              </>
            )}

            {/* Step 2 — Password */}
            {step === 2 && (
              <>
                <Input
                  label="Password *"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={set('password')}
                  error={errors.password}
                  icon={<Lock size={16} />}
                  suffix={
                    <button type="button" onClick={() => setShowPass(!showPass)} className="hover:text-flamingo transition-colors">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />
                <Input
                  label="Confirm Password *"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                  error={errors.confirmPassword}
                  icon={<Lock size={16} />}
                  suffix={
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="hover:text-flamingo transition-colors">
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />
                <div className="bg-rose-bud/10 rounded-xl p-4 border border-orange-100 text-sm text-spicy-mix">
                  By creating an account, you agree to NovaBank's Terms of Service.
                </div>
              </>
            )}

            <div className="flex gap-3 pt-2">
              {step > 0 && (
                <Button type="button" variant="secondary" size="lg" onClick={back} icon={<ArrowLeft size={18} />}>
                  Back
                </Button>
              )}
              <Button
                type="submit"
                size="lg"
                loading={loading}
                className="flex-1"
                icon={<ArrowRight size={18} />}
              >
                {step < 2 ? 'Continue' : 'Create Account'}
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-dusty-gray text-sm">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-flamingo font-semibold hover:text-spicy-mix transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
