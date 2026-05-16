'use client'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
  suffix?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, suffix, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-dusty-gray mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dusty-gray/80 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full py-3 rounded-xl border bg-white text-mine-shaft placeholder-gray-400
              focus:outline-none focus:ring-2 focus:border-transparent
              transition-all duration-200
              ${icon ? 'pl-10' : 'pl-4'}
              ${suffix ? 'pr-12' : 'pr-4'}
              ${error
                ? 'border-red-300 focus:ring-red-300'
                : 'border-rose-bud/50 hover:border-orange-300 focus:ring-flamingo'
              }
              ${className}
            `}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dusty-gray/80">
              {suffix}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-dusty-gray">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
