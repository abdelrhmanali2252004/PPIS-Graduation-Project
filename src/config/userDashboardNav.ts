import { FolderKanban, LayoutDashboard, Settings } from 'lucide-react'

export const USER_DASHBOARD_PAGES = [
  {
    id: 'projects',
    labelKey: 'dashboard.myProjects',
    Icon: FolderKanban,
    to: '/dashboard/user/projects',
  },
  {
    id: 'dashboard',
    labelKey: 'app.step5',
    Icon: LayoutDashboard,
    to: '/app/step5',
  },
  {
    id: 'profile',
    labelKey: 'dashboard.settings',
    Icon: Settings,
    to: '/dashboard/user/profile',
  },
] as const
