import type { DashboardMetrics } from '../../utils/parseFeasibilityMetrics'
import { AlertsPanelContent } from './AlertsPanelContent'

type DashboardAlertsPanelProps = {
  metrics?: DashboardMetrics | null
}

/** @deprecated Use SmartNotificationsBell in the page header instead. */
export function DashboardAlertsPanel({ metrics }: DashboardAlertsPanelProps) {
  return (
    <aside
      className="hidden w-[260px] shrink-0 overflow-y-auto border-r border-divider bg-white lg:block"
      dir="rtl"
    >
      <AlertsPanelContent metrics={metrics} />
    </aside>
  )
}

export function AlertsPanel() {
  return <DashboardAlertsPanel metrics={null} />
}
