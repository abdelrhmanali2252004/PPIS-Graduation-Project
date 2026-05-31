import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  clearProjectDetails,
  fetchProjectDetails,
  projectDetailsToFeasibilityStudy,
} from '../../store/slices/projectDetailsSlice'
import { PROJECT_ID_STORAGE_KEY } from '../../store/slices/projectStepsSlice'
import StrategicDashboard from './StrategicDashboard'

type ProjectDashboardViewProps = {
  projectId: string | null
}

export default function ProjectDashboardView({ projectId }: ProjectDashboardViewProps) {
  const dispatch = useAppDispatch()
  const { data: project, loading, error } = useAppSelector((state) => state.projectDetails)

  useEffect(() => {
    if (!projectId) {
      return
    }

    localStorage.setItem(PROJECT_ID_STORAGE_KEY, projectId)
    void dispatch(fetchProjectDetails(projectId))

    return () => {
      dispatch(clearProjectDetails())
    }
  }, [dispatch, projectId])

  const study = projectDetailsToFeasibilityStudy(project)

  if (!projectId) {
    return (
      <div className="p-8 text-center text-sm text-slateMuted" dir="rtl">
        اختر مشروعاً لعرض لوحة التحكم.
      </div>
    )
  }

  return (
    <StrategicDashboard
      project={project}
      study={study}
      loading={loading && !project}
      error={error}
      onRetry={() => void dispatch(fetchProjectDetails(projectId))}
    />
  )
}
