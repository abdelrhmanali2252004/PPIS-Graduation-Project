import { useMemo, useState } from 'react'
import { FolderKanban,  Plus, Settings, User } from 'lucide-react'
import { NavLink, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import ExecutiveDashboardContent, { AlertsPanel } from '../components/dashboard/ExecutiveDashboardContent'
const USER_PAGES = [
  { id: 'profile', label: 'اعداداتي', Icon: Settings, to: '/dashboard/user/profile' },
  { id: 'projects', label: 'مشروعاتي', Icon: FolderKanban, to: '/dashboard/user/projects' },
] as const

type ProjectCard = {
  id: string
  name: string
  category: string
  location: string
  updatedAt: string
}

const DEMO_PROJECTS: ProjectCard[] = [
  {
    id: 'p-asyut-cafe',
    name: 'مطعم أسيوط النموذجي',
    category: 'مطاعم وكافيهات',
    location: 'أسيوط',
    updatedAt: 'اليوم - 11:20 AM',
  },
  {
    id: 'p-retail-mini',
    name: 'متجر سلة إكسبريس',
    category: 'تجزئة غذائية',
    location: 'القاهرة',
    updatedAt: 'منذ يومين',
  },
]

export default function ExecutiveDashboard() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<ProjectCard[]>(DEMO_PROJECTS)

  function handleAddProject() {
    const projectNumber = projects.length + 1
    const newProject: ProjectCard = {
      id: `p-new-${projectNumber}`,
      name: `مشروع جديد ${projectNumber}`,
      category: 'غير محدد',
      location: 'غير محدد',
      updatedAt: 'الآن',
    }
    setProjects((prev) => [newProject, ...prev])
    navigate(`/dashboard/user/content/${newProject.id}`)
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
            <div className="truncate font-medium">رائد أعمال</div>
            <div className="truncate text-xs text-white/60">أسيوط، مصر</div>
          </div>
        </div>
      </aside>

      <div className="relative flex min-w-0 flex-1">
        <main className="min-w-0 flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="projects" replace />} />
            <Route
              path="projects"
              element={<ProjectsPage projects={projects} onOpenProject={(projectId) => navigate(`/dashboard/user/content/${projectId}`)} onAddProject={handleAddProject} />}
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
  onOpenProject,
  onAddProject,
}: {
  projects: ProjectCard[]
  onOpenProject: (projectId: string) => void
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
        {projects.map((project) => (
          <button
            key={project.id}
            type="button"
            onClick={() => onOpenProject(project.id)}
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
