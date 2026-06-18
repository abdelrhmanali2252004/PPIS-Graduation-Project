import { Link } from 'react-router-dom'
import { useTranslation } from '../../i18n/LanguageContext'

export default function ReadyToStartSection() {
  const { t } = useTranslation()

  return (
    <section className="bg-gradient-to-b from-nile to-nile-dark px-4 py-14 text-white md:py-16">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-3 text-2xl font-extrabold md:text-3xl">{t('landing.ready.title')}</h2>
        <p className="mx-auto mb-6 max-w-2xl text-sm text-white/80 md:text-base">
          {t('landing.ready.subtitle')}
        </p>
        <Link
          to="/app/step1"
          className="inline-flex rounded-xl bg-gold px-7 py-3 text-sm font-bold text-nile-dark shadow-lg transition-transform hover:scale-[1.02]"
        >
          {t('landing.ready.cta')}
        </Link>
      </div>
    </section>
  )
}
