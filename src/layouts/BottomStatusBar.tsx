import { Lock } from 'lucide-react'

type Props = { stepLabel: string }

export function BottomStatusBar({ stepLabel }: Props) {
  return (
    <div
      dir="rtl"
      className="fixed bottom-0 left-0 right-0 z-40 flex h-10 items-center justify-between border-t border-divider bg-white px-4 text-xs text-slateMuted shadow-[0_-2px_10px_rgba(0,0,0,0.04)]"
    >
      <span className="font-medium text-gold">✦ Magic</span>
      <span className="text-body/80">{stepLabel}</span>
      <span className="flex items-center gap-1">
        <Lock className="h-3.5 w-3.5" />
        اتصال مشفّر
      </span>
    </div>
  )
}
