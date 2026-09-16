import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, Sparkles, Shield, Loader2 } from 'lucide-react'
import { useAuth } from '../context/useAuth'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  const [errors, setErrors] = useState({})
  const [authError, setAuthError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const errs = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email.trim()) {
      errs.email = 'Email wajib diisi.'
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Format email tidak valid (contoh: user@gamevault.dev).'
    }

    if (!password) {
      errs.password = 'Kata sandi wajib diisi.'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setAuthError('')

    if (!validate() || isSubmitting) return

    setIsSubmitting(true)
    const result = await login(email, password, rememberMe)
    setIsSubmitting(false)

    if (result.success) {
      // Role-based smart redirect
      if (result.user?.role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        const destination = location.state?.from?.pathname || '/library'
        navigate(destination, { replace: true })
      }
    } else {
      if (result.errors && typeof result.errors === 'object') {
        const fieldErrors = {}
        Object.entries(result.errors).forEach(([field, msgArr]) => {
          fieldErrors[field] = Array.isArray(msgArr) ? msgArr[0] : msgArr
        })
        setErrors(fieldErrors)
      }
      setAuthError(result.message || 'Gagal masuk. Periksa email dan kata sandi Anda.')
    }
  }

  const fillDemoAccount = () => {
    setEmail('demo@gamevault.dev')
    setPassword('GameVault123!')
    setErrors({})
    setAuthError('')
  }

  const fillAdminAccount = () => {
    setEmail('admin@gamevault.dev')
    setPassword('GameVaultAdmin123!')
    setErrors({})
    setAuthError('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Masuk ke Akun
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Akses perpustakaan game legal, pantau wishlist, dan simpan riwayat unduhan.
        </p>
      </div>

      {/* Demo Account Helper Shortcut Toolbar */}
      <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-indigo-300">
          <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <span className="font-semibold">Akun Development Tersedia:</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={fillDemoAccount}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-medium transition-colors cursor-pointer"
          >
            <span>Demo Player</span>
          </button>
          <button
            type="button"
            onClick={fillAdminAccount}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white font-medium transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>
      </div>

      {/* Server Auth Error Alert */}
      {authError && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <span>{authError}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300" htmlFor="login-email">
            Alamat Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="login-email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }))
              }}
              className={`w-full bg-[#111726] border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? 'border-red-500/80 focus:ring-red-500/30'
                  : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300" htmlFor="login-password">
              Kata Sandi
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              Lupa Password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) setErrors((prev) => ({ ...prev, password: null }))
              }}
              className={`w-full bg-[#111726] border rounded-xl pl-10 pr-11 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                errors.password
                  ? 'border-red-500/80 focus:ring-red-500/30'
                  : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              aria-label={showPassword ? 'Hide Password' : 'Show Password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.password}</span>
            </p>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded bg-[#111726] border-slate-700 text-indigo-600 focus:ring-indigo-500/30 focus:ring-offset-0 cursor-pointer accent-indigo-600"
            />
            <span>Ingat saya di perangkat ini</span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 hover:shadow-indigo-500/40 hover:scale-101 active:scale-99 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Masuk Sekarang</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Switch to Register */}
      <div className="text-center pt-2 text-xs text-slate-400 border-t border-slate-800/80">
        Belum memiliki akun GameVault?{' '}
        <Link
          to="/register"
          className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline ml-1"
        >
          Daftar Akun Baru
        </Link>
      </div>
    </div>
  )
}
