import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProjectWizardContent from '../components/project-wizard/ProjectWizardContent'
import { QUESTION_ITEMS, type ProjectAnswers } from '../components/project-wizard/questions'
import { AppShell } from '../layouts/AppShell'
import {
  resetProjectWizardState,
  submitProjectWizard,
} from '../store/slices/projectWizardSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { readStoredProjectId } from '../utils/readStoredProjectId'

const TOTAL_QUESTIONS = QUESTION_ITEMS.length

export default function ProjectWizard() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { loading: submitting, error: wizardError } = useAppSelector(
    (s) => s.projectWizard,
  )
  const [idx, setIdx] = useState(0)
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null)

  useEffect(() => {
    dispatch(resetProjectWizardState())
  }, [dispatch])

  const step = idx + 1
  const [answers, setAnswers] = useState<ProjectAnswers>({
    idea_name: 'مشروع الري المزود بتقنية الاستشعار الذكي',
    idea: 'تطوير نظام ري ذكي يعتمد على أجهزة استشعار لرصد رطوبة التربة وتوصيل المياه تلقائياً عند الحاجة',
    sector: 'الزراعة',
    legalStatus: 'شركة ذات مسؤولية محدودة',
    audience: 'المزارعون وشركات الإنتاج الزراعي',
    geoScope: 'محلي',
    customerReason: 'توفير استهلاك المياه وزيادة إنتاجية المحاصيل',
    marketState: 'ينمو بسرعة بسبب التغيرات المناخية',
    competitors: 'حلول الري التقليدية وبعض شركات التقنية الزراعية',
    deliveryChannel: 'تركيب ميداني ودعم عبر الإنترنت',
    revenueModel: 'بيع الأجهزة مع اشتراك سنوي للصيانة',
    acquisitionChannel: 'معارض زراعية وإعلانات رقمية',
    techNeed: 'إنترنت الأشياء، تطبيق جوال، أجهزة استشعار',
    location: 'الرياض',
    budget: '150,000 ريال',
    fundingSource: 'تمويل شخصي ودعم حكومي',
    topExpense: 'تطوير الأجهزة والتقنيات',
    experience: '3 سنوات خبرة في مشاريع ري حديثة',
    teamSize: '5',
    differentiation: 'الدقة في قياس رطوبة التربة والحلول الذاتية',
    pricingModel: 'دفع أولي للأجهزة ثم اشتراك سنوي',
    monthlySalesTarget: '20 جهازاً',
    demandOutlook: 'مرتفع مع تزايد وعي استدامة المياه',
    seasonality: 'زيادة في المواسم الزراعية (الربيع والخريف)',
    risks: 'تكلفة تقنية مرتفعة، ضعف القبول لدى بعض المزارعين',
    twoYearGoal: 'تغطية 40% من المزارع المتوسطة في المنطقة الوسطى'
  })

  const aiTip = `${QUESTION_ITEMS[idx]?.stage ?? 'المرحلة الأولى'} — ${QUESTION_ITEMS[idx]?.title ?? ''}`
  const handleNext = async () => {
    if (idx >= TOTAL_QUESTIONS - 1) {
      const storedProjectId = readStoredProjectId()
      if (!storedProjectId) {
        setBlockedMessage(
          'لا يوجد مشروع مرتبط. أكمل خطوة دراسة السوق أولاً لإنشاء المشروع.',
        )
        return
      }
      setBlockedMessage(null)
      const action = await dispatch(
        submitProjectWizard({ projectId: storedProjectId, answers }),
      )
      if (submitProjectWizard.fulfilled.match(action)) {
        navigate('/app/step3', { replace: true })
      }
      return
    }

    setIdx((i) => Math.min(TOTAL_QUESTIONS - 1, i + 1))
  }

  const submitError = wizardError ?? blockedMessage

  return (
    <AppShell
      activeStep={2}
      progressPercent={40}
      bottomStepLabel="الخطوة ٢ من ٥ — تفاصيل المشروع"
      aiTip={aiTip}
      aiPulseKey={step}
    >
      <ProjectWizardContent
        idx={idx}
        step={step}
        answers={answers}
        onAnswerChange={(key, value) => setAnswers((prev) => ({ ...prev, [key]: value }))}
        onPrev={() => {
          setBlockedMessage(null)
          setIdx((i) => Math.max(0, i - 1))
        }}
        onNext={handleNext}
        isLast={idx >= TOTAL_QUESTIONS - 1}
        isSubmitting={submitting}
        submitError={submitError}
      />
    </AppShell>
  )
}
