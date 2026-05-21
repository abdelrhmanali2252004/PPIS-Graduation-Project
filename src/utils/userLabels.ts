export function getUserRoleLabel(role: string): string {
  const normalized = role.trim().toLowerCase()

  if (normalized === 'admin') {
    return 'مدير'
  }

  if (normalized === 'user') {
    return 'مستخدم'
  }

  return role
}
