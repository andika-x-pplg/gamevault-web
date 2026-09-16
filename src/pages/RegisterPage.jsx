import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/useAuth'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pure JS Password Strength Calculator
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: '', percent: 0 }

    let score = 0
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    if (score <= 2) {
      return { score: 1, label: 'Lemah', color: 'bg-red-500 text-red-400', percent: 33 }
    } else if (score <= 4) {
      return { score: 2, label: 'Sedang', color: 'bg-amber-500 text-amber-400', percent: 66 }
    } else {
      return { score: 3, label: 'Kuat', color: 'bg-emerald-500 text-emerald-400', percent: 100 }
    }
  }, [password])

  const validate = () => {
    const errs = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!username.trim()) {
      errs.username = 'Username wajib diisi.'
    } else if (username.trim().length < 3) {
      errs.username = 'Username minimal 3 karakter.'
    }

    if (!email.trim()) {
      errs.email = 'Email wajib diisi.'
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Format email tidak valid.'
    }

    if (!password) {
      errs.password = 'Password wajib diisi.'
    } else if (password.length < 8) {
      errs.password = 'Password minimal 8 karakter.'
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Konfirmasi password wajib diisi.'
    } else if (confirmPassword !== password) {
      errs.confirmPassword = 'Konfirmasi password tidak cocok.'
    }

    if (!agreeTerms) {
      errs.agreeTerms = 'Anda harus menyetujui Ketentuan Layanan.'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    if (!validate()) return

    setIsSubmitting(true)
    const result = await register({ username, email, password })
    setIsSubmitting(false)

    if (result.success) {
      navigate('/library', { replace: true })
    } else {
      setServerError(result.message || 'Gagal mendaftar akun.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Buat Akun Baru
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Bergabung dengan GameVault untuk mengoleksi ratusan game PC gratis dan legal.
        </p>
      </div>

      {/* Error Banner */}
      {serverError && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Username Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300" htmlFor="reg-username">
            Username
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="reg-username"
              type="text"
              placeholder="Contoh: GamerX"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                if (errors.username) setErrors((prev) => ({ ...prev, username: null }))
              }}
              className={`w-full bg-[#111726] border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                errors.username
                  ? 'border-red-500/80 focus:ring-red-500/30'
                  : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
              }`}
            />
          </div>
          {errors.username && (
            <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.username}</span>
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300" htmlFor="reg-email">
            Alamat Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="reg-email"
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
          <label className="text-xs font-semibold text-slate-300" htmlFor="reg-password">
            Kata Sandi
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimal 8 karakter"
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
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Kekuatan Kata Sandi:</span>
                <span className={`font-semibold ${passwordStrength.color.split(' ')[1]}`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${passwordStrength.color.split(' ')[0]} transition-all duration-300`}
                  style={{ width: `${passwordStrength.percent}%` }}
                />
              </div>
            </div>
          )}

          {errors.password && (
            <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.password}</span>
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300" htmlFor="reg-confirm-password">
            Konfirmasi Kata Sandi
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="reg-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Ulangi kata sandi"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }))
              }}
              className={`w-full bg-[#111726] border rounded-xl pl-10 pr-11 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                errors.confirmPassword
                  ? 'border-red-500/80 focus:ring-red-500/30'
                  : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title={showConfirmPassword ? 'Sembunyikan password' : 'Lihat password'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.confirmPassword}</span>
            </p>
          )}
        </div>

        {/* Agree Terms Checkbox */}
        <div className="space-y-1 pt-1">
          <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-300 select-none">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked)
                if (errors.agreeTerms) setErrors((prev) => ({ ...prev, agreeTerms: null }))
              }}
              className="w-4 h-4 mt-0.5 rounded bg-[#111726] border-slate-700 text-indigo-600 focus:ring-indigo-500/30 focus:ring-offset-0 cursor-pointer accent-indigo-600"
            />
            <span>
              Saya menyetujui <span className="text-indigo-400 hover:underline">Ketentuan Layanan</span> dan{' '}
              <span className="text-indigo-400 hover:underline">Kebijakan Privasi</span> GameVault.
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.agreeTerms}</span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 hover:shadow-indigo-500/40 hover:scale-101 active:scale-99 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span>Mendaftarkan...</span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Daftar Akun GameVault</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Switch to Login */}
      <div className="text-center pt-2 text-xs text-slate-400 border-t border-slate-800/80">
        Sudah memiliki akun?{' '}
        <Link
          to="/login"
          className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline ml-1"
        >
          Masuk di Sini
        </Link>
      </div>
    </div>
  )
}
