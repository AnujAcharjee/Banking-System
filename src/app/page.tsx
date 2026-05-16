'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  Shield, Zap, TrendingUp, ArrowRight, ChevronRight,
  CheckCircle, Lock, Globe, Smartphone, Star, Menu, X
} from 'lucide-react'

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [countBalance, setCountBalance] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const target = 2847362
    const duration = 2000
    const step = target / (duration / 16)
    let current = 0
    const timer = setInterval(() => {
      current = Math.min(current + step, target)
      setCountBalance(Math.floor(current))
      if (current >= target) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [])

  const features = [
    { icon: Shield, title: 'Bank-Grade Security', desc: 'JWT authentication with encrypted data storage and secure sessions.' },
    { icon: Zap, title: 'Instant Transfers', desc: 'Move money between accounts in real-time with zero delays.' },
    { icon: TrendingUp, title: 'Detailed Passbook', desc: 'Track every transaction with detailed history and filters.' },
    { icon: Smartphone, title: 'Modern Interface', desc: 'Clean, intuitive design that works beautifully on any device.' },
    { icon: Lock, title: 'Privacy First', desc: 'Your Aadhaar and PAN data is encrypted and never shared.' },
    { icon: Globe, title: 'Always Available', desc: '24/7 access to your account, anytime, anywhere.' },
  ]

  const steps = [
    { num: '01', title: 'Sign Up', desc: 'Create your account with basic KYC details in under 2 minutes.' },
    { num: '02', title: 'Get Your Account', desc: 'Instantly receive your unique NOVA account number.' },
    { num: '03', title: 'Start Banking', desc: 'Credit, debit, transfer funds with a clean dashboard.' },
  ]

  return (
    <div className="min-h-screen font-body">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-orange-100' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 flamingo-gradient rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="font-display text-xl font-bold text-mine-shaft">NovaBank</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-dusty-gray hover:text-flamingo transition-colors text-sm font-medium">Features</a>
            <a href="#how-it-works" className="text-dusty-gray hover:text-flamingo transition-colors text-sm font-medium">How it Works</a>
            <Link href="/auth/signin" className="text-dusty-gray hover:text-flamingo transition-colors text-sm font-medium">Sign In</Link>
            <Link
              href="/auth/signup"
              className="btn-primary text-sm py-2.5"
            >
              Open Account
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-orange-100 px-6 py-4 flex flex-col gap-4 animate-slide-up">
            <a href="#features" className="text-dusty-gray font-medium" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="text-dusty-gray font-medium" onClick={() => setMenuOpen(false)}>How it Works</a>
            <Link href="/auth/signin" className="text-dusty-gray font-medium" onClick={() => setMenuOpen(false)}>Sign In</Link>
            <Link href="/auth/signup" className="btn-primary text-center" onClick={() => setMenuOpen(false)}>Open Account</Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-20 px-6 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-10 right-0 w-[600px] h-[600px] bg-rose-bud/20 rounded-full blur-3xl opacity-40 -translate-y-20 translate-x-40" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-bud/40 rounded-full blur-3xl opacity-30 translate-y-20 -translate-x-20" />

        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-3xl animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-rose-bud/10 border border-rose-bud/50 rounded-full px-4 py-1.5 mb-6">
              <Star size={14} className="text-flamingo fill-orange-500" />
              <span className="text-spicy-mix text-sm font-medium">India's Modern Banking Platform</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold text-mine-shaft leading-tight mb-6">
              Banking that
              <span className="block gradient-text">moves with you</span>
            </h1>

            <p className="text-xl text-dusty-gray mb-10 leading-relaxed max-w-xl">
              Open a NovaBank account in minutes. Secure, fast, and beautifully simple banking for the modern world.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/auth/signup" className="btn-primary flex items-center gap-2 text-base">
                Open Free Account
                <ArrowRight size={18} />
              </Link>
              <Link href="/auth/signin" className="btn-secondary flex items-center gap-2 text-base">
                Sign In
                <ChevronRight size={18} />
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-6 flex-wrap">
              {[
                { label: 'Secure & Encrypted' },
                { label: 'Instant Account Opening' },
                { label: 'Real-time Transactions' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-dusty-gray text-sm">
                  <CheckCircle size={16} className="text-flamingo" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating balance card */}
          <div className="mt-16 lg:mt-0 lg:absolute lg:right-8 lg:top-8 animate-slide-in-right">
            <div className="w-80 flamingo-gradient rounded-2xl p-6 shadow-glow-lg text-white">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-rose-bud text-xs font-medium uppercase tracking-wider">Total Balance</p>
                  <p className="text-3xl font-bold mt-1">₹{countBalance.toLocaleString('en-IN')}</p>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">N</span>
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 mb-4">
                <p className="text-rose-bud text-xs mb-1">Account Number</p>
                <p className="font-mono font-semibold tracking-wider">NOVA •••• 8372</p>
              </div>
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-rose-bud text-xs">Card Holder</p>
                  <p className="font-medium mt-0.5">Raj Sharma</p>
                </div>
                <div className="text-right">
                  <p className="text-rose-bud text-xs">Member Since</p>
                  <p className="font-medium mt-0.5">Jan 2024</p>
                </div>
              </div>
            </div>

            {/* Mini transaction preview */}
            <div className="mt-4 bg-white rounded-2xl p-4 shadow-card border border-orange-50 w-80">
              <p className="text-xs font-semibold text-dusty-gray mb-3 uppercase tracking-wider">Recent Activity</p>
              {[
                { label: 'Salary Credit', amount: '+₹45,000', color: 'text-green-600' },
                { label: 'Grocery Store', amount: '-₹1,240', color: 'text-red-500' },
                { label: 'Transfer to Priya', amount: '-₹5,000', color: 'text-red-500' },
              ].map((t, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-dusty-gray/10 last:border-0">
                  <span className="text-sm text-dusty-gray">{t.label}</span>
                  <span className={`text-sm font-semibold ${t.color}`}>{t.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-flamingo font-semibold text-sm uppercase tracking-widest mb-3">Why NovaBank</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-mine-shaft">
              Everything you need,
              <span className="block gradient-text">nothing you don't</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-orange-100 bg-rose-bud/10/30 card-hover cursor-default"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-12 h-12 flamingo-gradient rounded-xl flex items-center justify-center mb-4 shadow-md">
                  <f.icon size={22} className="text-white" />
                </div>
                <h3 className="font-semibold text-mine-shaft text-lg mb-2">{f.title}</h3>
                <p className="text-dusty-gray text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-flamingo font-semibold text-sm uppercase tracking-widest mb-3">Getting Started</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-mine-shaft">Up and running in minutes</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-orange-300 to-orange-100 z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 flamingo-gradient rounded-2xl flex items-center justify-center mb-6 shadow-glow">
                    <span className="text-white font-display font-bold text-lg">{step.num}</span>
                  </div>
                  <h3 className="text-xl font-bold text-mine-shaft mb-3">{step.title}</h3>
                  <p className="text-dusty-gray leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link href="/auth/signup" className="btn-primary inline-flex items-center gap-2 text-base">
              Get Started Now
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6 flamingo-gradient">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Ready to experience modern banking?
          </h2>
          <p className="text-white/70 text-lg mb-10">
            Join thousands of users who trust NovaBank with their finances.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-white text-flamingo font-semibold px-8 py-4 rounded-xl hover:bg-rose-bud/10 active:scale-95 transition-all duration-200 shadow-lg"
          >
            Open Your Account
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-mine-shaft text-dusty-gray/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flamingo-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-white font-semibold font-display">NovaBank</span>
          </div>
          <p className="text-sm">© 2026 NovaBank. Built for Software Engineering Lab.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/auth/signin" className="hover:text-flamingo/80 transition-colors">Sign In</Link>
            <Link href="/auth/signup" className="hover:text-flamingo/80 transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
