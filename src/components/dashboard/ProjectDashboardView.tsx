import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  clearAdminProjectDetails,
  fetchAdminProjectById,
} from '../../store/slices/adminProjectsSlice'
import {
  clearProjectDetails,
  fetchProjectDetails,
  projectDetailsToFeasibilityStudy,
} from '../../store/slices/projectDetailsSlice'
import { PROJECT_ID_STORAGE_KEY } from '../../store/slices/projectStepsSlice'
import StrategicDashboard from './StrategicDashboard'

type ProjectDashboardViewProps = {
  projectId: string | null
  /** Use admin API (`GET project/admin/projects/:id`) when viewing from admin dashboard. */
  mode?: 'user' | 'admin'
}

export default function ProjectDashboardView({
  projectId,
  mode = 'user',
}: ProjectDashboardViewProps) {
  const dispatch = useAppDispatch()
  const isAdminMode = mode === 'admin'

  const userState = useAppSelector((state) => state.projectDetails)
  const adminState = useAppSelector((state) => state.adminProjects.selectedProject)

  const project = isAdminMode ? adminState.data : userState.data
  const loading = isAdminMode ? adminState.loading : userState.loading
  const error = isAdminMode ? adminState.error : userState.error

  useEffect(() => {
    if (!projectId) {
      return
    }

    if (isAdminMode) {
      void dispatch(fetchAdminProjectById(projectId))
      return () => {
        dispatch(clearAdminProjectDetails())
      }
    }

    localStorage.setItem(PROJECT_ID_STORAGE_KEY, projectId)
    void dispatch(fetchProjectDetails(projectId))

    return () => {
      dispatch(clearProjectDetails())
    }
  }, [dispatch, isAdminMode, projectId])

  const study = projectDetailsToFeasibilityStudy(project)

  if (!projectId) {
    return (
      <div className="p-8 text-center text-sm text-slateMuted" dir="rtl">
        اختر مشروعاً لعرض لوحة التحكم.
      </div>
    )
  }

  const handleRetry = () => {
    if (isAdminMode) {
      void dispatch(fetchAdminProjectById(projectId))
      return
    }
    void dispatch(fetchProjectDetails(projectId))
  }

  return (
    <StrategicDashboard
      project={project}
      study={study}
      loading={loading && !project}
      error={error}
      onRetry={handleRetry}
    />
  )
}
