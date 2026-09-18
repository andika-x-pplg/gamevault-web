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
  Loader2,
} from 'lucide-react'
import { useToast } from '../context/useToast'
import * as downloadService from '../services/downloadService'

export default function DownloadSection({ game, onDownloadCountUpdated }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { success: showSuccessToast, error: showErrorToast, info: showInfoToast } = useToast()

  if (!game) return null

  const isDirect = game.downloadType === 'direct' || game.download_type === 'direct'
  const officialName = game.officialSourceName || game.official_source_name || game.officialSource?.name || 'Official Portal'

  // Helper to get formatted button label for external providers
  const getExternalButtonLabel = () => {
    const lowerName = officialName.toLowerCase()
    if (lowerName.includes('steam')) return 'Get on Steam'
    if (lowerName.includes('epic')) return 'Get on Epic Games'
    if (lowerName.includes('itch')) return 'Get on itch.io'
    if (lowerName.includes('github')) return 'Get from GitHub'
    if (officialName && officialName !== 'Official Portal' && officialName !== 'Official Source') {
      return `Get on ${officialName}`
    }
    return 'Visit Official Download'
  }

  const handleDownloadAction = async () => {
    if (isProcessing) return

    setIsProcessing(true)

    try {
      const data = await downloadService.initiateDownload(game.slug)

      if (data?.type === 'direct' && data?.url) {
        // Trigger browser native file download
        const link = document.createElement('a')
        link.href = data.url
        link.setAttribute('download', '')
        link.setAttribute('target', '_blank')
        link.setAttribute('rel', 'noopener noreferrer')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        showSuccessToast('Download started. Check your browser downloads to view progress.')
      } else if (data?.type === 'external' && data?.url) {
        // Open official store/distribution portal safely in new tab
        window.open(data.url, '_blank', 'noopener,noreferrer')
        showInfoToast(`Mengarahkan ke ${data.provider || officialName}...`)
      }

      if (typeof onDownloadCountUpdated === 'function' && typeof data?.download_count === 'number') {
        onDownloadCountUpdated(data.download_count)
      }
    } catch (err) {
      console.error('Download preparation failed:', err)
      const msg = err.response?.data?.message || 'Unable to start download. Please try again.'
      showErrorToast(msg)
    } finally {
      setIsProcessing(false)
    }
  }

  const steps = [
    {
      step: '01',
      title: isDirect ? 'Inisialisasi Unduhan Resmi' : 'Kunjungi Sumber Distribusi Resmi',
      description: isDirect
        ? `Klik tombol download untuk mengunduh berkas rilis resmi ${game.developer || 'pengembang'} yang telah terverifikasi aman.`
        : `Akses portal resmi rilis ${officialName} atau repositori proyek yang telah terverifikasi aman.`,
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
                {isDirect ? 'Direct Download' : `Official Source: ${officialName}`}
              </span>
              <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-1 rounded-full">
                {game.license}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Unduh {game.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {isDirect
                ? 'Unduh file resmi langsung melalui GameVault.'
                : `Akses halaman distribusi resmi terverifikasi di ${officialName}.`}
            </p>
          </div>

          {/* Download Action Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleDownloadAction}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/50 hover:scale-102 transition-all duration-200 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Preparing Download...</span>
                </>
              ) : isDirect ? (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Now</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{getExternalButtonLabel()}</span>
                  <ExternalLink className="w-4 h-4 text-indigo-200" />
                </>
              )}
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
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Status Lisensi
            </span>
            <p className="font-semibold text-emerald-400">100% Legal & Free</p>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 rounded-xl bg-indigo-950/25 border border-indigo-500/20 flex items-start gap-3 text-xs text-indigo-200/90 leading-relaxed">
          <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Pernyataan Distribusi:</strong> GameVault hanya mendukung distribusi resmi dan legal. Seluruh tautan unduhan diarahkan menuju sumber resmi pengembang, repositori open-source, atau platform authorized terpercaya tanpa modifikasi ilegal.
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
    </section>
  )
}
