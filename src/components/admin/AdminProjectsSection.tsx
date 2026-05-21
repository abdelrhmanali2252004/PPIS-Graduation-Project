import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchAllAdminProjects } from '../../store/slices/adminProjectsSlice'
import {
  getAdminProjectOwnerEmail,
  getAdminProjectOwnerName,
  getProjectStatusLabel,
} from '../../utils/projectLabels'

export default function AdminProjectsSection() {
  const dispatch = useAppDispatch()
  const { projects, count, loading, error } = useAppSelector((state) => state.adminProjects)

  useEffect(() => {
    void dispatch(fetchAllAdminProjects())
  }, [dispatch])

  return (
    <section className="rounded-2xl border border-divider bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-nile">كل المشاريع على المنصة</h2>
        {!loading && !error ? (
          <span className="rounded-full bg-nile/10 px-2.5 py-1 text-xs font-semibold text-nile">
            {count} مشروع
          </span>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <table className="w-full min-w-[720px] text-right text-sm">
            <thead>
              <tr className="border-b border-divider text-slateMuted">
                <th className="px-2 py-2">المشروع</th>
                <th className="px-2 py-2">المالك</th>
                <th className="px-2 py-2">البريد الإلكتروني</th>
                <th className="px-2 py-2">المرحلة</th>
                <th className="px-2 py-2">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 4 }).map((_, index) => (
                <tr key={`project-skeleton-${index}`} className="border-b border-divider/70">
                  {Array.from({ length: 5 }).map((__, cellIndex) => (
                    <td key={`project-skeleton-cell-${index}-${cellIndex}`} className="px-2 py-3">
                      <div className="h-4 animate-pulse rounded bg-slate-200" />
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
              إعادة المحاولة
            </button>
          </div>
        ) : null}

        {!loading && !error && projects.length === 0 ? (
          <div className="rounded-xl border border-divider bg-offwhite/70 p-6 text-center">
            <p className="text-sm text-slateMuted">لا توجد مشاريع مسجلة حالياً.</p>
          </div>
        ) : null}

        {!loading && !error && projects.length > 0 ? (
          <table className="w-full min-w-[720px] text-right text-sm">
            <thead>
              <tr className="border-b border-divider text-slateMuted">
                <th className="px-2 py-2">المشروع</th>
                <th className="px-2 py-2">المالك</th>
                <th className="px-2 py-2">البريد الإلكتروني</th>
                <th className="px-2 py-2">المرحلة</th>
                <th className="px-2 py-2">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project._id} className="border-b border-divider/70">
                  <td className="px-2 py-3 font-semibold text-body">{project.name}</td>
                  <td className="px-2 py-3 text-body/80">
                    {getAdminProjectOwnerName(project.userId)}
                  </td>
                  <td className="px-2 py-3 text-body/80">
                    {getAdminProjectOwnerEmail(project.userId)}
                  </td>
                  <td className="px-2 py-3">الخطوة {project.step ?? 1}</td>
                  <td className="px-2 py-3">{getProjectStatusLabel(project.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </section>
  )
}
