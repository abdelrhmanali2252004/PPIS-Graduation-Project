import { Languages } from 'lucide-react'
import { useLanguage } from './LanguageContext'

type LanguageToggleProps = {
  className?: string
  variant?: 'light' | 'dark'
}

export default function LanguageToggle({
  className = '',
  variant = 'light',
}: LanguageToggleProps) {
  const { locale, toggleLocale, t } = useLanguage()

  const styles =
    variant === 'dark'
      ? 'border-white/25 bg-white/10 text-white hover:bg-white/15'
      : 'border-divider bg-white text-nile hover:bg-offwhite'

  return (
    <button
      type="button"
      onClick={toggleLocale}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-bold transition-colors ${styles} ${className}`}
      aria-label={t('language.aria')}
      title={locale === 'ar' ? t('language.switchToEnglish') : t('language.switchToArabic')}
    >
      <Languages className="h-4 w-4" aria-hidden />
      <span>{locale === 'ar' ? 'EN' : 'AR'}</span>
    </button>
  )
}
