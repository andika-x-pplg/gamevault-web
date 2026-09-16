import { NavLink, Link, useNavigate } from 'react-router-dom'
import {
  Gamepad2,
  LayoutDashboard,
  FolderTree,
  Users,
  DownloadCloud,
  Globe,
  LogOut,
  X,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../../context/useAuth'

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Games', to: '/admin/games', icon: Gamepad2 },
  { label: 'Categories', to: '/admin/categories', icon: FolderTree },
  { label: 'Users', to: '/admin/users', icon: Users },
  { label: 'Downloads', to: '/admin/downloads', icon: DownloadCloud },
]

export default function AdminSidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-surface-900 border-r border-surface-700/60 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Brand */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-surface-700/60 bg-surface-900/50">
          <Link
            to="/admin"
            onClick={onClose}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/25">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-wider text-white">
                  GAME<span className="text-primary-400">VAULT</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary-500/20 text-primary-300 border border-primary-500/30">
                  Admin
                </span>
              </div>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-surface-800 lg:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Main Management
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20 font-semibold'
                      : 'text-gray-400 hover:text-gray-100 hover:bg-surface-800/80'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}

          <div className="pt-6 px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Quick Navigation
          </div>

          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-100 hover:bg-surface-800/80 transition-colors"
          >
            <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>View Live Website</span>
          </Link>
        </div>

        {/* User Card & Logout in Sidebar Footer */}
        <div className="p-4 border-t border-surface-700/60 bg-surface-900/60">
          <div className="flex items-center gap-3 mb-3 p-2 rounded-xl bg-surface-800/50 border border-surface-700/40">
            <img
              src={
                user?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
              }
              alt={user?.username || 'Admin'}
              className="w-9 h-9 rounded-lg object-cover border border-primary-500/30"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate flex items-center gap-1">
                {user?.username || 'Administrator'}
                <ShieldCheck className="w-3.5 h-3.5 text-primary-400 inline" />
              </p>
              <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-100 bg-rose-950/30 hover:bg-rose-900/50 border border-rose-500/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
