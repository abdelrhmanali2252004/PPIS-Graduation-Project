import { useEffect } from 'react'
import { Plus } from 'lucide-react'
import {
  NavLink,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom'
import ProjectDashboardView from '../components/dashboard/ProjectDashboardView'
import UserDashboardLayout from '../layouts/UserDashboardLayout'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchUserProjects, type ProjectCard } from '../store/slices/userProjectsSlice'
import { PROJECT_ID_STORAGE_KEY } from '../store/slices/projectStepsSlice'
import ProfileSettingsPage from './ProfileSettingsPage'
import { startNewProject } from '../utils/startNewProject'
import { useLanguage } from '../i18n/LanguageContext'

export default function ExecutiveDashboard() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { projects, loading: projectsLoading, error: projectsError } = useAppSelector(
    (state) => state.userProjects,
  )
  useEffect(() => {
    void dispatch(fetchUserProjects())
  }, [dispatch])

  function handleAddProject() {
    startNewProject(dispatch)
    navigate('/app/step1')
  }

  function handleOpenProject(project: ProjectCard) {
    localStorage.setItem(PROJECT_ID_STORAGE_KEY, project.id)

    if (project.step === 5) {
      navigate(`/dashboard/user/content/${project.id}`)
      return
    }

    const normalizedStep = Number.isFinite(project.step)
      ? Math.min(4, Math.max(1, Math.trunc(project.step)))
      : 1

    navigate(`/app/step${normalizedStep}`)
  }

  return (
    <UserDashboardLayout>
          <Routes>
            <Route path="/" element={<Navigate to="projects" replace />} />
            <Route
              path="projects"
              element={
                <ProjectsPage
                  projects={projects}
                  loading={projectsLoading}
                  error={projectsError}
                  onOpenProject={handleOpenProject}
                  onAddProject={handleAddProject}
                />
              }
            />
            <Route path="profile" element={<ProfileSettingsPage />} />
            <Route path="content" element={<ContentEmptyPage />} />
            <Route path="content/:projectId" element={<ProjectContentPage />} />
            <Route path="*" element={<Navigate to="projects" replace />} />
          </Routes>
    </UserDashboardLayout>
  )
}

function ProjectsPage({
  projects,
  loading,
  error,
  onOpenProject,
  onAddProject,
}: {
  projects: ProjectCard[]
  loading: boolean
  error: string | null
  onOpenProject: (project: ProjectCard) => void
  onAddProject: () => void
}) {
  const { t, dir } = useLanguage()

  return (
    <section className="p-6 lg:p-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-body">{t('dashboard.myProjects')}</h1>
        <button
          type="button"
          onClick={onAddProject}
          className="inline-flex items-center gap-2 rounded-lg bg-nile px-4 py-2 text-sm font-bold text-white"
        >
          <Plus className="h-4 w-4" />
          {t('dashboard.addProject')}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={`project-skeleton-${idx}`}
                className="animate-pulse rounded-2xl border border-divider bg-surface p-5 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="h-5 w-20 rounded-full bg-divider" />
                  <div className="h-4 w-24 rounded bg-slate-100" />
                </div>
                <div className="mb-2 h-5 w-3/4 rounded bg-divider" />
                <div className="h-4 w-1/2 rounded bg-slate-100" />
              </div>
            ))
          : null}

        {!loading && !error && projects.length === 0 ? (
          <div className="rounded-2xl border border-divider bg-surface p-6 text-center shadow-sm md:col-span-2 xl:col-span-3">
            <h3 className="text-base font-bold text-body">{t('dashboard.noProjects')}</h3>
            <p className="mt-2 text-sm text-slateMuted">{t('dashboard.noProjectsDesc')}</p>
          </div>
        ) : null}

        {!loading && error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center md:col-span-2 xl:col-span-3">
            <h3 className="text-base font-bold text-red-700">{error}</h3>
          </div>
        ) : null}

        {projects.map((project) => (
          <button
            key={project.id}
            type="button"
            onClick={() => onOpenProject(project)}
            className={`rounded-2xl border border-divider bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
              dir === 'rtl' ? 'text-right' : 'text-left'
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-full bg-nile/10 px-2.5 py-1 text-[11px] font-semibold text-heading">
                {project.category}
              </span>
              <span className="text-xs text-slateMuted">{project.updatedAt}</span>
            </div>
            <h3 className="mb-2 text-base font-bold text-body">{project.name}</h3>
            <p className="text-sm text-slateMuted">
              {t('dashboard.location')}: {project.location}
            </p>
          </button>
        ))}
      </div>
    </section>
  )
}

function ContentEmptyPage() {
  const { t } = useLanguage()

  return (
    <section className="p-6 lg:p-10">
      <div className="rounded-2xl border border-divider bg-surface p-6 shadow-sm">
        <h2 className="mb-2 text-lg font-bold text-body">{t('dashboard.contentEmpty')}</h2>
        <NavLink to="/dashboard/user/projects" className="text-sm font-semibold text-heading">
          {t('dashboard.goToProjects')}
        </NavLink>
      </div>
    </section>
  )
}

function ProjectContentPage() {
  const { projectId } = useParams<{ projectId: string }>()

  if (!projectId) {
    return <ContentEmptyPage />
  }

  return <ProjectDashboardView projectId={projectId} />
}

