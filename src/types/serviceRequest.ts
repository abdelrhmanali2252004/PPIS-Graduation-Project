export type ServiceRequestType = 'MARKET_RESEARCH' | 'MANUAL_LOGO' | 'CONSULTATION'

export type ServiceRequestStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'

export const SERVICE_REQUEST_STATUSES: ServiceRequestStatus[] = [
  'PENDING',
  'APPROVED',
  'REJECTED',
  'IN_PROGRESS',
  'COMPLETED',
]

export type ServiceRequestProject = {
  _id: string
  name?: string
  step?: number
  status?: number
}

export type ServiceRequestUser = {
  _id: string
  name?: string
  email?: string
  phoneNumber?: string
  role?: string
}

export type ServiceRequestRecord = {
  _id: string
  projectId: ServiceRequestProject | null
  userId: ServiceRequestUser | null
  type: ServiceRequestType | string
  status: ServiceRequestStatus
  adminNotes?: string
  createdAt: string
  updatedAt?: string
}

export type AllServiceRequestsResponse = {
  message: string
  count: number
  data: ServiceRequestRecord[]
}
