import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import AccessDeniedPage from '../pages/AccessDeniedPage'

export default function AdminRoute() {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (user?.role !== 'admin') {
    return <AccessDeniedPage />
  }

  return <Outlet />
}
