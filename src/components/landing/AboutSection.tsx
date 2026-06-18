import { Brain, MapPin, Users } from 'lucide-react'
import { useTranslation } from '../../i18n/LanguageContext'
import aboutCover from '../../assets/about-cover.png'

export default function AboutSection() {
  const { t } = useTranslation()

  const highlights = [
    {
      icon: Brain,
      title: t('landing.about.h1Title'),
      desc: t('landing.about.h1Desc'),
    },
    {
      icon: Users,
      title: t('landing.about.h2Title'),
      desc: t('landing.about.h2Desc'),
    },
    {
      icon: MapPin,
      title: t('landing.about.h3Title'),
      desc: t('landing.about.h3Desc'),
    },
  ]

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-gradient-to-b from-white via-offwhite to-white px-4 py-16 md:py-24"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-gold/40 to-transparent"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-10 text-center md:mb-12">
          <h2 className="text-2xl font-bold text-nile md:text-3xl">{t('landing.about.title')}</h2>
          <p className="mt-2 text-base font-medium text-gold md:text-lg">
            {t('landing.about.subtitle')}
          </p>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="order-2 space-y-5 lg:order-1">
            <p className="text-lg font-semibold leading-relaxed text-nile md:text-xl">
              {t('landing.about.p1')}
            </p>
            <p className="text-base leading-8 text-body/85">{t('landing.about.p2')}</p>

            <ul className="space-y-3 pt-1">
              {highlights.map(({ icon: Icon, title, desc }) => (
                <li
                  key={title}
                  className="flex gap-4 rounded-2xl border border-divider bg-white/90 p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-nile/8 text-nile">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-bold text-nile">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-body/80">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative order-1 w-full lg:order-2 lg:-translate-x-3 lg:pe-0 xl:-translate-x-5">
            <div
              className="pointer-events-none absolute -inset-3 rounded-2xl bg-gradient-to-br from-gold/20 via-nile/10 to-nile-dark/20 blur-xl"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-2xl border border-gold/25 bg-nile-dark shadow-[0_18px_36px_-10px_rgba(27,76,140,0.38)] ring-1 ring-white/10">
              <img
                src={aboutCover}
                alt={t('landing.about.imageAlt')}
                className="block h-auto w-full"
                width={1024}
                height={576}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
