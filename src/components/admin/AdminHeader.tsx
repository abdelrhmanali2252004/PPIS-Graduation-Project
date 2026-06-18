import { useLocation } from 'react-router-dom'
import { getAdminPageMeta } from '../../config/adminNav'
import { useTranslation } from '../../i18n/LanguageContext'

export default function AdminHeader() {
  const { pathname } = useLocation()
  const { titleKey, descriptionKey } = getAdminPageMeta(pathname)
  const { t } = useTranslation()

  if (pathname.includes('/profile') || /\/projects\/[^/]+\/dashboard$/.test(pathname)) {
    return null
  }

  return (
    <header className="mb-6 rounded-2xl border border-divider bg-white p-5 shadow-sm">
      <h1 className="text-xl font-bold text-nile md:text-2xl">{t(titleKey)}</h1>
      <p className="mt-1 text-sm text-slateMuted">{t(descriptionKey)}</p>
    </header>
  )
}
