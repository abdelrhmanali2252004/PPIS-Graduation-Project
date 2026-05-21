import { Navigate, Outlet } from 'react-router-dom'
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../../api/client'
import { isAdminUser, type AuthUser } from '../../types/auth'
import { useAppSelector } from '../../store/hooks'

function readStoredAuthUser(): AuthUser | null {
  const rawUser = localStorage.getItem(USER_STORAGE_KEY)
  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser) as AuthUser
  } catch {
    return null
  }
}

export default function RequireAdminRole() {
  const authUser = useAppSelector((state) => state.auth.user)
  const token = useAppSelector((state) => state.auth.token)
  const hasToken = Boolean(token ?? localStorage.getItem(TOKEN_STORAGE_KEY))

  if (!hasToken) {
    return <Navigate to="/login" replace />
  }

  const user = authUser ?? readStoredAuthUser()
  if (!isAdminUser(user)) {
    return <Navigate to="/dashboard/user/projects" replace />
  }

  return <Outlet />
}
