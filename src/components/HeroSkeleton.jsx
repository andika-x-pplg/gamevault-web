export default function HeroSkeleton() {
  return (
    <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-[#0E1524] shadow-2xl animate-pulse">
      <div className="h-[480px] sm:h-[520px] lg:h-[560px] w-full p-6 sm:p-10 lg:p-14 flex flex-col justify-between bg-slate-900/60">
        {/* Top Badges */}
        <div className="flex items-center gap-3">
          <div className="h-6 w-32 rounded-full bg-slate-800" />
          <div className="h-6 w-16 rounded-full bg-slate-800" />
        </div>

        {/* Center Content */}
        <div className="max-w-2xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-5 w-20 rounded-md bg-slate-800" />
            <div className="h-5 w-24 rounded-md bg-slate-800" />
          </div>
          <div className="h-10 sm:h-14 w-3/4 rounded-2xl bg-slate-800" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded-md bg-slate-800" />
            <div className="h-4 w-5/6 rounded-md bg-slate-800" />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <div className="h-11 w-36 rounded-xl bg-slate-800" />
            <div className="h-11 w-36 rounded-xl bg-slate-800" />
          </div>
        </div>

        {/* Bottom controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-2 w-8 rounded-full bg-slate-800" />
            <div className="h-2 w-2 rounded-full bg-slate-800" />
            <div className="h-2 w-2 rounded-full bg-slate-800" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-slate-800" />
            <div className="h-8 w-8 rounded-xl bg-slate-800" />
          </div>
        </div>
      </div>
    </div>
  )
}
