import { useTranslation } from '../../i18n/LanguageContext'

export default function ServicesSection() {
  const { t } = useTranslation()

  const services = [
    {
      title: t('landing.services.s1Title'),
      desc: t('landing.services.s1Desc'),
      ai: true,
      icon: (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor">
          <path d="M4 19V5M4 19h16M8 17V9m4 8V7m4 10v-6" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      title: t('landing.services.s2Title'),
      desc: t('landing.services.s2Desc'),
      icon: (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="7" strokeWidth="1.5" />
          <path d="M20 20l-3-3" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: t('landing.services.s3Title'),
      desc: t('landing.services.s3Desc'),
      icon: (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor">
          <path d="M4 18V6M8 14V9m4 5V4m4 10v-4m4 6V8" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      title: t('landing.services.s4Title'),
      desc: t('landing.services.s4Desc'),
      icon: (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor">
          <path
            d="M12 3l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6L12 3z"
            strokeWidth="1.2"
          />
        </svg>
      ),
    },
    {
      title: t('landing.services.s5Title'),
      desc: t('landing.services.s5Desc'),
      icon: (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="7" height="9" rx="1" strokeWidth="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1" strokeWidth="1.5" />
          <rect x="14" y="11" width="7" height="10" rx="1" strokeWidth="1.5" />
        </svg>
      ),
    },
  ]

  return (
    <section id="services" className="bg-offwhite px-4 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 text-center text-2xl font-bold text-heading md:text-3xl">
          {t('landing.services.title')}
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          {services.map((card) => (
            <div
              key={card.title}
              className="relative w-full max-w-[210px] rounded-xl border border-divider bg-surface p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
              style={{ borderTopWidth: '3px', borderTopColor: '#C9A05D' }}
            >
              {card.ai ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-nile px-2 py-0.5 text-[10px] font-bold text-white animate-pulse-glow">
                  {t('landing.services.aiBadge')}
                </span>
              ) : null}
              <div className="mb-3 text-gold">{card.icon}</div>
              <h3 className="mb-2 text-sm font-bold text-heading">{card.title}</h3>
              <p className="text-xs leading-relaxed text-slateMuted">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
