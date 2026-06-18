import type { ReactNode } from 'react'
import UserDashboardSidebar from './UserDashboardSidebar'
import { useLanguage } from '../i18n/LanguageContext'

type UserDashboardLayoutProps = {
  children: ReactNode
}

export default function UserDashboardLayout({ children }: UserDashboardLayoutProps) {
  const { dir } = useLanguage()

  return (
    <div dir={dir} className="flex h-screen overflow-hidden bg-offwhite font-cairo">
      <UserDashboardSidebar />
      <div className="relative flex min-w-0 flex-1">
        <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
