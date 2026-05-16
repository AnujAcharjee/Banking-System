'use client'
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
}

const variantClasses = {
  primary: 'flamingo-gradient text-white shadow-md hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0 active:shadow-none',
  secondary: 'bg-rose-bud/10 text-spicy-mix border border-rose-bud/50 hover:bg-rose-bud/20 hover:border-orange-300 active:scale-95',
  ghost: 'text-flamingo hover:bg-rose-bud/10 active:scale-95',
  danger: 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 active:scale-95',
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon, children, className = '', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center gap-2 font-semibold
          transition-all duration-200 cursor-pointer
          disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : icon ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
