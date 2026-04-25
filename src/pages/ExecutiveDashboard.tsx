import { useEffect, useMemo } from 'react'
import { FolderKanban,  Plus, Settings, User } from 'lucide-react'
import { NavLink, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import ExecutiveDashboardContent, { AlertsPanel } from '../components/dashboard/ExecutiveDashboardContent'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchUserProjects, type ProjectCard } from '../store/slices/userProjectsSlice'
import { PROJECT_ID_STORAGE_KEY } from '../store/slices/projectStepsSlice'
const USER_PAGES = [
  { id: 'profile', label: 'اعداداتي', Icon: Settings, to: '/dashboard/user/profile' },
  { id: 'projects', label: 'مشروعاتي', Icon: FolderKanban, to: '/dashboard/user/projects' },
] as const

export default function ExecutiveDashboard() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { projects, loading: projectsLoading, error: projectsError } = useAppSelector(
    (state) => state.userProjects,
  )
  const sidebarUser = useMemo(() => {
    const fallback = {
      name: 'رائد أعمال',
      email: 'No email',
    }

    const rawUser = localStorage.getItem('ideaTechUserData')
    if (!rawUser) {
      return fallback
    }

    try {
      const parsedUser = JSON.parse(rawUser) as { name?: string; email?: string }

      return {
        name: parsedUser.name?.trim() || fallback.name,
        email: parsedUser.email?.trim() || fallback.email,
      }
    } catch {
      return fallback
    }
  }, [])

  useEffect(() => {
    void dispatch(fetchUserProjects())
  }, [dispatch])

  function handleAddProject() {
    navigate('/app/step1')
  }

  function handleOpenProject(project: ProjectCard) {
    const normalizedStep = Number.isFinite(project.step)
      ? Math.min(5, Math.max(1, Math.trunc(project.step)))
      : 1

    localStorage.setItem(PROJECT_ID_STORAGE_KEY, project.id)
    navigate(`/app/step${normalizedStep}`)
  }



  

  return (
    <div dir="rtl" className="flex h-screen overflow-hidden bg-offwhite font-cairo">
      <aside className="flex w-[260px] shrink-0 flex-col border-l border-divider bg-nile text-white">
        <div className="border-b border-white/15 px-5 py-5">
          <h2 className="text-sm font-bold">User Dashboard</h2>
          <p className="mt-1 text-xs text-white/70">فكرة TECH</p>
        </div>

        <nav className="space-y-2 p-3">
          {USER_PAGES.map(({ id, label, Icon, to }) => (
            <NavLink
              key={id}
              to={to}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive ? 'bg-white/15 font-semibold text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4 text-gold" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto flex items-center gap-2 border-t border-white/15 px-4 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
            <User className="h-5 w-5 text-gold" />
          </div>
          <div className="min-w-0 text-sm">
            <div className="truncate font-medium">{sidebarUser.name}</div>
            <div className="truncate text-xs text-white/60">{sidebarUser.email}</div>
          </div>
        </div>
      </aside>

      <div className="relative flex min-w-0 flex-1">
        <main className="min-w-0 flex-1 overflow-y-auto">
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
            <Route path="profile" element={<ProfilePage />} />
            <Route path="content" element={<ContentEmptyPage />} />
            <Route path="content/:projectId" element={<ProjectContentPage projects={projects} />} />
            <Route path="*" element={<Navigate to="projects" replace />} />
          </Routes>
        </main>

        <AlertsPanel />
      </div>
    </div>
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
  return (
    <section className="p-6 lg:p-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-body">My Projects</h1>
        <button
          type="button"
          onClick={onAddProject}
          className="inline-flex items-center gap-2 rounded-lg bg-nile px-4 py-2 text-sm font-bold text-white"
        >
          <Plus className="h-4 w-4" />
          Add New Project
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={`project-skeleton-${idx}`}
                className="animate-pulse rounded-2xl border border-divider bg-white p-5 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="h-5 w-20 rounded-full bg-slate-200" />
                  <div className="h-4 w-24 rounded bg-slate-100" />
                </div>
                <div className="mb-2 h-5 w-3/4 rounded bg-slate-200" />
                <div className="h-4 w-1/2 rounded bg-slate-100" />
              </div>
            ))
          : null}

        {!loading && !error && projects.length === 0 ? (
          <div className="rounded-2xl border border-divider bg-white p-6 text-center shadow-sm md:col-span-2 xl:col-span-3">
            <h3 className="text-base font-bold text-body">لا توجد مشروعات حالياً</h3>
            <p className="mt-2 text-sm text-slateMuted">
              لم يتم العثور على بيانات مشروعات لهذا المستخدم.
            </p>
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
            className="rounded-2xl border border-divider bg-white p-5 text-right shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-full bg-nile/10 px-2.5 py-1 text-[11px] font-semibold text-nile">
                {project.category}
              </span>
              <span className="text-xs text-slateMuted">{project.updatedAt}</span>
            </div>
            <h3 className="mb-2 text-base font-bold text-body">{project.name}</h3>
            <p className="text-sm text-slateMuted">الموقع: {project.location}</p>
          </button>
        ))}
      </div>
    </section>
  )
}

function ProfilePage() {
  return (
    <section className="p-6 lg:p-10">
      <h1 className="mb-4 text-2xl font-bold text-body">Profile Settings</h1>
      <div className="max-w-2xl rounded-2xl border border-divider bg-white p-6 shadow-sm">
        <p className="text-sm text-slateMuted">يمكن تعديل إعدادات الحساب والملف الشخصي هنا.</p>
      </div>
    </section>
  )
}

function ContentEmptyPage() {
  return (
    <section className="p-6 lg:p-10">
      <div className="rounded-2xl border border-divider bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-lg font-bold text-body">اختر مشروعا لعرض المحتوى</h2>
        <NavLink to="/dashboard/user/projects" className="text-sm font-semibold text-nile">
          الانتقال إلى My Projects
        </NavLink>
      </div>
    </section>
  )
}

function ProjectContentPage({ projects }: { projects: ProjectCard[] }) {
  const { projectId } = useParams<{ projectId: string }>()

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === projectId) ?? null,
    [projects, projectId],
  )

  if (!selectedProject) {
    return <ContentEmptyPage />
  }

  return (
    <div>
      <div className="border-b border-divider bg-white px-6 py-4 lg:px-10">
        <div className="text-xs text-slateMuted">المشروع الحالي</div>
        <h2 className="text-lg font-bold text-body">{selectedProject.name}</h2>
      </div>
      <ExecutiveDashboardContent />
    </div>
  )
}
