'use client'

export type ProfileSidebarTab = 'profile' | 'security' | 'history'

interface ProfileSidebarProps {
  activeTab: ProfileSidebarTab
  onTabChange: (tab: ProfileSidebarTab) => void
}

interface SidebarItem {
  icon: string
  label: string
  value: ProfileSidebarTab
}

const sidebarItems: SidebarItem[] = [
  {
    icon: 'person',
    label: 'Profile Settings',
    value: 'profile',
  },
  {
    icon: 'lock',
    label: 'Password & Security',
    value: 'security',
  },
  {
    icon: 'history',
    label: 'Activity History',
    value: 'history',
  },
]

export function ProfileSidebar({ activeTab, onTabChange }: ProfileSidebarProps) {
  return (
    <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
      <nav className="space-y-1">
        {sidebarItems.map((item) => (
          <button
            key={item.value}
            onClick={() => onTabChange(item.value)}
            className={`w-full group rounded-lg px-3 py-2.5 flex items-center text-sm font-medium transition-all ${
              activeTab === item.value
                ? 'bg-white text-brand-blue border-l-4 border-brand-blue shadow-sm'
                : 'text-gray-600 hover:text-brand-navy hover:bg-white border-l-4 border-transparent'
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`mr-3 size-5 flex-shrink-0 ${
                activeTab === item.value ? 'text-brand-blue' : 'text-gray-400 group-hover:text-gray-600'
              }`}
            >
              {item.icon === 'person' && (
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              )}
              {item.icon === 'lock' && (
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              )}
              {item.icon === 'history' && (
                <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
              )}
            </svg>
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
