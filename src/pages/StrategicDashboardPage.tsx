import { useEffect } from 'react'
import { AppShell } from '../layouts/AppShell'
import StrategicDashboard from '../components/dashboard/StrategicDashboard'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchFeasibilityStep3 } from '../store/slices/feasibilitySlice'
import { fetchProjectDetails, projectDetailsToFeasibilityStudy } from '../store/slices/projectDetailsSlice'
import { readStoredProjectId } from '../utils/readStoredProjectId'

export default function StrategicDashboardPage() {
  const dispatch = useAppDispatch()
  const projectId = readStoredProjectId()
  const { loading, error, data } = useAppSelector((s) => s.feasibility)
  const projectDetails = useAppSelector((s) => s.projectDetails)

  useEffect(() => {
    if (!projectId) return
    void dispatch(fetchFeasibilityStep3(projectId))
    void dispatch(fetchProjectDetails(projectId))
  }, [dispatch, projectId])

  const study =
    data ?? projectDetailsToFeasibilityStudy(projectDetails.data)
  const projectName =
    projectDetails.data?.name ?? 'مشروعي'
  const isLoading = (loading || projectDetails.loading) && !study

  return (
    <AppShell
      activeStep={5}
      progressPercent={100}
      bottomStepLabel="الخطوة ٥ من ٥ — لوحة التحكم"
      aiTip="راجع المؤشرات المستخرجة من دراسة الجدوى وعدّل خطتك قبل التنفيذ."
      mainScrollable
    >
      <StrategicDashboard
        projectName={projectName}
        study={study}
        loading={isLoading}
        error={error ?? projectDetails.error}
        onRetry={() => {
          if (projectId) {
            void dispatch(fetchFeasibilityStep3(projectId))
            void dispatch(fetchProjectDetails(projectId))
          }
        }}
      />
    </AppShell>
  )
}
