import { Link, useParams } from 'react-router-dom'
import ProjectDashboardView from '../components/dashboard/ProjectDashboardView'
import { useTranslation } from '../i18n/LanguageContext'

export default function AdminProjectDashboardPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const { t } = useTranslation()

  return (
    <section>
      <Link
        to="/dashboard/admin/projects"
        className="mb-4 inline-flex text-sm font-semibold text-heading transition-colors hover:text-gold"
      >
        ← {t('admin.backToProjects')}
      </Link>
      <ProjectDashboardView projectId={projectId ?? null} mode="admin" />
    </section>
  )
}
