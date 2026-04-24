import type { User } from '@/types/user.types'

export interface NavItem {
  label: string
  href: string
}

export interface NavbarInitialUser {
  fullname: User['fullname']
}

export interface NavbarProps {
  logo?: {
    src: string
    alt: string
  }
  items?: NavItem[]
  user?: {
    name: string
    avatar: string
  }
  initialUser?: NavbarInitialUser | null
  onNotificationClick?: () => void
  className?: string
}
