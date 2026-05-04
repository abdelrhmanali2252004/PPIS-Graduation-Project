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
    idea:
      'مقهى متخصص في محافظة أسيوط يقدم قهوة مختصة وحلويات منزلية، مع جلسات هادئة للطلاب والموظفين. نركز على جودة التحميص وخدمة سريعة، ونستهدف من يفضلون التجربة الأفضل على السلاسل الاعتيادية.',
    sector: 'خدمات',
    legalStatus: 'بدأت في التراخيص',
    audience: 'أفراد',
    geoScope: 'محافظة',
    customerReason: 'جودتي أعلى',
    marketState: 'سوق عليه طلب عالي',
    competitors: 'محلات مشابهة في المنطقة',
    deliveryChannel: 'ميكس بين أكثر من قناة',
    revenueModel: 'بيع مباشر',
    acquisitionChannel: 'سوشيال ميديا',
    techNeed: 'متوسط (موقع أو نظام تشغيل)',
    location: 'متوفرين لكن غاليين',
    budget: 'حتى 500 ألف',
    fundingSource: 'تحويشة شخصية',
    topExpense: 'إيجار',
    experience: 'عندنا خبرة عملية',
    teamSize: 'فريق صغير جدا (2-5)',
    differentiation:
      'تحميص محلي أسبوعي وقائمة موسمية، مع برنامج ولاء للطلاب وأوقات ذروة مرنة.',
    pricingModel: 'التكلفة + هامش ربح',
    monthlySalesTarget: 'حتى 50 ألف',
    demandOutlook: 'متوسط',
    seasonality: 'شغال طول السنة',
    risks: 'تغير الأسعار',
    twoYearGoal: 'فتح فروع جديدة',
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
