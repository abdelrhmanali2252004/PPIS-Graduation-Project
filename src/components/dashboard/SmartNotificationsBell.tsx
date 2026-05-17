import { useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import type { DashboardMetrics } from '../../utils/parseFeasibilityMetrics'
import { AlertsPanelContent } from './AlertsPanelContent'

type SmartNotificationsBellProps = {
  metrics?: DashboardMetrics | null
  className?: string
}

export function SmartNotificationsBell({ metrics, className = '' }: SmartNotificationsBellProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const count = metrics?.alerts.length ?? 0

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`التنبيهات الذكية${count > 0 ? `، ${count} تنبيهات` : ''}`}
        className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
          open
            ? 'border-nile bg-nile/10 text-nile'
            : 'border-divider bg-white text-body hover:border-nile/40 hover:bg-offwhite'
        }`}
      >
        <Bell className="h-5 w-5" />
        {count > 0 ? (
          <span className="absolute -left-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
            {count > 9 ? '9+' : count}
          </span>
        ) : null}
      </button>

      {open ? (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 lg:hidden"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-label="التنبيهات الذكية"
            className="absolute end-0 top-[calc(100%+8px)] z-50 w-[min(100vw-2rem,320px)] overflow-hidden rounded-2xl border border-divider bg-white shadow-xl"
          >
            <AlertsPanelContent metrics={metrics} compact />
          </div>
        </>
      ) : null}
    </div>
  )
}
