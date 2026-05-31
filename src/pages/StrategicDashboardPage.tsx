import UserDashboardLayout from '../layouts/UserDashboardLayout'
import ProjectDashboardView from '../components/dashboard/ProjectDashboardView'
import { readStoredProjectId } from '../utils/readStoredProjectId'

export default function StrategicDashboardPage() {
  const projectId = readStoredProjectId()

  return (
    <UserDashboardLayout>
      <ProjectDashboardView projectId={projectId} />
    </UserDashboardLayout>
  )
}
