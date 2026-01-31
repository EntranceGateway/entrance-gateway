import { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: ReactNode
  validationIcon?: ReactNode
  isValid?: boolean
  helperText?: string
}

export function FormInput({
  id,
  label,
  icon,
  validationIcon,
  isValid,
  helperText,
  className,
  ...props
}: FormInputProps) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-700 flex justify-between"
      >
        <span>{label}</span>
        {isValid && helperText && (
          <span className="text-xs text-success font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            {helperText}
          </span>
        )}
      </label>
      <div className="relative group">
        {icon && (
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </span>
        )}
        <input
          id={id}
          className={cn(
            'block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm py-3 px-4 placeholder-gray-400 transition-colors',
            icon && 'pl-10',
            validationIcon && 'pr-10',
            isValid && 'border-success focus:border-success focus:ring-success bg-green-50/30',
            className
          )}
          {...props}
        />
        {validationIcon && isValid && (
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {validationIcon}
          </span>
        )}
      </div>
    </div>
  )
}
