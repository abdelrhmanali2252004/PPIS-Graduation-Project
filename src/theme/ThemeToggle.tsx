import { Moon, Sun } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from './ThemeContext'

type ThemeToggleProps = {
  className?: string
  variant?: 'light' | 'dark' | 'light-grouped' | 'dark-grouped'
}

export default function ThemeToggle({
  className = '',
  variant = 'light',
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const { t } = useLanguage()

  const styles =
    variant === 'dark-grouped'
      ? 'text-white hover:bg-white/15'
      : variant === 'dark'
        ? 'border-white/25 bg-white/10 text-white hover:bg-white/15'
        : variant === 'light-grouped'
          ? 'text-heading hover:bg-page'
          : 'border-divider bg-surface text-heading hover:bg-page'

  const padding =
    variant === 'dark-grouped' || variant === 'light-grouped'
      ? 'px-2 py-1.5'
      : 'px-2.5 py-2'

  const bordered = variant === 'light' || variant === 'dark'

  const label =
    theme === 'dark' ? t('theme.switchToLight') : t('theme.switchToDark')

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-1 rounded-lg text-xs font-bold transition-colors ${padding} ${bordered ? `border ${styles}` : styles} ${className}`}
      aria-label={t('theme.aria')}
      title={label}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" aria-hidden />
      ) : (
        <Moon className="h-4 w-4" aria-hidden />
      )}
      <span>{theme === 'dark' ? t('theme.light') : t('theme.dark')}</span>
    </button>
  )
}
