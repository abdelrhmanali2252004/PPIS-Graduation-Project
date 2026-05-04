import { useEffect, useState } from 'react'
import FeasibilityContent, { type TabId } from '../components/feasibility/FeasibilityContent'
import { AppShell } from '../layouts/AppShell'
import {
  fetchFeasibilityStep3,
} from '../store/slices/feasibilitySlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { readStoredProjectId } from '../utils/readStoredProjectId'

export default function FeasibilityOutput() {
  const [tab, setTab] = useState<TabId>('summary')
  const dispatch = useAppDispatch()
  const { loading, error, data } = useAppSelector((s) => s.feasibility)
  const projectId = readStoredProjectId()

  useEffect(() => {
    if (!projectId) {
      return
    }
    void dispatch(fetchFeasibilityStep3(projectId))
  }, [dispatch, projectId])

  return (
    <AppShell
      activeStep={3}
      progressPercent={60}
      bottomStepLabel="الخطوة ٣ من ٥ — مخرجات الجدوى"
      mainScrollable
      aiTip="أكثر من ٢٠٠ مشروعاً في صعيد مصر تم تحليلها في قاعدة المعرفة — هامش الربح لكافيهات أسيوط أعلى من المتوسط عند التركيز على التجزئة."
    >
      <FeasibilityContent
        tab={tab}
        onTabChange={setTab}
        projectMissing={!projectId}
        loading={loading}
        error={error}
        study={data}
        onRetry={() => {
          if (projectId) {
            void dispatch(fetchFeasibilityStep3(projectId))
          }
        }}
      />
    </AppShell>
  )
}
