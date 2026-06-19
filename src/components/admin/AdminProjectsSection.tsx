import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchAllAdminProjects } from '../../store/slices/adminProjectsSlice'
import { useTranslation } from '../../i18n/LanguageContext'
import {
  getAdminProjectOwnerEmail,
  getAdminProjectOwnerName,
  getProjectStatusLabel,
  isProjectDashboardReady,
} from '../../utils/projectLabels'

export default function AdminProjectsSection() {
  const dispatch = useAppDispatch()
  const { projects, count, loading, error } = useAppSelector((state) => state.adminProjects)
  const { t, dir } = useTranslation()

  useEffect(() => {
    void dispatch(fetchAllAdminProjects())
  }, [dispatch])

  const tableAlign = dir === 'rtl' ? 'text-right' : 'text-left'

  return (
    <section className="rounded-2xl border border-divider bg-surface p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-heading">{t('admin.projectsTitle')}</h2>
        {!loading && !error ? (
          <span className="rounded-full bg-nile/10 px-2.5 py-1 text-xs font-semibold text-heading">
            {count} {t('admin.projects')}
          </span>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <table className={`w-full min-w-[860px] text-sm ${tableAlign}`}>
            <thead>
              <tr className="border-b border-divider text-slateMuted">
                <th className="px-2 py-2">{t('admin.table.project')}</th>
                <th className="px-2 py-2">{t('admin.table.owner')}</th>
                <th className="px-2 py-2">{t('common.email')}</th>
                <th className="px-2 py-2">{t('admin.table.step')}</th>
                <th className="px-2 py-2">{t('admin.table.status')}</th>
                <th className="px-2 py-2">{t('admin.dashboard')}</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 4 }).map((_, index) => (
                <tr key={`project-skeleton-${index}`} className="border-b border-divider/70">
                  {Array.from({ length: 6 }).map((__, cellIndex) => (
                    <td key={`project-skeleton-cell-${index}-${cellIndex}`} className="px-2 py-3">
                      <div className="h-4 animate-pulse rounded bg-divider" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}

        {!loading && error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center">
            <p className="text-sm font-semibold text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => void dispatch(fetchAllAdminProjects())}
              className="mt-3 rounded-lg bg-nile px-4 py-2 text-xs font-bold text-white"
            >
              {t('admin.retry')}
            </button>
          </div>
        ) : null}

        {!loading && !error && projects.length === 0 ? (
          <div className="rounded-xl border border-divider bg-offwhite/70 p-6 text-center">
            <p className="text-sm text-slateMuted">{t('admin.noProjects')}</p>
          </div>
        ) : null}

        {!loading && !error && projects.length > 0 ? (
          <table className={`w-full min-w-[860px] text-sm ${tableAlign}`}>
            <thead>
              <tr className="border-b border-divider text-slateMuted">
                <th className="px-2 py-2">{t('admin.table.project')}</th>
                <th className="px-2 py-2">{t('admin.table.owner')}</th>
                <th className="px-2 py-2">{t('common.email')}</th>
                <th className="px-2 py-2">{t('admin.table.step')}</th>
                <th className="px-2 py-2">{t('admin.table.status')}</th>
                <th className="px-2 py-2">{t('admin.dashboard')}</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const dashboardReady = isProjectDashboardReady(project.step)

                return (
                  <tr key={project._id} className="border-b border-divider/70">
                    <td className="px-2 py-3 font-semibold text-body">{project.name}</td>
                    <td className="px-2 py-3 text-body/80">
                      {getAdminProjectOwnerName(project.userId)}
                    </td>
                    <td className="px-2 py-3 text-body/80">
                      {getAdminProjectOwnerEmail(project.userId)}
                    </td>
                    <td className="px-2 py-3">
                      {t('admin.table.step')} {project.step ?? 1}
                    </td>
                    <td className="px-2 py-3">{getProjectStatusLabel(project.status)}</td>
                    <td className="px-2 py-3">
                      {dashboardReady ? (
                        <Link
                          to={`/dashboard/admin/projects/${project._id}/dashboard`}
                          className="inline-flex items-center gap-1 font-semibold text-heading transition-colors hover:text-gold hover:underline"
                        >
                          {t('admin.viewDashboard')}
                        </Link>
                      ) : (
                        <span
                          className="cursor-not-allowed text-slateMuted"
                          title={t('admin.dashboardIncompleteHint')}
                        >
                          {t('admin.dashboardIncomplete')}
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : null}
      </div>
    </section>
  )
}
