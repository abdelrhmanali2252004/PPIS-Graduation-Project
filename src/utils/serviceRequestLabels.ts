import {
  SERVICE_REQUEST_STATUSES,
  type ServiceRequestStatus,
  type ServiceRequestType,
} from '../types/serviceRequest'

const REQUEST_TYPE_LABELS: Record<string, string> = {
  MARKET_RESEARCH: 'دراسة السوق',
  MANUAL_LOGO: 'تصميم شعار يدوي',
  CONSULTATION: 'استشارة',
}
const REQUEST_STATUS_LABELS: Record<ServiceRequestStatus, string> = {
  PENDING: 'قيد الانتظار',
  APPROVED: 'موافق عليه',
  REJECTED: 'مرفوض',
  IN_PROGRESS: 'قيد التنفيذ',
  COMPLETED: 'مكتمل',
}

export const REQUEST_STATUS_OPTIONS = SERVICE_REQUEST_STATUSES.map((value) => ({
  value,
  label: REQUEST_STATUS_LABELS[value],
}))

export function getRequestTypeLabel(type: ServiceRequestType | string): string {
  return REQUEST_TYPE_LABELS[type] ?? type
}

export function getRequestStatusLabel(status: ServiceRequestStatus | string): string {
  return REQUEST_STATUS_LABELS[status as ServiceRequestStatus] ?? status
}

export function isContactableRequestType(type: ServiceRequestType | string): boolean {
  return type === 'MARKET_RESEARCH' || type === 'MANUAL_LOGO'
}

export function formatRequestDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
