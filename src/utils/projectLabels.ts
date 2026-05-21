export function getProjectStatusLabel(status: number): string {
  return status === 1 ? 'نشط' : 'غير نشط'
}

export function getAdminProjectOwnerName(
  userId: { name?: string } | string | null | undefined,
): string {
  if (!userId || typeof userId === 'string') {
    return 'غير معروف'
  }

  return userId.name?.trim() || 'غير معروف'
}

export function getAdminProjectOwnerEmail(
  userId: { email?: string } | string | null | undefined,
): string {
  if (!userId || typeof userId === 'string') {
    return '—'
  }

  return userId.email?.trim() || '—'
}
