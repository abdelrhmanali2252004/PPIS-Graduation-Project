import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import FikraTechLogo from '../components/branding/FikraTechLogo'
import LanguageToggle from '../i18n/LanguageToggle'
import { useLanguage } from '../i18n/LanguageContext'
import { AIFloatingBubble } from './AIFloatingBubble'

type AppShellProps = {
  activeStep: 1 | 2 | 3 | 4 | 5
  progressPercent: number
  bottomStepLabel: string
  aiTip: string
  aiPulseKey?: number
  mainScrollable?: boolean
  hideBottomBar?: boolean
  rightPanel?: ReactNode
  children: ReactNode
}

export function AppShell({
  activeStep,
  progressPercent,
  bottomStepLabel,
  aiTip,
  aiPulseKey = 0,
  mainScrollable = false,
  hideBottomBar = false,
  rightPanel,
  children,
}: AppShellProps) {
  const { t, dir } = useLanguage()

  const STEPS = [
    { n: 1, path: '/app/step1', label: t('app.step1') },
    { n: 2, path: '/app/step2', label: t('app.step2') },
    { n: 3, path: '/app/step3', label: t('app.step3') },
    { n: 4, path: '/app/step4', label: t('app.step4') },
    { n: 5, path: '/app/step5', label: t('app.step5') },
  ] as const

  const activeBorder = dir === 'rtl' ? 'border-r-4' : 'border-l-4'

  console.log(mainScrollable)
  console.log(bottomStepLabel, hideBottomBar)

  return (
    <div dir={dir} className="flex h-screen overflow-hidden bg-offwhite font-cairo">
      <aside className="flex w-[240px] shrink-0 flex-col bg-nile text-white">
        <div className="border-b border-white/15 px-4 py-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <Link to="/" className="inline-flex">
              <FikraTechLogo variant="compact" />
            </Link>
            <LanguageToggle variant="dark" />
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
          {STEPS.map((s) => {
            const allDone = activeStep === 5 && progressPercent >= 100
            const active = s.n === activeStep && !allDone
            const done = s.n < activeStep || allDone
            const canNavigate = active || done
            return canNavigate ? (
              <Link
                key={s.n}
                to={s.path}
                className={`block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? `${activeBorder} border-gold bg-white/10 font-semibold text-white`
                    : 'text-gold hover:bg-white/10'
                }`}
              >
                <span className="text-xs text-white/50">{s.n}.</span> {s.label}
              </Link>
            ) : (
              <div
                key={s.n}
                className="block cursor-not-allowed rounded-lg px-3 py-2.5 text-sm text-slateMuted/50"
              >
                <span className="text-xs text-white/50">{s.n}.</span> {s.label}
              </div>
            )
          })}
        </nav>
        <div className="border-t border-white/15 px-4 py-3">
          <div className="mb-2 flex items-center justify-between text-xs text-white/60">
            <span>{t('common.progress')}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gold transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </aside>

      <div className="relative flex min-w-0 flex-1 flex-row">
        <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
        {rightPanel}
      </div>

      <AIFloatingBubble tip={aiTip} pulseKey={aiPulseKey} />
    </div>
  )
}
