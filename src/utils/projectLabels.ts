export function getProjectStatusLabel(status: number): string {
  return status === 1 ? 'نشط' : 'غير نشط'
}

export function isProjectDashboardReady(step?: number | null): boolean {
  if (!Number.isFinite(step)) {
    return false
  }

  return Math.trunc(step as number) >= 5
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
