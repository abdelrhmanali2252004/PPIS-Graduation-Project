export type UserRole = 'user' | 'admin'

export type AuthUser = {
  id: string
  email: string
  name?: string
  phoneNumber?: string
  secondaryPhoneNumber?: string | null
  role?: string
}

export function getRoleLabel(role?: string | null): string {
  switch (role?.trim().toLowerCase()) {
    case 'admin':
      return 'مدير'
    case 'specialist':
      return 'متخصص'
    default:
      return 'مستخدم'
  }
}

export function normalizeUserRole(role?: string | null): UserRole {
  return role?.trim().toLowerCase() === 'admin' ? 'admin' : 'user'
}

export function getUserRole(user: AuthUser | null | undefined): UserRole {
  return normalizeUserRole(user?.role)
}

export function isAdminUser(user: AuthUser | null | undefined): boolean {
  return getUserRole(user) === 'admin'
}

export function getDashboardHomePath(role: UserRole): string {
  return role === 'admin' ? '/dashboard/admin/users' : '/dashboard/user/projects'
}
