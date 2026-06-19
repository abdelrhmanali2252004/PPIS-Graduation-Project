import LanguageToggle from '../i18n/LanguageToggle'
import ThemeToggle from '../theme/ThemeToggle'

type UtilityTogglesBarProps = {
  variant?: 'light' | 'dark'
  className?: string
}

export default function UtilityTogglesBar({
  variant = 'light',
  className = '',
}: UtilityTogglesBarProps) {
  if (variant === 'dark') {
    return (
      <div
        className={`inline-flex shrink-0 items-center gap-1 rounded-xl border border-white/20 bg-white/10 p-1 ${className}`}
      >
        <LanguageToggle variant="dark-grouped" />
        <span className="h-5 w-px shrink-0 bg-white/15" aria-hidden />
        <ThemeToggle variant="dark-grouped" />
      </div>
    )
  }

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-xl border border-divider bg-surface p-1 shadow-sm ${className}`}
    >
      <ThemeToggle variant="light-grouped" />
      <span className="h-5 w-px shrink-0 bg-divider" aria-hidden />
      <LanguageToggle variant="light-grouped" />
    </div>
  )
}
