import { Outlet, Link } from 'react-router-dom'
import { Gamepad2, ShieldCheck, Sparkles, Download, ArrowLeft } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-[#0B0E14] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Left Branding Column (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0F172A] flex-col justify-between p-12 border-r border-slate-800/80">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2.5 font-bold text-2xl group">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <span className="font-extrabold tracking-tight text-2xl text-white">
              Game<span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Vault</span>
            </span>
          </Link>
        </div>

        {/* Center Pitch */}
        <div className="relative z-10 space-y-6 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platform Komunitas Gamer PC</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            Katalog Game PC Legal & Gratis <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Dalam Satu Wadah.
            </span>
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Simpan game favorit ke Library pribadimu, pantau wishlist rilis terbaru, dan temukan ratusan game open-source berkualitas tinggi tanpa biaya.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>100% Bebas Pembajakan & Malware</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="p-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Download className="w-4 h-4" />
              </div>
              <span>Tautan Rilis Distribusi Resmi Pengembang</span>
            </div>
          </div>
        </div>

        {/* Bottom Notice */}
        <div className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} GameVault. Legal PC Games Platform.
        </div>
      </div>

      {/* Right Form Column */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-y-auto">
        {/* Top Back Link */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Beranda</span>
          </Link>

          {/* Mobile Logo View */}
          <Link to="/" className="lg:hidden flex items-center gap-2 font-bold text-lg">
            <div className="p-1.5 rounded-xl bg-indigo-600 text-white">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <span className="text-white">GameVault</span>
          </Link>
        </div>

        {/* Centered Content Container */}
        <div className="my-auto py-8 max-w-md w-full mx-auto">
          <Outlet />
        </div>

        {/* Bottom Footer Note */}
        <div className="text-center text-xs text-slate-500 pt-4">
          GameVault Authentication Mock (Tahap Frontend)
        </div>
      </div>
    </div>
  )
}
