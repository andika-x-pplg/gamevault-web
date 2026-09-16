import { Menu, Bell, Shield, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/useAuth'

export default function AdminTopbar({ onOpenSidebar, title = 'Admin Overview' }) {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-30 h-16 bg-surface-900/90 backdrop-blur-md border-b border-surface-700/60 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-surface-800 lg:hidden transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Mock System Mode Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-800/80 border border-surface-700/60 text-xs text-gray-300">
          <Sparkles className="w-3.5 h-3.5 text-primary-400" />
          <span>Frontend Mock Mode</span>
        </div>

        {/* Notification Icon */}
        <button
          type="button"
          className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-surface-800 transition-colors"
          aria-label="Notifications"
          title="3 mock notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
        </button>

        {/* User preview */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-surface-700/60">
          <div className="relative">
            <img
              src={
                user?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
              }
              alt={user?.username || 'Admin'}
              className="w-8 h-8 rounded-lg object-cover border border-primary-500/40"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-surface-900" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-white leading-none">{user?.username || 'Admin'}</p>
            <p className="text-[10px] text-primary-400 font-medium flex items-center gap-0.5 mt-0.5">
              <Shield className="w-2.5 h-2.5" /> Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
