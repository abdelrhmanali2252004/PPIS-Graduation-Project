import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchAllAdminRequests } from '../../store/slices/adminRequestsSlice'
import type { ServiceRequestRecord } from '../../types/serviceRequest'
import {
  formatRequestDate,
  getRequestStatusLabel,
  getRequestTypeLabel,
  isContactableRequestType,
} from '../../utils/serviceRequestLabels'
import AdminRequestContactModal from './AdminRequestContactModal'

export default function AdminRequestsSection() {
  const dispatch = useAppDispatch()
  const { requests, count, loading, error } = useAppSelector((state) => state.adminRequests)
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)

  const selectedRequest = useMemo(
    () =>
      selectedRequestId
        ? requests.find((request) => request._id === selectedRequestId) ?? null
        : null,
    [requests, selectedRequestId],
  )

  useEffect(() => {
    void dispatch(fetchAllAdminRequests())
  }, [dispatch])

  function handleRequestClick(request: ServiceRequestRecord) {
    if (!isContactableRequestType(request.type)) {
      return
    }

    setSelectedRequestId(request._id)
  }

  function handleCloseModal() {
    setSelectedRequestId(null)
  }

  return (
    <>
      <section className="rounded-2xl border border-divider bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-nile">طلبات المستخدمين للتواصل مع المختص</h2>
          {!loading && !error ? (
            <span className="rounded-full bg-nile/10 px-2.5 py-1 text-xs font-semibold text-nile">
              {count} طلب
            </span>
          ) : null}
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`request-skeleton-${index}`}
                className="animate-pulse rounded-xl border border-divider bg-offwhite/70 p-4"
              >
                <div className="mb-3 h-4 w-1/3 rounded bg-slate-200" />
                <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                  <div className="h-3 rounded bg-slate-100" />
                  <div className="h-3 rounded bg-slate-100" />
                  <div className="h-3 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {!loading && error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-center">
            <p className="text-sm font-semibold text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => void dispatch(fetchAllAdminRequests())}
              className="mt-3 rounded-lg bg-nile px-4 py-2 text-xs font-bold text-white"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : null}

        {!loading && !error && requests.length === 0 ? (
          <div className="rounded-xl border border-divider bg-offwhite/70 p-6 text-center">
            <p className="text-sm text-slateMuted">لا توجد طلبات مسجلة حالياً.</p>
          </div>
        ) : null}

        {!loading && !error && requests.length > 0 ? (
          <div className="space-y-3">
            {requests.map((request) => {
              const userName = request.userId?.name ?? 'مستخدم غير معروف'
              const userEmail = request.userId?.email
              const projectName = request.projectId?.name ?? 'بدون مشروع'
              const createdAt = formatRequestDate(request.createdAt)
              const isContactable = isContactableRequestType(request.type)

              return (
                <article
                  key={request._id}
                  role={isContactable ? 'button' : undefined}
                  tabIndex={isContactable ? 0 : undefined}
                  onClick={() => handleRequestClick(request)}
                  onKeyDown={(event) => {
                    if (!isContactable) return
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      handleRequestClick(request)
                    }
                  }}
                  className={`rounded-xl border border-divider bg-offwhite/70 p-4 transition ${
                    isContactable
                      ? 'cursor-pointer hover:border-nile/40 hover:bg-white hover:shadow-sm'
                      : ''
                  }`}
                >
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-body">{projectName}</h3>
                    <span className="rounded-md bg-white px-2 py-1 text-xs text-slateMuted">
                      {createdAt}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-sm text-body/90 md:grid-cols-3">
                    <p>
                      <span className="font-semibold text-nile">المستخدم:</span> {userName}
                      {userEmail ? (
                        <span className="mt-0.5 block text-xs text-slateMuted">{userEmail}</span>
                      ) : null}
                    </p>
                    <p>
                      <span className="font-semibold text-nile">نوع الطلب:</span>{' '}
                      {getRequestTypeLabel(request.type)}
                    </p>
                    <p>
                      <span className="font-semibold text-nile">الحالة:</span>{' '}
                      {getRequestStatusLabel(request.status)}
                    </p>
                  </div>
                  {isContactable ? (
                    <p className="mt-2 text-xs font-semibold text-nile">اضغط لعرض بيانات التواصل</p>
                  ) : null}
                </article>
              )
            })}
          </div>
        ) : null}
      </section>

      {selectedRequest ? (
        <AdminRequestContactModal request={selectedRequest} onClose={handleCloseModal} />
      ) : null}
    </>
  )
}
