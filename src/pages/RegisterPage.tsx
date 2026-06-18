import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Phone, Lock } from 'lucide-react'
import { registerUser, clearAuthError } from '../store/slices/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { getDashboardHomePath, getUserRole } from '../types/auth'
import FikraTechLogo from '../components/branding/FikraTechLogo'
import LanguageToggle from '../i18n/LanguageToggle'
import { useLanguage } from '../i18n/LanguageContext'

export default function RegisterPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)
  const { t, dir } = useLanguage()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setValidationError(null)
    dispatch(clearAuthError())

    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setValidationError(t('auth.fillAllFields'))
      return
    }

    const action = await dispatch(
      registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
        phoneNumber: phone.trim(),
      }),
    )

    if (registerUser.fulfilled.match(action)) {
      if (action.payload.mode === 'authenticated') {
        const role = getUserRole(action.payload.data.user)
        navigate(getDashboardHomePath(role), { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    }
  }

  const displayError = validationError ?? error

  return (
    <div dir={dir} className="relative min-h-screen bg-offwhite font-cairo text-body">
      <div className="absolute end-4 top-4 z-10 sm:end-6 sm:top-6">
        <LanguageToggle />
      </div>
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10">
        <div className="grid w-full grid-cols-1 overflow-hidden rounded-2xl border border-divider bg-white shadow-lg md:grid-cols-2">
          <section className="p-6 sm:p-8 md:p-10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-nile">{t('auth.registerTitle')}</h2>
              <p className="mt-1 text-sm text-slateMuted">{t('auth.registerSubtitle')}</p>
            </div>

            <form className="space-y-4" onSubmit={handleRegister}>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-body">
                  {t('auth.fullName')}
                </span>
                <div className="relative">
                  <User className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder={t('auth.namePlaceholder')}
                    className="w-full rounded-xl border border-divider bg-white py-3 pe-10 ps-4 text-sm outline-none transition focus:border-nile focus:ring-2 focus:ring-nile/15"
                  />
                </div>
              </label>

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
                    className="w-full rounded-xl border border-divider bg-white py-3 pe-10 ps-4 text-sm outline-none transition focus:border-nile focus:ring-2 focus:ring-nile/15"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-body">
                  {t('auth.phone')}
                </span>
                <div className="relative">
                  <Phone className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    placeholder="+20 10 0000 0000"
                    className="w-full rounded-xl border border-divider bg-white py-3 pe-10 ps-4 text-sm outline-none transition focus:border-nile focus:ring-2 focus:ring-nile/15"
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
                    className="w-full rounded-xl border border-divider bg-white py-3 pe-10 ps-4 text-sm outline-none transition focus:border-nile focus:ring-2 focus:ring-nile/15"
                  />
                </div>
              </label>

              {displayError ? (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {displayError}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gold py-3 text-sm font-bold text-nile-dark shadow-md transition-opacity hover:opacity-95 disabled:opacity-60"
              >
                {loading ? t('auth.registering') : t('auth.registerBtn')}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slateMuted">
              {t('auth.hasAccount')}{' '}
              <Link to="/login" className="font-bold text-nile hover:text-gold">
                {t('auth.loginBtn')}
              </Link>
            </p>
          </section>

          <section className="relative hidden overflow-hidden bg-gradient-to-b from-nile to-nile-dark p-8 text-white md:block">
            <div className="relative">
              <div className="mb-4">
                <FikraTechLogo />
              </div>
              <h1 className="mb-3 text-3xl font-extrabold">{t('auth.registerWelcome')}</h1>
              <p className="max-w-sm text-sm leading-7 text-white/80">
                {t('auth.registerWelcomeDesc')}
              </p>
              <div className="mt-6 space-y-2 text-sm text-white/85">
                <div>{t('auth.registerFeature1')}</div>
                <div>{t('auth.registerFeature2')}</div>
                <div>{t('auth.registerFeature3')}</div>
                <div>{t('auth.registerFeature4')}</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
