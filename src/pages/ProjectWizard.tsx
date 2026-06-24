import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProjectWizardContent from '../components/project-wizard/ProjectWizardContent'
import { QUESTION_PHASES } from '../components/project-wizard/questions'
import { createEmptyProjectAnswers } from '../utils/wizardDefaults'
import { AppShell } from '../layouts/AppShell'
import {
  resetProjectWizardState,
  submitProjectWizard,
} from '../store/slices/projectWizardSlice'
import { fetchSuggestedProjectNames } from '../store/slices/projectStepsSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { readStoredProjectId } from '../utils/readStoredProjectId'

const TOTAL_PHASES = QUESTION_PHASES.length

export default function ProjectWizard() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { loading: submitting, error: wizardError } = useAppSelector(
    (s) => s.projectWizard,
  )
  const sessionVersion = useAppSelector((s) => s.projectSteps.sessionVersion)
  const { suggestedProjectNames, loadingSuggestedNames } = useAppSelector(
    (s) => s.projectSteps,
  )
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null)
  const [answers, setAnswers] = useState(createEmptyProjectAnswers)

  useEffect(() => {
    dispatch(resetProjectWizardState())
  }, [dispatch])

  useEffect(() => {
    setPhaseIdx(0)
    setBlockedMessage(null)
    setAnswers(createEmptyProjectAnswers())
  }, [sessionVersion])

  useEffect(() => {
    const projectId = readStoredProjectId()
    if (projectId) {
      void dispatch(fetchSuggestedProjectNames(projectId))
    }
  }, [dispatch, sessionVersion])

  const currentPhase = QUESTION_PHASES[phaseIdx]
  const aiTip = `${currentPhase?.titleAr ?? ''} — ${currentPhase?.description ?? ''}`

  const handleNext = async () => {
    if (phaseIdx >= TOTAL_PHASES - 1) {
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

    setPhaseIdx((i) => Math.min(TOTAL_PHASES - 1, i + 1))
  }

  const submitError = wizardError ?? blockedMessage

  return (
    <AppShell
      activeStep={2}
      progressPercent={40}
      bottomStepLabel="الخطوة ٢ من ٥ — تفاصيل المشروع"
      aiTip={aiTip}
      aiPulseKey={phaseIdx}
    >
      <ProjectWizardContent
        phaseIdx={phaseIdx}
        answers={answers}
        suggestedProjectNames={suggestedProjectNames}
        loadingSuggestedNames={loadingSuggestedNames}
        onAnswerChange={(key, value) => setAnswers((prev) => ({ ...prev, [key]: value }))}
        onPrev={() => {
          setBlockedMessage(null)
          setPhaseIdx((i) => Math.max(0, i - 1))
        }}
        onNext={handleNext}
        isLastPhase={phaseIdx >= TOTAL_PHASES - 1}
        isSubmitting={submitting}
        submitError={submitError}
      />
    </AppShell>
  )
}
