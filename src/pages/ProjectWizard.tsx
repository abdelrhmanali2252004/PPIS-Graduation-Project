import { useState } from 'react'
import ProjectWizardContent from '../components/project-wizard/ProjectWizardContent'
import { QUESTION_ITEMS, type ProjectAnswers } from '../components/project-wizard/questions'
import { AppShell } from '../layouts/AppShell'
import { submitProjectWizard } from '../store/slices/projectWizardSlice'
import { useAppDispatch } from '../store/hooks'

const TOTAL_QUESTIONS = QUESTION_ITEMS.length

export default function ProjectWizard() {
  const dispatch = useAppDispatch()
  const [idx, setIdx] = useState(0)
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
      await dispatch(submitProjectWizard(answers))
      return
    }

    setIdx((i) => Math.min(TOTAL_QUESTIONS - 1, i + 1))
  }

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
        onPrev={() => setIdx((i) => Math.max(0, i - 1))}
        onNext={handleNext}
        isLast={idx >= TOTAL_QUESTIONS - 1}
      />
    </AppShell>
  )
}
