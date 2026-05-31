type TabItem<T extends string> = { id: T; label: string }

export default function DashboardTabBar<T extends string>({
  tabs,
  activeTab,
  onChange,
}: {
  tabs: readonly TabItem<T>[]
  activeTab: T
  onChange: (tab: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-divider pb-2">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`rounded-t-lg px-4 py-2 text-sm font-semibold transition-colors ${
            activeTab === t.id
              ? 'bg-nile text-white'
              : 'text-slateMuted hover:bg-offwhite'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
