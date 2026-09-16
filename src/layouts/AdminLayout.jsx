import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminTopbar from '../components/admin/AdminTopbar'

const PAGE_TITLES = {
  '/admin': 'Admin Dashboard',
  '/admin/games': 'Game Management',
  '/admin/games/create': 'Add New Game',
  '/admin/categories': 'Category Management',
  '/admin/users': 'User Management',
  '/admin/downloads': 'Download Analytics',
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Derive title from pathname
  let currentTitle = PAGE_TITLES[location.pathname]
  if (!currentTitle && location.pathname.includes('/edit')) {
    currentTitle = 'Edit Game'
  }
  if (!currentTitle) {
    currentTitle = 'GameVault Administration'
  }

  return (
    <div className="min-h-screen bg-surface-950 text-gray-100 flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <AdminTopbar
          title={currentTitle}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
