'use client'

export type ProfileTab = 'enrollments' | 'quizAttempts' | 'purchases' | 'admissions'

interface ProfileTabsProps {
  activeTab: ProfileTab
  onTabChange: (tab: ProfileTab) => void
  counts: {
    enrollments: number
    quizAttempts: number
    purchases: number
    admissions: number
  }
}

interface TabItem {
  value: ProfileTab
  label: string
}

const tabs: TabItem[] = [
  { value: 'enrollments', label: 'Enrollments' },
  { value: 'quizAttempts', label: 'Quiz Attempts' },
  { value: 'purchases', label: 'Purchases' },
  { value: 'admissions', label: 'Admissions' },
]

export function ProfileTabs({ activeTab, onTabChange, counts }: ProfileTabsProps) {
  return (
    <div className="flex border-b border-gray-200 px-6 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`px-6 py-4 border-b-2 font-bold text-sm whitespace-nowrap transition-colors ${
            activeTab === tab.value
              ? 'border-brand-gold text-brand-navy'
              : 'border-transparent text-gray-500 hover:text-brand-navy hover:border-gray-300'
          }`}
        >
          {tab.label}
          <span className="ml-2 text-xs font-normal text-gray-400">
            ({counts[tab.value]})
          </span>
        </button>
      ))}
    </div>
  )
}
