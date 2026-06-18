import { Navigate, Outlet } from 'react-router-dom'
import { TOKEN_STORAGE_KEY } from '../../api/client'
import { useAppSelector } from '../../store/hooks'

export default function RequireAuth() {
  const token = useAppSelector((state) => state.auth.token)
  const hasToken = Boolean(token ?? localStorage.getItem(TOKEN_STORAGE_KEY))

  if (!hasToken) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
