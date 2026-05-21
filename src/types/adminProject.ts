export type AdminProjectOwner = {
  _id: string
  name?: string
  email?: string
  phoneNumber?: string
  role?: string
}

export type AdminProjectRecord = {
  _id: string
  name: string
  status: number
  step: number
  userId: AdminProjectOwner | string | null
  questionAnswers?: string[]
  feasibilityPrompt?: string | null
  feasibilityResponse?: unknown
  logoUrl?: string | null
  logoPrompt?: string | null
}

export type AllAdminProjectsResponse = {
  message: string
  count: number
  data: AdminProjectRecord[]
}
