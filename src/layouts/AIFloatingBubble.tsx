import { useState } from 'react'
import { Sparkles, X } from 'lucide-react'

type Props = { tip: string; pulseKey?: number }
const AI_BUBBLE_DISMISSED_KEY = 'nextventure.aiBubbleDismissed'

export function AIFloatingBubble({ tip, pulseKey = 0 }: Props) {
  const [open, setOpen] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.localStorage.getItem(AI_BUBBLE_DISMISSED_KEY) !== '1'
  })

  const handleClose = () => {
    setOpen(false)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AI_BUBBLE_DISMISSED_KEY, '1')
    }
  }

  if (!open) return null

  return (
    <div
      className="pointer-events-none fixed bottom-14 left-6 z-50 max-w-[min(100vw-3rem,320px)]"
      dir="rtl"
    >
      <div
        key={pulseKey}
        className="animate-pulse-ring rounded-2xl border-2 border-gold bg-white p-1 shadow-lg"
      >
        <div className="relative flex gap-3 rounded-xl bg-nile/95 p-3 text-white shadow-inner">
          <button
            type="button"
            aria-label="إغلاق"
            className="pointer-events-auto absolute left-2 top-2 rounded-full p-1 text-white/80 transition hover:bg-white/10 hover:text-gold focus:outline-none"
            onClick={handleClose}
            tabIndex={0}
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/25">
            <Sparkles className="h-5 w-5 text-gold" />
          </div>
          <div>
            <div className="mb-1 text-xs font-semibold text-gold">وكيل NextVenture AI</div>
            <p className="text-xs leading-relaxed text-white/90">{tip}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
