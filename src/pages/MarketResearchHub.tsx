import MarketResearchContent from '../components/market-research/MarketResearchContent'
import { AppShell } from '../layouts/AppShell'

export default function MarketResearchHub() {
  return (
    <AppShell
      activeStep={1}
      progressPercent={20}
      bottomStepLabel="الخطوة ١ من ٥ — مركز أبحاث السوق"
      aiTip="بيانات الغرفة التجارية بأسيوط متاحة كمصادر موثقة لـ RAG — ارفع PDF رسمي لزيادة الثقة في التحليل."
    >
      <MarketResearchContent />
    </AppShell>
  )
}
