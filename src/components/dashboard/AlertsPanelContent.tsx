import type { DashboardAlert, DashboardMetrics } from '../../utils/parseFeasibilityMetrics'
import { formatEgp } from '../../utils/parseFeasibilityMetrics'

const ALERT_STYLES: Record<
  DashboardAlert['type'],
  { border: string; title: string; bg: string }
> = {
  risk: { border: 'border-danger', title: 'text-danger', bg: 'bg-red-50/50 dark:bg-red-500/10' },
  opportunity: { border: 'border-gold', title: 'text-warning', bg: 'bg-amber-50/50 dark:bg-amber-500/10' },
  positive: { border: 'border-success', title: 'text-success', bg: 'bg-emerald-50/50 dark:bg-emerald-500/10' },
  action: { border: 'border-nile', title: 'text-heading', bg: 'bg-blue-50/50 dark:bg-nile/20' },
}

const ALERT_LABELS: Record<DashboardAlert['type'], string> = {
  risk: 'مخاطرة عالية',
  opportunity: 'فرصة',
  positive: 'إيجابي',
  action: 'إجراء',
}

type AlertsPanelContentProps = {
  metrics?: DashboardMetrics | null
  compact?: boolean
}

export function AlertsPanelContent({ metrics, compact }: AlertsPanelContentProps) {
  const alerts = metrics?.alerts ?? []
  const count = alerts.length

  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'} dir="rtl">
      <div className={compact ? 'px-4 pt-4' : ''}>
        <h2 className="text-sm font-bold text-heading">التنبيهات الذكية</h2>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="h-2 w-2 animate-blink rounded-full bg-danger" />
          <span className="font-semibold text-body">{count} تنبيهات</span>
        </div>
      </div>

      <div className={compact ? 'max-h-[min(50vh,320px)] space-y-3 overflow-y-auto px-4' : 'space-y-3'}>
        {count === 0 ? (
          <p className="rounded-xl bg-offwhite px-3 py-4 text-center text-xs text-slateMuted">
            لا توجد تنبيهات بعد. أكمل دراسة الجدوى لعرض التنبيهات الذكية.
          </p>
        ) : (
          alerts.map((alert, i) => {
            const style = ALERT_STYLES[alert.type]
            return (
              <div
                key={`${alert.type}-${i}`}
                className={`rounded-xl border-s-4 ${style.border} ${style.bg} p-3 shadow-sm`}
              >
                <div className={`mb-1 text-xs font-bold ${style.title}`}>
                  {ALERT_LABELS[alert.type]}
                </div>
                <p className="text-xs leading-relaxed text-body">{alert.body}</p>
              </div>
            )
          })
        )}
      </div>

      {metrics ? (
        <div className={compact ? 'border-t border-divider px-4 py-4' : 'border-t border-divider pt-4'}>
          <h3 className="mb-3 text-xs font-bold text-heading">لقطة مالية</h3>
          <ul className="space-y-2 text-xs text-body">
            <SnapshotRow label="رأس المال" value={formatEgp(metrics.totalCapital, true)} />
            <SnapshotRow label="تكاليف التأسيس" value={formatEgp(metrics.startupCosts, true)} />
            <SnapshotRow label="الإيراد الشهري" value={formatEgp(metrics.monthlyRevenue, true)} />
            <SnapshotRow
              label="التكاليف الشهرية"
              value={formatEgp(metrics.monthlyOperatingCosts, true)}
            />
          </ul>
        </div>
      ) : null}
    </div>
  )
}

function SnapshotRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between gap-2">
      <span className="text-slateMuted">{label}</span>
      <span className="font-bold">{value}</span>
    </li>
  )
}
