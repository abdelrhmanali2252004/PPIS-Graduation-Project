import logoWeb from '../../assets/logo web.png'
import { useTranslation } from '../../i18n/LanguageContext'

type FikraTechLogoProps = {
  className?: string
  showText?: boolean
  iconClassName?: string
  variant?: 'default' | 'compact'
}

const iconHover =
  'object-contain object-center mix-blend-screen transition-all duration-300 ease-out group-hover:scale-[1.03] group-hover:brightness-125 group-hover:saturate-150 group-hover:drop-shadow-[0_0_10px_rgba(201,160,93,0.75)]'

const variantStyles = {
  default: {
    gap: 'gap-3 sm:gap-3.5',
    icon: `size-14 shrink-0 sm:size-16 ${iconHover}`,
    title:
      'text-[1.45rem] font-bold tracking-tight text-white transition-colors duration-300 ease-out group-hover:text-gold sm:text-[1.65rem]',
    sub:
      'mt-1.5 text-[0.72rem] font-medium uppercase tracking-[0.34em] text-gold/80 transition-colors duration-300 ease-out group-hover:text-gold sm:text-[0.8rem]',
  },
  compact: {
    gap: 'gap-2.5',
    icon: `size-10 shrink-0 ${iconHover}`,
    title:
      'text-base font-bold tracking-tight text-white transition-colors duration-300 ease-out group-hover:text-gold',
    sub:
      'mt-1 text-[0.58rem] font-medium uppercase tracking-[0.3em] text-gold/80 transition-colors duration-300 ease-out group-hover:text-gold',
  },
} as const

export default function FikraTechLogo({
  className = '',
  showText = true,
  iconClassName,
  variant = 'default',
}: FikraTechLogoProps) {
  const { t } = useTranslation()
  const styles = variantStyles[variant]

  return (
    <span className={`group inline-flex items-center ${styles.gap} ${className}`}>
      <img
        src={logoWeb}
        alt=""
        className={iconClassName ?? styles.icon}
        decoding="async"
        fetchPriority="high"
        aria-hidden
      />
      {showText ? (
        <span className="flex min-w-0 flex-col justify-center leading-none">
          <span className={styles.title}>{t('logo.name')}</span>
          <span className={styles.sub}>{t('logo.tag')}</span>
        </span>
      ) : null}
    </span>
  )
}
