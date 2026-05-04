import { PROJECT_ID_STORAGE_KEY } from '../store/slices/projectStepsSlice'

export function readStoredProjectId(): string | null {
  const raw = localStorage.getItem(PROJECT_ID_STORAGE_KEY)
  const id = typeof raw === 'string' ? raw.trim() : ''
  return id || null
}
