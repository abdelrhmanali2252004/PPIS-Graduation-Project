import { FolderKanban, MessagesSquare, Users } from 'lucide-react'

export const ADMIN_PAGES = [
  {
    id: 'users',
    label: 'المستخدمين',
    to: '/dashboard/admin/users',
    title: 'إدارة المستخدمين',
    description: 'عرض جميع المستخدمين وبيانات حساباتهم',
    Icon: Users,
  },
  {
    id: 'projects',
    label: 'المشاريع',
    to: '/dashboard/admin/projects',
    title: 'إدارة المشاريع',
    description: 'عرض جميع المشاريع المسجلة على المنصة',
    Icon: FolderKanban,
  },
  {
    id: 'requests',
    label: 'الطلبات',
    to: '/dashboard/admin/requests',
    title: 'إدارة الطلبات',
    description: 'عرض جميع طلبات الخدمات والتواصل مع المختصين',
    Icon: MessagesSquare,
  },
] as const

export type AdminPageId = (typeof ADMIN_PAGES)[number]['id']

export function getAdminPageMeta(pathname: string) {
  return (
    ADMIN_PAGES.find((page) => pathname.startsWith(page.to)) ?? ADMIN_PAGES[0]
  )
}
