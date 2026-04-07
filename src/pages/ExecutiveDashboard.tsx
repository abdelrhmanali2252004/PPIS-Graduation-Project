import ExecutiveDashboardContent, {
  AlertsPanel,
} from '../components/dashboard/ExecutiveDashboardContent'
import { AppShell } from '../layouts/AppShell'

export default function ExecutiveDashboard() {
  return (
    <AppShell
      activeStep={5}
      progressPercent={100}
      bottomStepLabel="الخطوة ٥ من ٥ — اكتمل المشروع 🎉"
      hideBottomBar
      aiTip="هامش ربح الكافيهات في صعيد مصر ٢٠٢٦: أعلى من المتوسط عند التركيز على السلع عالية الدوران مقارنة بالمنيو الواسع."
      rightPanel={<AlertsPanel />}
    >
      <ExecutiveDashboardContent />
    </AppShell>
  )
}
