export function extractSuggestedNames(payload: unknown): string[] {
  if (!payload || typeof payload !== 'object') {
    return []
  }

  const root = payload as Record<string, unknown>
  const data =
    root.data && typeof root.data === 'object'
      ? (root.data as Record<string, unknown>)
      : undefined

  const raw =
    root.suggestedNames ??
    root.suggestedProjectNames ??
    data?.suggestedNames ??
    data?.suggestedProjectNames

  if (!Array.isArray(raw)) {
    return []
  }

  const seen = new Set<string>()
  const names: string[] = []

  for (const item of raw) {
    if (typeof item !== 'string') continue
    const trimmed = item.trim()
    if (!trimmed || seen.has(trimmed)) continue
    seen.add(trimmed)
    names.push(trimmed)
    if (names.length >= 6) break
  }

  return names
}
