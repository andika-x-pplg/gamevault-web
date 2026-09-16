import { Cpu, HardDrive, Monitor, Layers, ShieldAlert, CheckCircle2 } from 'lucide-react'

export default function SystemRequirements({ requirements }) {
  if (!requirements) return null

  const { minimum, recommended } = requirements

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Cpu className="w-4 h-4" />
        </div>
        <h2 className="text-xl font-bold text-white">System Requirements</h2>
        <span className="text-xs text-slate-500">PC Specifications</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Minimum Requirements Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#111726]/90 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-base text-white">Minimum Requirements</h3>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="space-y-1">
              <span className="text-slate-400 font-medium flex items-center gap-1.5 text-xs">
                <Monitor className="w-3.5 h-3.5 text-slate-500" /> OS:
              </span>
              <p className="text-slate-200 pl-5 font-mono text-xs">{minimum?.os || 'Windows 10 64-bit'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-medium flex items-center gap-1.5 text-xs">
                <Cpu className="w-3.5 h-3.5 text-slate-500" /> Processor:
              </span>
              <p className="text-slate-200 pl-5 font-mono text-xs">{minimum?.processor || 'Dual Core CPU'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-medium flex items-center gap-1.5 text-xs">
                <Layers className="w-3.5 h-3.5 text-slate-500" /> Memory / RAM:
              </span>
              <p className="text-slate-200 pl-5 font-mono text-xs">{minimum?.memory || '2 GB RAM'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-medium flex items-center gap-1.5 text-xs">
                <Monitor className="w-3.5 h-3.5 text-slate-500" /> Graphics / GPU:
              </span>
              <p className="text-slate-200 pl-5 font-mono text-xs">{minimum?.graphics || 'DirectX 11 compatible'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-medium flex items-center gap-1.5 text-xs">
                <HardDrive className="w-3.5 h-3.5 text-slate-500" /> Storage:
              </span>
              <p className="text-slate-200 pl-5 font-mono text-xs">{minimum?.storage || '1 GB available space'}</p>
            </div>

            {minimum?.directX && (
              <div className="space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1.5 text-xs">
                  <Layers className="w-3.5 h-3.5 text-slate-500" /> DirectX:
                </span>
                <p className="text-slate-200 pl-5 font-mono text-xs">{minimum.directX}</p>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Requirements Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#111726]/90 border border-indigo-500/30 shadow-lg shadow-indigo-500/5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-base text-white">Recommended Specifications</h3>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="space-y-1">
              <span className="text-slate-400 font-medium flex items-center gap-1.5 text-xs">
                <Monitor className="w-3.5 h-3.5 text-indigo-400" /> OS:
              </span>
              <p className="text-slate-200 pl-5 font-mono text-xs">{recommended?.os || 'Windows 10 / 11 64-bit'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-medium flex items-center gap-1.5 text-xs">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Processor:
              </span>
              <p className="text-slate-200 pl-5 font-mono text-xs">{recommended?.processor || 'Quad Core 3.0 GHz'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-medium flex items-center gap-1.5 text-xs">
                <Layers className="w-3.5 h-3.5 text-indigo-400" /> Memory / RAM:
              </span>
              <p className="text-slate-200 pl-5 font-mono text-xs">{recommended?.memory || '8 GB RAM'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-medium flex items-center gap-1.5 text-xs">
                <Monitor className="w-3.5 h-3.5 text-indigo-400" /> Graphics / GPU:
              </span>
              <p className="text-slate-200 pl-5 font-mono text-xs">{recommended?.graphics || 'Dedicated GPU 4 GB VRAM'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-medium flex items-center gap-1.5 text-xs">
                <HardDrive className="w-3.5 h-3.5 text-indigo-400" /> Storage:
              </span>
              <p className="text-slate-200 pl-5 font-mono text-xs">{recommended?.storage || 'SSD Recommended'}</p>
            </div>

            {recommended?.directX && (
              <div className="space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1.5 text-xs">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" /> DirectX:
                </span>
                <p className="text-slate-200 pl-5 font-mono text-xs">{recommended.directX}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
