import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import ProtectedRoute from './ProtectedRoute'
import HomePage from '../pages/HomePage'
import BrowsePage from '../pages/BrowsePage'
import GameDetailPage from '../pages/GameDetailPage'
import LibraryPage from '../pages/LibraryPage'
import WishlistPage from '../pages/WishlistPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage'
import NotFoundPage from '../pages/NotFoundPage'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Main Layout Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="browse" element={<BrowsePage />} />
        <Route path="game/:slug" element={<GameDetailPage />} />

        {/* Protected Routes */}
        <Route
          path="library"
          element={
            <ProtectedRoute>
              <LibraryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="wishlist"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Auth Layout Routes */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
      </Route>
    </Routes>
  )
}
