import { Users, MessagesSquare, FolderKanban, ShieldCheck } from 'lucide-react'

const ADMIN_NAV = [
  { id: 'users', label: 'المستخدمين', Icon: Users },
  { id: 'requests', label: 'الطلبات', Icon: MessagesSquare },
  { id: 'analyses', label: 'تحليلات المشاريع', Icon: FolderKanban },
] as const

export type AdminTab = (typeof ADMIN_NAV)[number]['id']

type AdminSidebarProps = {
  activeTab: AdminTab
  onTabChange: (tab: AdminTab) => void
}

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  return (
    <aside className="w-[260px] shrink-0 border-l border-divider bg-nile text-white">
      <div className="border-b border-white/15 px-5 py-5">
        <div className="mb-1 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-gold" />
          <span className="text-sm font-bold">Admin Panel</span>
        </div>
        <p className="text-xs text-white/70">NextVenture OS</p>
      </div>

      <nav className="space-y-2 p-3">
        {ADMIN_NAV.map(({ id, label, Icon }) => {
          const active = id === activeTab
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? 'bg-white/15 font-semibold text-white'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4 text-gold" />
              {label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
