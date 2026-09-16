import { Link } from 'react-router-dom'
import { AlertCircle, Home } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="text-center py-20 space-y-4">
      <div className="inline-flex p-3 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold text-white">404 - Halaman Tidak Ditemukan</h1>
      <p className="text-sm text-slate-400 max-w-md mx-auto">
        Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
      <div className="pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </div>
  )
}
