import { InputHTMLAttributes, ReactNode } from 'react'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode
}

export function Checkbox({ id, label, ...props }: CheckboxProps) {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          id={id}
          type="checkbox"
          className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded cursor-pointer"
          {...props}
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={id} className="font-medium text-gray-700 cursor-pointer">
          {label}
        </label>
      </div>
    </div>
  )
}
