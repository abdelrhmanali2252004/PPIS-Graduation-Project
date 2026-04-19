import { useState } from 'react'
import BrandingWizardContent from '../components/branding/BrandingWizardContent'
import { AppShell } from '../layouts/AppShell'

export default function BrandingWizard() {
  const [sub, setSub] = useState(0)
  const [vibe, setVibe] = useState<string>('pro')
  const [palette, setPalette] = useState<string>('as')
  const [preview, setPreview] = useState<Record<string, 'card' | 'mobile'>>({
    geo: 'card',
    cal: 'card',
    con: 'card',
  })
  const [accordionOpen, setAccordionOpen] = useState(false)
  const [sent, setSent] = useState(false)

  const aiTip =
    sub === 0
      ? 'ابدأ باسم واضح وشعار قصير، ثم اكتب نشاطك بدقة ليقترح الذكاء الاصطناعي اتجاهات مناسبة.'
      : sub === 1
      ? 'اختر روح البراند والألوان والستايل، أو اترك الذكاء الاصطناعي يقترح الأفضل لمجالك.'
      : 'راجع المقترحات واختر التصميم الأنسب ثم انتقل للخطوة التالية.'

  return (
    <AppShell
      activeStep={4}
      progressPercent={80}
      bottomStepLabel="الخطوة ٤ من ٥ — الهوية البصرية"
      aiPulseKey={sub}
      aiTip={aiTip}
    >
      <BrandingWizardContent
        sub={sub}
        vibe={vibe}
        palette={palette}
        preview={preview}
        accordionOpen={accordionOpen}
        sent={sent}
        onSubChange={setSub}
        onVibeChange={setVibe}
        onPaletteChange={setPalette}
        onPreviewChange={(id, mode) => setPreview((s) => ({ ...s, [id]: mode }))}
        onAccordionToggle={() => setAccordionOpen((o) => !o)}
        onSent={() => setSent(true)}
        onPrev={() => setSub((s) => Math.max(0, s - 1))}
        onNext={() => setSub((s) => s + 1)}
      />
    </AppShell>
  )
}
