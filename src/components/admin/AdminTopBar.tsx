import { Search, Bell, UserCircle2 } from 'lucide-react'

export default function AdminTopBar() {
  return (
    <section className="mb-4  p-4 ">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
          <input
            type="text"
            placeholder="ابحث عن مستخدم، مشروع، أو طلب..."
            className="w-full rounded-xl border border-divider bg-offwhite py-2.5 pr-10 pl-4 text-sm outline-none transition focus:border-nile focus:ring-2 focus:ring-nile/15"
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            className="relative rounded-full border border-divider bg-offwhite p-2 text-slateMuted hover:text-nile"
            aria-label="الإشعارات"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-danger" />
          </button>
          <div className="flex items-center gap-2 rounded-xl border border-divider bg-offwhite px-3 py-1.5">
            <UserCircle2 className="h-7 w-7 text-nile" />
            <div className="text-right">
              <div className="text-sm font-bold text-body">مدير النظام</div>
              <div className="text-xs text-slateMuted">admin@nextventure.os</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
