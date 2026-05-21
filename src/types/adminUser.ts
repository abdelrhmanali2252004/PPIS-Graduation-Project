export type AdminUserRecord = {
  id: string
  name: string
  email: string
  phoneNumber: string
  role: string
  projectCount: number
}

export type AllAdminUsersResponse = {
  message: string
  count: number
  data: AdminUserRecord[]
}
