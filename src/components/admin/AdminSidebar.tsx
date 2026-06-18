import { NavLink, Link } from 'react-router-dom'
import { ShieldCheck, User } from 'lucide-react'
import { ADMIN_PAGES } from '../../config/adminNav'
import { USER_STORAGE_KEY } from '../../api/client'
import FikraTechLogo from '../branding/FikraTechLogo'
import { useTranslation } from '../../i18n/LanguageContext'

function readSidebarUser() {
  const fallback = {
    name: 'مدير النظام',
    email: 'admin@nextventure.os',
  }

  const rawUser = localStorage.getItem(USER_STORAGE_KEY)
  if (!rawUser) {
    return fallback
  }

  try {
    const parsedUser = JSON.parse(rawUser) as { name?: string; email?: string }
    return {
      name: parsedUser.name?.trim() || fallback.name,
      email: parsedUser.email?.trim() || fallback.email,
    }
  } catch {
    return fallback
  }
}

export default function AdminSidebar() {
  const sidebarUser = readSidebarUser()
  const { t } = useTranslation()

  return (
    <aside className="flex w-[260px] shrink-0 flex-col border-s border-divider bg-nile text-white">
      <div className="border-b border-white/15 px-5 py-5">
        <div className="mb-1 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-gold" />
          <span className="text-sm font-bold">{t('admin.panel')}</span>
        </div>
        <Link to="/" className="mt-3 inline-flex" aria-label={`${t('logo.name')} ${t('logo.tag')}`}>
          <FikraTechLogo variant="compact" />
        </Link>
      </div>

      <nav className="space-y-2 p-3">
        {ADMIN_PAGES.map(({ id, labelKey, Icon, to }) => (
          <NavLink
            key={id}
            to={to}
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-white/15 font-semibold text-white'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="h-4 w-4 text-gold" />
            {t(labelKey)}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex items-center gap-2 border-t border-white/15 px-4 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
          <User className="h-5 w-5 text-gold" />
        </div>
        <div className="min-w-0 text-sm">
          <div className="truncate font-medium">{sidebarUser.name}</div>
          <div className="truncate text-xs text-white/60">{sidebarUser.email}</div>
        </div>
      </div>
    </aside>
  )
}
