import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import { loginUser } from '../store/slices/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { getDashboardHomePath, getUserRole } from '../types/auth'
import FikraTechLogo from '../components/branding/FikraTechLogo'
import UtilityTogglesBar from '../layouts/UtilityTogglesBar'
import { useLanguage } from '../i18n/LanguageContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)
  const { t, dir } = useLanguage()
  const [email, setEmail] = useState('abdo@app.com')
  const [password, setPassword] = useState('123456')

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const action = await dispatch(
      loginUser({
        email: email.trim(),
        password,
      }),
    )

    if (loginUser.fulfilled.match(action)) {
      const role = getUserRole(action.payload.user)
      navigate(getDashboardHomePath(role), { replace: true })
    }
  }

  return (
    <div dir={dir} className="relative min-h-screen bg-offwhite font-cairo text-body">
      <div className="absolute end-4 top-4 z-10 sm:end-6 sm:top-6">
        <UtilityTogglesBar />
      </div>
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10">
        <div className="grid w-full grid-cols-1 overflow-hidden rounded-2xl border border-divider bg-surface shadow-lg md:grid-cols-2">
          <section className="relative hidden overflow-hidden bg-gradient-to-b from-nile to-nile-dark p-8 text-white md:block">
            <div className="relative">
              <div className="mb-4">
                <FikraTechLogo />
              </div>
              <h1 className="mb-3 text-3xl font-extrabold">{t('auth.loginWelcome')}</h1>
              <p className="max-w-sm text-sm leading-7 text-white/80">
                {t('auth.loginWelcomeDesc')}
              </p>
            </div>
          </section>

          <section className="p-6 sm:p-8 md:p-10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-heading">{t('auth.loginTitle')}</h2>
              <p className="mt-1 text-sm text-slateMuted">{t('auth.loginSubtitle')}</p>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-body">
                  {t('common.email')}
                </span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-divider bg-surface py-3 pe-10 ps-4 text-sm outline-none transition focus:border-nile focus:ring-2 focus:ring-nile/15"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-body">
                  {t('common.password')}
                </span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-divider bg-surface py-3 pe-10 ps-4 text-sm outline-none transition focus:border-nile focus:ring-2 focus:ring-nile/15"
                  />
                </div>
              </label>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <label className="flex items-center gap-2 text-slateMuted">
                  <input type="checkbox" className="accent-nile" />
                  {t('auth.rememberMe')}
                </label>
                <button type="button" className="font-semibold text-heading hover:text-gold">
                  {t('auth.forgotPassword')}
                </button>
              </div>

              {error ? (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-nile py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-95 disabled:opacity-60"
              >
                {loading ? t('auth.loggingIn') : t('auth.loginBtn')}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slateMuted">
              {t('auth.noAccount')}{' '}
              <Link to="/register" className="font-bold text-gold hover:text-gold">
                {t('auth.createAccount')}
              </Link>
            </p>

            <div className="mt-6 text-center">
              <Link to="/" className="text-xs font-semibold text-heading/80 hover:text-gold">
                {t('common.backHome')}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
