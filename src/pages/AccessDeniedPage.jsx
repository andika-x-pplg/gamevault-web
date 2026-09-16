import { Link } from 'react-router-dom'
import { ShieldAlert, ArrowLeft, Home, KeyRound } from 'lucide-react'
import { useAuth } from '../context/useAuth'

export default function AccessDeniedPage() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-md w-full bg-surface-800/80 backdrop-blur-xl border border-rose-500/20 rounded-2xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-6 text-rose-400">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-3">
          403 Forbidden
        </span>

        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          Akun Anda ({user?.email || 'Guest'}) tidak memiliki hak akses administrator untuk membuka Admin Panel GameVault.
        </p>

        <div className="p-4 rounded-xl bg-surface-900/60 border border-surface-700/60 text-left mb-6">
          <p className="text-xs text-gray-400 mb-1 flex items-center gap-1.5 font-medium">
            <KeyRound className="w-3.5 h-3.5 text-primary-400" />
            Tips Pengujian Role Admin:
          </p>
          <p className="text-xs text-gray-300">
            Login menggunakan kredensial admin: <br />
            <span className="text-primary-300 font-mono">admin@gamevault.dev</span> / <span className="text-primary-300 font-mono">GameVaultAdmin123!</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-medium text-sm transition-colors shadow-lg shadow-primary-500/25"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <button
            onClick={logout}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-surface-700 hover:bg-surface-600 text-gray-200 font-medium text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Switch Account
          </button>
        </div>
      </div>
    </div>
  )
}
