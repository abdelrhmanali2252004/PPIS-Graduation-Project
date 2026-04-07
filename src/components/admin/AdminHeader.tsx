import type { AdminTab } from './AdminSidebar'

type AdminHeaderProps = {
  activeTab: AdminTab
}

export default function AdminHeader({ activeTab }: AdminHeaderProps) {
  const title =
    activeTab === 'users'
      ? 'إدارة المستخدمين'
      : activeTab === 'requests'
        ? 'طلبات التواصل مع المختصين'
        : 'جميع تحليلات المشاريع'

  return (
    <header className="mb-6 rounded-2xl border border-divider bg-white p-5 shadow-sm">
      <h1 className="text-xl font-bold text-nile md:text-2xl">{title}</h1>
      <p className="mt-1 text-sm text-slateMuted">لوحة متابعة وإدارة بيانات المنصة</p>
    </header>
  )
}
