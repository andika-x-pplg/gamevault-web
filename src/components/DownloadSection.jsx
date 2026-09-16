import { useState } from 'react'
import {
  Download,
  ShieldCheck,
  ExternalLink,
  Info,
  CheckCircle2,
  HardDrive,
  FileCode2,
  Calendar,
  Sparkles,
} from 'lucide-react'

export default function DownloadSection({ game }) {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false)

  if (!game) return null

  const steps = [
    {
      step: '01',
      title: 'Kunjungi Sumber Distribusi Resmi',
      description: `Akses portal resmi rilis ${game.developer || 'pengembang'} atau repositori proyek yang telah terverifikasi aman.`,
    },
    {
      step: '02',
      title: 'Unduh File Installer / Launcher',
      description: `Pilih versi ${game.version || 'terbaru'} yang sesuai dengan arsitektur sistem operasi PC kamu (${game.fileSize || 'Standard'}).`,
    },
    {
      step: '03',
      title: 'Ikuti Petunjuk Instalasi',
      description: 'Jalankan berkas setup dan ikuti panduan instruksi wizard instalasi resmi hingga proses selesai.',
    },
    {
      step: '04',
      title: 'Mulai Mainkan Game',
      description: 'Buka pintasan game di desktop atau launcher untuk menikmati permainan secara legal dan aman.',
    },
  ]

  return (
    <section id="download-section" className="space-y-6 pt-4 scroll-mt-24">
      {/* 1. Official Download Card */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-[#121A2D] via-[#0E1524] to-[#141226] p-6 sm:p-10 shadow-2xl space-y-6">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                Official / Legal Source
              </span>
              <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-1 rounded-full">
                {game.license}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Unduh {game.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Dapatkan berkas instalasi resmi versi terverifikasi langsung dari pengembang.
            </p>
          </div>

          {/* Download Action Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={() => setDownloadModalOpen(true)}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/50 hover:scale-102 transition-all duration-200 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Go to Official Download</span>
              <ExternalLink className="w-4 h-4 text-indigo-200" />
            </button>
          </div>
        </div>

        {/* Quick Specs Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-slate-500 text-xs flex items-center gap-1">
              <FileCode2 className="w-3 h-3 text-indigo-400" /> Versi Rilis
            </span>
            <p className="font-semibold text-slate-200 font-mono">{game.version || 'v1.0.0'}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-slate-500 text-xs flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-indigo-400" /> Ukuran Berkas
            </span>
            <p className="font-semibold text-slate-200 font-mono">{game.fileSize || 'Standard'}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-slate-500 text-xs flex items-center gap-1">
              <Calendar className="w-3 h-3 text-indigo-400" /> Pembaruan
            </span>
            <p className="font-semibold text-slate-200">{game.lastUpdated || '2025'}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-slate-500 text-xs flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Status Lisensi
            </span>
            <p className="font-semibold text-emerald-400">100% Legal & Free</p>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 rounded-xl bg-indigo-950/25 border border-indigo-500/20 flex items-start gap-3 text-xs text-indigo-200/90 leading-relaxed">
          <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Pernyataan Distribusi:</strong> GameVault tidak meng-host file game di server internal. Seluruh tautan unduhan diarahkan menuju sumber distribusi resmi pengembang, repositori open-source, atau platform authorized terpercaya tanpa modifikasi ilegal.
          </p>
        </div>
      </div>

      {/* 2. Installation Guide Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111726]/80 border border-slate-800 space-y-5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-white">Installation Information</h3>
            <p className="text-xs text-slate-400">Panduan langkah mudah memasang game di perangkat PC kamu</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#0B0E14] border border-slate-800/90 space-y-2 hover:border-indigo-500/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                  Langkah {s.step}
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
              </div>
              <h4 className="font-semibold text-sm text-white pt-1">{s.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mockup Modal for Official Download Feedback */}
      {downloadModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setDownloadModalOpen(false)}
        >
          <div
            className="max-w-md w-full rounded-2xl bg-[#111726] border border-slate-700 p-6 space-y-4 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="inline-flex p-3 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              <Download className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Tautan Distribusi Resmi</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kamu akan diarahkan ke portal resmi pengembang <strong>{game.developer || 'Developer'}</strong> untuk mengunduh <strong>{game.title}</strong> ({game.version || 'v1.0.0'}).
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#0B0E14] border border-slate-800 text-xs text-slate-300 font-mono break-all">
              https://official.gamevault.local/get/{game.slug}
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDownloadModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`[Simulasi Distribusi Resmi] Mengarahkan ke tautan rilis ${game.title}`)
                  setDownloadModalOpen(false)
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors cursor-pointer shadow-lg shadow-indigo-600/30"
              >
                Lanjutkan ke Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
