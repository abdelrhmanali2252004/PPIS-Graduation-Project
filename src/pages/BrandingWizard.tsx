import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BrandingWizardContent from '../components/branding/BrandingWizardContent'
import { AppShell } from '../layouts/AppShell'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { createServiceRequest } from '../store/slices/serviceRequestSlice'
import { PROJECT_ID_STORAGE_KEY } from '../store/slices/projectStepsSlice'
import { clearSavedBranding } from '../store/slices/brandingSlice'
import { DEFAULT_BRANDING_FORM } from '../utils/wizardDefaults'

export default function BrandingWizard() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { creating, error: requestError, lastRequestId } = useAppSelector((s) => s.serviceRequest)
  const { saved: savedBranding, generating: generatingLogo } = useAppSelector((s) => s.branding)
  const { projectId: stepsProjectId, sessionVersion } = useAppSelector((s) => s.projectSteps)
  const projectId =
    stepsProjectId ?? localStorage.getItem(PROJECT_ID_STORAGE_KEY)

  const [sub, setSub] = useState(() =>
    savedBranding?.logoUrl ? 2 : DEFAULT_BRANDING_FORM.sub,
  )
  const [brandName, setBrandName] = useState(
    savedBranding?.brandName ?? DEFAULT_BRANDING_FORM.brandName,
  )
  const [tagline, setTagline] = useState(
    savedBranding?.tagline ?? DEFAULT_BRANDING_FORM.tagline,
  )
  const [businessType, setBusinessType] = useState(DEFAULT_BRANDING_FORM.businessType)
  const [audience, setAudience] = useState(DEFAULT_BRANDING_FORM.audience)
  const [symbolHint, setSymbolHint] = useState(DEFAULT_BRANDING_FORM.symbolHint)
  const [vibe, setVibe] = useState(DEFAULT_BRANDING_FORM.vibe)
  const [palette, setPalette] = useState(DEFAULT_BRANDING_FORM.palette)
  const [logoStyle, setLogoStyle] = useState(DEFAULT_BRANDING_FORM.logoStyle)
  const [accordionOpen, setAccordionOpen] = useState(DEFAULT_BRANDING_FORM.accordionOpen)
  const [sent, setSent] = useState(DEFAULT_BRANDING_FORM.sent)

  useEffect(() => {
    setSub(DEFAULT_BRANDING_FORM.sub)
    setBrandName(DEFAULT_BRANDING_FORM.brandName)
    setTagline(DEFAULT_BRANDING_FORM.tagline)
    setBusinessType(DEFAULT_BRANDING_FORM.businessType)
    setAudience(DEFAULT_BRANDING_FORM.audience)
    setSymbolHint(DEFAULT_BRANDING_FORM.symbolHint)
    setVibe(DEFAULT_BRANDING_FORM.vibe)
    setPalette(DEFAULT_BRANDING_FORM.palette)
    setLogoStyle(DEFAULT_BRANDING_FORM.logoStyle)
    setAccordionOpen(DEFAULT_BRANDING_FORM.accordionOpen)
    setSent(DEFAULT_BRANDING_FORM.sent)
  }, [sessionVersion])

  const leaveLogoStep = () => {
    if (sub === 2) dispatch(clearSavedBranding())
  }

  const handleFinish = async () => {
    const projectId = localStorage.getItem(PROJECT_ID_STORAGE_KEY)
    if (!projectId) {
      navigate('/app/step5')
      return
    }
    const result = await dispatch(
      createServiceRequest({ projectId, type: 'MANUAL_LOGO' }),
    )
    if (createServiceRequest.fulfilled.match(result)) {
      navigate('/app/step5')
    }
  }

  const aiTip =
    sub === 0
      ? 'ابدأ باسم واضح وشعار قصير، ثم اكتب نشاطك بدقة ليقترح الذكاء الاصطناعي اتجاهات مناسبة.'
      : sub === 1
      ? 'اختر روح البراند والألوان والستايل، أو اترك الذكاء الاصطناعي يقترح الأفضل لمجالك.'
      : 'جاري توليد لوجو مشروعك بالذكاء الاصطناعي — يمكنك إعادة التوليد أو تحميل النتيجة.'

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
        // step 1
        brandName={brandName}
        tagline={tagline}
        businessType={businessType}
        audience={audience}
        symbolHint={symbolHint}
        onBrandNameChange={setBrandName}
        onTaglineChange={setTagline}
        onBusinessTypeChange={setBusinessType}
        onAudienceChange={setAudience}
        onSymbolHintChange={setSymbolHint}
        // step 2
        vibe={vibe}
        palette={palette}
        logoStyle={logoStyle}
        onVibeChange={setVibe}
        onPaletteChange={setPalette}
        onLogoStyleChange={setLogoStyle}
        accordionOpen={accordionOpen}
        sent={sent}
        onAccordionToggle={() => setAccordionOpen((o) => !o)}
        onSent={() => setSent(true)}
        // step 3 logo
        projectId={projectId}
        generatingLogo={generatingLogo}
        // finish
        submitting={creating}
        submitError={requestError}
        submitSuccess={!!lastRequestId}
        onFinish={() => void handleFinish()}
        // navigation — steps 2 & 3 locked until step 1 has a brand name
        onSubChange={(i) => {
          if (i > 0 && !brandName.trim()) return  // lock: must fill step 1 first
          if (sub === 2 && i !== 2) dispatch(clearSavedBranding())
          setSub(i)
        }}
        onPrev={() => {
          leaveLogoStep()
          setSub((s) => Math.max(0, s - 1))
        }}
        onNext={() => {
          if (sub === 0 && !brandName.trim()) return  // lock: must fill brand name
          setSub((s) => s + 1)
        }}
      />
    </AppShell>
  )
}
