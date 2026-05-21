import { useEffect, useState } from 'react'
import { Mail, MessageCircle, Phone, X } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  clearUpdateStatusError,
  updateAdminRequestStatus,
} from '../../store/slices/adminRequestsSlice'
import type { ServiceRequestRecord, ServiceRequestStatus } from '../../types/serviceRequest'
import { toMailtoHref, toWhatsAppHref } from '../../utils/contactLinks'
import {
  getRequestStatusLabel,
  getRequestTypeLabel,
  REQUEST_STATUS_OPTIONS,
} from '../../utils/serviceRequestLabels'

type AdminRequestContactModalProps = {
  request: ServiceRequestRecord
  onClose: () => void
}

function isRequestStatus(value: string): value is ServiceRequestStatus {
  return REQUEST_STATUS_OPTIONS.some((option) => option.value === value)
}

export default function AdminRequestContactModal({
  request,
  onClose,
}: AdminRequestContactModalProps) {
  const dispatch = useAppDispatch()
  const { updatingStatusId, updateStatusError } = useAppSelector((state) => state.adminRequests)
  const [selectedStatus, setSelectedStatus] = useState<ServiceRequestStatus>(
    isRequestStatus(request.status) ? request.status : 'PENDING',
  )

  const userName = request.userId?.name?.trim() || 'مستخدم غير معروف'
  const userEmail = request.userId?.email?.trim()
  const userPhone = request.userId?.phoneNumber?.trim()
  const projectName = request.projectId?.name ?? 'بدون مشروع'
  const isSaving = updatingStatusId === request._id
  const hasStatusChange = selectedStatus !== request.status

  useEffect(() => {
    setSelectedStatus(isRequestStatus(request.status) ? request.status : 'PENDING')
  }, [request._id, request.status])

  useEffect(() => {
    return () => {
      dispatch(clearUpdateStatusError())
    }
  }, [dispatch])

  async function handleSaveStatus() {
    if (!hasStatusChange || isSaving) {
      return
    }

    const action = await dispatch(
      updateAdminRequestStatus({
        requestId: request._id,
        status: selectedStatus,
      }),
    )

    if (updateAdminRequestStatus.fulfilled.match(action)) {
      dispatch(clearUpdateStatusError())
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 text-right shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-contact-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 id="request-contact-title" className="text-lg font-bold text-nile">
              بيانات التواصل
            </h3>
            <p className="mt-1 text-sm text-slateMuted">
              {getRequestTypeLabel(request.type)} — {projectName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-divider p-1.5 text-slateMuted transition hover:text-nile"
            aria-label="إغلاق"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-4 rounded-xl border border-divider bg-offwhite/70 p-4">
          <label htmlFor="request-status" className="mb-2 block text-xs font-semibold text-slateMuted">
            حالة الطلب
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <select
              id="request-status"
              value={selectedStatus}
              onChange={(event) => {
                const value = event.target.value
                if (isRequestStatus(value)) {
                  setSelectedStatus(value)
                }
              }}
              disabled={isSaving}
              className="min-w-[180px] flex-1 rounded-xl border border-divider bg-white px-3 py-2.5 text-sm font-semibold text-body outline-none transition focus:border-nile focus:ring-2 focus:ring-nile/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {REQUEST_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => void handleSaveStatus()}
              disabled={!hasStatusChange || isSaving}
              className="rounded-lg bg-nile px-4 py-2.5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? 'جاري الحفظ...' : 'حفظ الحالة'}
            </button>
          </div>
          <p className="mt-2 text-xs text-slateMuted">
            الحالة الحالية: {getRequestStatusLabel(request.status)}
          </p>
          {updateStatusError ? (
            <p className="mt-2 text-xs font-semibold text-red-600">{updateStatusError}</p>
          ) : null}
        </div>

        <div className="space-y-4 rounded-xl border border-divider bg-offwhite/70 p-4 text-sm">
          <div>
            <p className="mb-1 text-xs font-semibold text-slateMuted">الاسم</p>
            <p className="font-semibold text-body">{userName}</p>
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold text-slateMuted">البريد الإلكتروني</p>
            {userEmail ? (
              <a
                href={toMailtoHref(userEmail)}
                className="inline-flex items-center gap-2 font-semibold text-nile hover:text-gold"
              >
                <Mail className="h-4 w-4" />
                {userEmail}
              </a>
            ) : (
              <p className="text-slateMuted">غير متوفر</p>
            )}
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold text-slateMuted">رقم الهاتف</p>
            {userPhone ? (
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 font-semibold text-body">
                  <Phone className="h-4 w-4 text-nile" />
                  {userPhone}
                </span>
                <a
                  href={toWhatsAppHref(userPhone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white hover:opacity-90"
                >
                  <MessageCircle className="h-4 w-4" />
                  واتساب
                </a>
              </div>
            ) : (
              <p className="text-slateMuted">غير متوفر</p>
            )}
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-divider px-4 py-2 text-sm font-semibold text-body"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  )
}
