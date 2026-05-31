import { FolderKanban, LayoutDashboard, Settings } from 'lucide-react'

export const USER_DASHBOARD_PAGES = [
  {
    id: 'projects',
    label: 'مشروعاتي',
    Icon: FolderKanban,
    to: '/dashboard/user/projects',
  },
  {
    id: 'dashboard',
    label: 'لوحة التحكم',
    Icon: LayoutDashboard,
    to: '/app/step5',
  },
  {
    id: 'profile',
    label: 'اعداداتي',
    Icon: Settings,
    to: '/dashboard/user/profile',
  },
] as const
