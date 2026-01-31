interface PasswordStrengthProps {
  score: number
  hasLength: boolean
  hasNumber: boolean
  hasSpecial: boolean
}

export function PasswordStrength({
  score,
  hasLength,
  hasNumber,
  hasSpecial,
}: PasswordStrengthProps) {
  return (
    <div className="pt-2">
      {/* Strength Bars */}
      <div className="flex gap-1 h-1 mb-2">
        <div
          className={`flex-1 rounded-full transition-colors ${
            score >= 1 ? 'bg-success' : 'bg-gray-200'
          }`}
        />
        <div
          className={`flex-1 rounded-full transition-colors ${
            score >= 2 ? 'bg-success' : 'bg-gray-200'
          }`}
        />
        <div
          className={`flex-1 rounded-full transition-colors ${
            score >= 3 ? 'bg-success' : 'bg-gray-200'
          }`}
        />
        <div
          className={`flex-1 rounded-full transition-colors ${
            score >= 4 ? 'bg-success' : 'bg-gray-200'
          }`}
        />
      </div>

      {/* Requirements List */}
      <ul className="text-xs text-gray-500 space-y-1 pl-1">
        <li
          className={`flex items-center gap-1.5 transition-colors ${
            hasLength ? 'text-success' : ''
          }`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-3">
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span>At least 8 characters</span>
        </li>
        <li
          className={`flex items-center gap-1.5 transition-colors ${
            hasNumber ? 'text-success' : ''
          }`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-3">
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span>Contains a number</span>
        </li>
        <li
          className={`flex items-center gap-1.5 transition-colors ${
            hasSpecial ? 'text-success' : ''
          }`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-3">
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span>Contains a special symbol</span>
        </li>
      </ul>
    </div>
  )
}
