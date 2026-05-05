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
    idea: '',
    sector: '',
    legalStatus: '',
    audience: '',
    geoScope: '',
    customerReason: '',
    marketState: '',
    competitors: '',
    deliveryChannel: '',
    revenueModel: '',
    acquisitionChannel: '',
    techNeed: '',
    location: '',
    budget: '',
    fundingSource: '',
    topExpense: '',
    experience: '',
    teamSize: '',
    differentiation: '',
    pricingModel: '',
    monthlySalesTarget: '',
    demandOutlook: '',
    seasonality: '',
    risks: '',
    twoYearGoal: '',
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
