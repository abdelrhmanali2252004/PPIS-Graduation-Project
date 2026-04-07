import { useState } from 'react'
import FeasibilityContent, { type TabId } from '../components/feasibility/FeasibilityContent'
import { AppShell } from '../layouts/AppShell'

export default function FeasibilityOutput() {
  const [tab, setTab] = useState<TabId>('summary')

  return (
    <AppShell
      activeStep={3}
      progressPercent={60}
      bottomStepLabel="الخطوة ٣ من ٥ — مخرجات الجدوى"
      mainScrollable
      aiTip="أكثر من ٢٠٠ مشروعاً في صعيد مصر تم تحليلها في قاعدة المعرفة — هامش الربح لكافيهات أسيوط أعلى من المتوسط عند التركيز على التجزئة."
    >
      <FeasibilityContent tab={tab} onTabChange={setTab} />
    </AppShell>
  )
}
