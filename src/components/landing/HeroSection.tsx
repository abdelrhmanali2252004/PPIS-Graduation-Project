import { useNavigate } from 'react-router-dom'
import { TOKEN_STORAGE_KEY } from '../../api/client'
import { useTranslation } from '../../i18n/LanguageContext'

export default function HeroSection() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleStart = () => {
    const isLoggedIn = Boolean(localStorage.getItem(TOKEN_STORAGE_KEY))

    if (isLoggedIn) {
      navigate('/app/step1')
    } else {
      navigate('/login')
    }
  }

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-b from-nile to-nile-dark px-4 py-20 md:py-28"
    >
      <div
        className="pointer-events-none absolute left-[8%] top-16 h-24 w-24 animate-float rounded-2xl border border-gold/30 bg-gold/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-[12%] top-32 h-16 w-16 animate-float rounded-full border border-white/20 bg-white/5"
        style={{ animationDelay: '1s' }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-20 left-1/4 h-20 w-20 rotate-12 animate-float border border-gold/25 bg-gold/5"
        style={{ animationDelay: '0.5s' }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <span
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/35 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold/95 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '0s', animationFillMode: 'forwards' }}
        >
          {t('landing.hero.badge')}
        </span>

        <h1
          className="mb-4 animate-fade-in-up text-3xl font-extrabold leading-tight text-white opacity-0 md:text-5xl"
          style={{
            animationDelay: '0.1s',
            animationFillMode: 'forwards',
            lineHeight: '1.3',
          }}
        >
          {t('landing.hero.title')}
        </h1>

        <p
          className="mx-auto mb-8 max-w-2xl animate-fade-in-up text-base leading-relaxed text-white/85 opacity-0 md:text-lg"
          style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
        >
          {t('landing.hero.subtitle')}
        </p>

        <div
          className="flex flex-wrap items-center justify-center gap-3 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
        >
          <button
            onClick={handleStart}
            className="rounded-xl bg-gold px-6 py-3 text-sm font-bold text-nile-dark shadow-lg transition-transform hover:scale-[1.02]"
          >
            {t('landing.hero.cta')}
          </button>

          <a
            href="#services"
            className="rounded-xl border-2 border-sky-400/55 bg-sky-950/35 px-6 py-3 text-sm font-semibold text-sky-100 shadow-sm transition-colors hover:border-sky-300 hover:bg-sky-900/45"
          >
            {t('landing.hero.servicesLink')}
          </a>
        </div>
      </div>
    </section>
  )
}
