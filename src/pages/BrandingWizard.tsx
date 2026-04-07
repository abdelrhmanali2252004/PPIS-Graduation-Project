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
      ? 'الطابع الاحترافي يزيد ثقة الممولين — جرّب دمجه مع لمسة ذهبية خفيفة.'
      : sub === 1
        ? 'لوحة «تراث أسيوط» متوافقة مع WCAG 2026 عند استخدام النص الداكن على الخلفيات الفاتحة.'
        : 'يمكن تصدير الشعار بصيغ متعددة للبطاقات والشاشات فور اعتمادك.'

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
