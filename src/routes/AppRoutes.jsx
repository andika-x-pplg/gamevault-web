import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import AdminLayout from '../layouts/AdminLayout'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'

// Public & Auth Pages
import HomePage from '../pages/HomePage'
import BrowsePage from '../pages/BrowsePage'
import GameDetailPage from '../pages/GameDetailPage'
import LibraryPage from '../pages/LibraryPage'
import WishlistPage from '../pages/WishlistPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage'
import NotFoundPage from '../pages/NotFoundPage'

// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import AdminGamesPage from '../pages/admin/AdminGamesPage'
import AdminGameFormPage from '../pages/admin/AdminGameFormPage'
import AdminCategoriesPage from '../pages/admin/AdminCategoriesPage'
import AdminUsersPage from '../pages/admin/AdminUsersPage'
import AdminDownloadsPage from '../pages/admin/AdminDownloadsPage'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Main Layout Routes (Public) */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="browse" element={<BrowsePage />} />
        <Route path="game/:slug" element={<GameDetailPage />} />

        {/* User Protected Routes */}
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

      {/* Admin Panel Routes (Protected by AdminRoute) */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="games" element={<AdminGamesPage />} />
          <Route path="games/create" element={<AdminGameFormPage />} />
          <Route path="games/:id/edit" element={<AdminGameFormPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="downloads" element={<AdminDownloadsPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
