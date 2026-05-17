import StrategicDashboard from './StrategicDashboard'
import type { FeasibilityStep3Response } from '../../store/slices/feasibilitySlice'

export type ExecutiveDashboardContentProps = {
  projectId: string | null
  projectName: string
  loading: boolean
  error: string | null
  study: FeasibilityStep3Response | null
  logoUrl?: string | null
  logoPrompt?: string | null
  onRetry: () => void
}


export default function ExecutiveDashboardContent({
  projectName,
  loading,
  error,
  study,
  onRetry,
}: ExecutiveDashboardContentProps) {
  return (
    <StrategicDashboard
      projectName={projectName}
      study={study}
      loading={loading}
      error={error}
      onRetry={onRetry}
    />
  )
}
