import { SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: Array<{ value: string; label: string }>
}

export function FormSelect({ id, label, options, className, ...props }: FormSelectProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          className={cn(
            'block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm py-3 px-4 text-gray-900 bg-white appearance-none',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.value === ''}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
          <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
