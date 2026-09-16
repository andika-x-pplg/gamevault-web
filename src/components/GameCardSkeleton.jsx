export default function GameCardSkeleton() {
  return (
    <div className="rounded-2xl bg-[#111726]/90 border border-slate-800/90 overflow-hidden shadow-lg animate-pulse flex flex-col justify-between">
      {/* Aspect banner placeholder */}
      <div className="relative aspect-[16/10] w-full bg-slate-800/80" />

      {/* Content */}
      <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 rounded bg-slate-800" />
            <div className="h-3 w-20 rounded bg-slate-800/60" />
          </div>
          <div className="h-5 w-4/5 rounded bg-slate-800" />
          <div className="space-y-1 pt-1">
            <div className="h-3 w-full rounded bg-slate-800/60" />
            <div className="h-3 w-3/4 rounded bg-slate-800/60" />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="h-3.5 w-16 rounded bg-slate-800" />
          <div className="h-3.5 w-20 rounded bg-slate-800" />
        </div>
      </div>
    </div>
  )
}
