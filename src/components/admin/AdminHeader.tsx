import { useLocation } from 'react-router-dom'
import { getAdminPageMeta } from '../../config/adminNav'

export default function AdminHeader() {
  const { pathname } = useLocation()
  const { title, description } = getAdminPageMeta(pathname)

  return (
    <header className="mb-6 rounded-2xl border border-divider bg-white p-5 shadow-sm">
      <h1 className="text-xl font-bold text-nile md:text-2xl">{title}</h1>
      <p className="mt-1 text-sm text-slateMuted">{description}</p>
    </header>
  )
}
