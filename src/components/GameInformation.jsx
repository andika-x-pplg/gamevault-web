import {
  Building2,
  Calendar,
  Clock,
  HardDrive,
  FileCode2,
  Globe2,
  ShieldCheck,
  Award,
} from 'lucide-react'

export default function GameInformation({ game }) {
  if (!game) return null

  const infoList = [
    {
      icon: Building2,
      label: 'Developer',
      value: game.developer || 'Community Dev',
    },
    {
      icon: Award,
      label: 'Publisher',
      value: game.publisher || game.developer || 'GameVault Distribution',
    },
    {
      icon: Calendar,
      label: 'Release Date',
      value: game.releaseDate || '2024',
    },
    {
      icon: Clock,
      label: 'Last Updated',
      value: game.lastUpdated || game.releaseDate || '2025',
    },
    {
      icon: FileCode2,
      label: 'Version',
      value: game.version || 'v1.0.0',
    },
    {
      icon: ShieldCheck,
      label: 'License / Game Type',
      value: game.license || 'Free-to-Play',
      highlight: true,
    },
    {
      icon: HardDrive,
      label: 'File Size',
      value: game.fileSize || 'N/A',
    },
    {
      icon: Globe2,
      label: 'Supported Languages',
      value: game.languages || 'English, Indonesian',
      fullWidth: true,
    },
  ]

  return (
    <div className="p-6 rounded-2xl bg-[#111726]/90 border border-slate-800 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Building2 className="w-4 h-4" />
        </div>
        <h3 className="font-bold text-base text-white">Game Information</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-xs sm:text-sm">
        {infoList.map((item, idx) => {
          const Icon = item.icon
          return (
            <div
              key={idx}
              className={`flex flex-col space-y-1 ${item.fullWidth ? 'sm:col-span-2' : ''}`}
            >
              <span className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                {item.label}
              </span>
              <span
                className={`font-semibold ${
                  item.highlight ? 'text-emerald-400' : 'text-slate-200'
                }`}
              >
                {item.value}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
