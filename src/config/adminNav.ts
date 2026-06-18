import { FolderKanban, MessagesSquare, Users } from 'lucide-react'

export const ADMIN_PAGES = [
  {
    id: 'users',
    labelKey: 'admin.users',
    titleKey: 'admin.usersTitle',
    descriptionKey: 'admin.usersDesc',
    to: '/dashboard/admin/users',
    Icon: Users,
  },
  {
    id: 'projects',
    labelKey: 'admin.projects',
    titleKey: 'admin.projectsTitle',
    descriptionKey: 'admin.projectsDesc',
    to: '/dashboard/admin/projects',
    Icon: FolderKanban,
  },
  {
    id: 'requests',
    labelKey: 'admin.requests',
    titleKey: 'admin.requestsTitle',
    descriptionKey: 'admin.requestsDesc',
    to: '/dashboard/admin/requests',
    Icon: MessagesSquare,
  },
] as const

export type AdminPageId = (typeof ADMIN_PAGES)[number]['id']

export function getAdminPageMeta(pathname: string) {
  return ADMIN_PAGES.find((page) => pathname.startsWith(page.to)) ?? ADMIN_PAGES[0]
}
