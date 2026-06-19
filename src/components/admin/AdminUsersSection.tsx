import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchAllAdminUsers } from '../../store/slices/adminUsersSlice'
import { getUserRoleLabel } from '../../utils/userLabels'

export default function AdminUsersSection() {
  const dispatch = useAppDispatch()
  const { users, count, loading, error } = useAppSelector((state) => state.adminUsers)

  useEffect(() => {
    void dispatch(fetchAllAdminUsers())
  }, [dispatch])

  return (
    <section className="rounded-2xl border border-divider bg-surface p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-heading">كل المستخدمين وتفاصيلهم</h2>
        {!loading && !error ? (
          <span className="rounded-full bg-nile/10 px-2.5 py-1 text-xs font-semibold text-heading">
            {count} مستخدم
          </span>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <table className="w-full min-w-[720px] text-right text-sm">
            <thead>
              <tr className="border-b border-divider text-slateMuted">
                <th className="px-2 py-2">الاسم</th>
                <th className="px-2 py-2">البريد الإلكتروني</th>
                <th className="px-2 py-2">رقم الهاتف</th>
                <th className="px-2 py-2">الدور</th>
                <th className="px-2 py-2">عدد المشاريع</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 4 }).map((_, index) => (
                <tr key={`user-skeleton-${index}`} className="border-b border-divider/70">
                  {Array.from({ length: 5 }).map((__, cellIndex) => (
                    <td key={`user-skeleton-cell-${index}-${cellIndex}`} className="px-2 py-3">
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
              onClick={() => void dispatch(fetchAllAdminUsers())}
              className="mt-3 rounded-lg bg-nile px-4 py-2 text-xs font-bold text-white"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : null}

        {!loading && !error && users.length === 0 ? (
          <div className="rounded-xl border border-divider bg-offwhite/70 p-6 text-center">
            <p className="text-sm text-slateMuted">لا يوجد مستخدمون مسجلون حالياً.</p>
          </div>
        ) : null}

        {!loading && !error && users.length > 0 ? (
          <table className="w-full min-w-[720px] text-right text-sm">
            <thead>
              <tr className="border-b border-divider text-slateMuted">
                <th className="px-2 py-2">الاسم</th>
                <th className="px-2 py-2">البريد الإلكتروني</th>
                <th className="px-2 py-2">رقم الهاتف</th>
                <th className="px-2 py-2">الدور</th>
                <th className="px-2 py-2">عدد المشاريع</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-divider/70">
                  <td className="px-2 py-3 font-semibold text-body">{user.name}</td>
                  <td className="px-2 py-3 text-body/80">{user.email}</td>
                  <td className="px-2 py-3">{user.phoneNumber || '—'}</td>
                  <td className="px-2 py-3 text-heading">{getUserRoleLabel(user.role)}</td>
                  <td className="px-2 py-3">{user.projectCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </section>
  )
}
