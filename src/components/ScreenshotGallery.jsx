import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, Maximize2, Image as ImageIcon } from 'lucide-react'

export default function ScreenshotGallery({ screenshots = [], gameTitle = 'Game' }) {
  const [activeModalIndex, setActiveModalIndex] = useState(null)

  const isModalOpen = activeModalIndex !== null

  const handleClose = useCallback(() => {
    setActiveModalIndex(null)
  }, [])

  const handlePrev = useCallback(() => {
    if (activeModalIndex === null) return
    setActiveModalIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length)
  }, [activeModalIndex, screenshots.length])

  const handleNext = useCallback(() => {
    if (activeModalIndex === null) return
    setActiveModalIndex((prev) => (prev + 1) % screenshots.length)
  }, [activeModalIndex, screenshots.length])

  // Keyboard navigation support (Escape, ArrowLeft, ArrowRight)
  useEffect(() => {
    if (!isModalOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }

    // Lock scroll when modal is open
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModalOpen, handleClose, handlePrev, handleNext])

  if (!screenshots || screenshots.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <ImageIcon className="w-4 h-4" />
        </div>
        <h2 className="text-xl font-bold text-white">Screenshots & Media</h2>
        <span className="text-xs text-slate-500 font-mono">({screenshots.length} Images)</span>
      </div>

      {/* Thumbnails Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {screenshots.map((src, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveModalIndex(index)}
            className="group relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 shadow-md hover:shadow-indigo-500/10 hover:-translate-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label={`Open screenshot ${index + 1} for ${gameTitle}`}
          >
            <img
              src={src}
              alt={`${gameTitle} screenshot ${index + 1}`}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            {/* Subtle overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold">
              <Maximize2 className="w-5 h-5 text-indigo-400" />
              <span>Perbesar</span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Screenshot lightbox"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8 animate-fade-in"
          onClick={handleClose}
        >
          {/* Modal Container */}
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Toolbar */}
            <div className="absolute -top-12 left-0 right-0 flex items-center justify-between text-slate-300 px-2">
              <span className="text-sm font-medium">
                {gameTitle} — Screenshot {activeModalIndex + 1} dari {screenshots.length}
              </span>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                title="Tutup (Esc)"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Preview Image */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-black max-h-[80vh] flex items-center justify-center">
              <img
                src={screenshots[activeModalIndex]}
                alt={`${gameTitle} screenshot ${activeModalIndex + 1}`}
                className="max-h-[75vh] w-auto object-contain select-none"
              />
            </div>

            {/* Navigation Arrows */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 sm:-left-14 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-indigo-600 text-white border border-slate-700 hover:border-indigo-500 shadow-xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
              title="Previous (Arrow Left)"
              aria-label="Previous Screenshot"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 sm:-right-14 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-indigo-600 text-white border border-slate-700 hover:border-indigo-500 shadow-xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
              title="Next (Arrow Right)"
              aria-label="Next Screenshot"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Indicator Thumbnails at bottom of modal */}
            <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
              {screenshots.map((thumb, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveModalIndex(idx)}
                  className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    activeModalIndex === idx
                      ? 'border-indigo-500 scale-105 shadow-md shadow-indigo-500/30'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`Switch to screenshot ${idx + 1}`}
                >
                  <img src={thumb} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
