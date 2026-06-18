import { useEffect, useState, type FormEvent } from 'react'
import { KeyRound, Lock, Mail, Phone, Shield, Smartphone, User } from 'lucide-react'
import {
  addSecondaryPhone,
  getOtpDeliveryMessage,
  readApiError,
  resetPasswordWithOtp,
  sendProfileOtp,
  type OtpChannel,
} from '../api/profile'
import {
  changeUserPassword,
  fetchUserProfile,
  updateUserProfile,
} from '../store/slices/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { useLanguage } from '../i18n/LanguageContext'

const inputClassName =
  'w-full rounded-xl border border-divider bg-white py-3 pe-10 ps-4 text-sm outline-none transition focus:border-nile focus:ring-2 focus:ring-nile/15'

const readOnlyClassName =
  'w-full rounded-xl border border-divider bg-offwhite py-3 pe-10 ps-4 text-sm text-slateMuted outline-none'

function getLocalizedRoleLabel(role: string | null | undefined, t: (key: string) => string) {
  switch (role?.trim().toLowerCase()) {
    case 'admin':
      return t('roles.admin')
    case 'specialist':
      return t('roles.specialist')
    default:
      return t('roles.user')
  }
}

export default function ProfileSettingsPage() {
  const dispatch = useAppDispatch()
  const { t } = useLanguage()
  const { user, profileLoading, profileSaving, passwordSaving } = useAppSelector(
    (state) => state.auth,
  )

  const [name, setName] = useState('')
  const [showSecondaryForm, setShowSecondaryForm] = useState(false)

  const [secondaryPhoneInput, setSecondaryPhoneInput] = useState('')
  const [secondaryOtpChannel, setSecondaryOtpChannel] = useState<OtpChannel>('email')
  const [secondaryOtp, setSecondaryOtp] = useState('')
  const [secondaryOtpSent, setSecondaryOtpSent] = useState(false)
  const [secondaryLoading, setSecondaryLoading] = useState(false)
  const [secondaryError, setSecondaryError] = useState<string | null>(null)
  const [secondarySuccess, setSecondarySuccess] = useState<string | null>(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotChannel, setForgotChannel] = useState<OtpChannel>('email')
  const [forgotOtp, setForgotOtp] = useState('')
  const [forgotNewPassword, setForgotNewPassword] = useState('')
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('')
  const [forgotOtpSent, setForgotOtpSent] = useState(false)
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotError, setForgotError] = useState<string | null>(null)
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null)

  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  const hasSecondaryPhone = Boolean(user?.secondaryPhoneNumber?.trim())

  useEffect(() => {
    void dispatch(fetchUserProfile()).then((action) => {
      if (fetchUserProfile.rejected.match(action)) {
        setLoadError(action.payload ?? readApiError(action.error))
      }
    })
  }, [dispatch])

  useEffect(() => {
    if (!user) return
    setName(user.name ?? '')
  }, [user])

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setProfileError(null)
    setProfileSuccess(null)
    setValidationError(null)

    const trimmedName = name.trim()
    if (!trimmedName) {
      setValidationError(t('profile.errors.nameRequired'))
      return
    }

    const action = await dispatch(updateUserProfile({ name: trimmedName }))

    if (updateUserProfile.fulfilled.match(action)) {
      setProfileSuccess(t('profile.success.profileSaved'))
      return
    }

    setProfileError(action.payload ?? readApiError(action.error))
  }

  const handleRequestSecondaryOtp = async () => {
    setSecondaryError(null)
    setSecondarySuccess(null)
    setValidationError(null)

    const trimmedPhone = secondaryPhoneInput.trim()
    if (!trimmedPhone) {
      setValidationError(t('profile.errors.enterSecondaryPhone'))
      return
    }

    if (trimmedPhone === user?.phoneNumber?.trim()) {
      setValidationError(t('profile.errors.secondaryMustDiffer'))
      return
    }

    setSecondaryLoading(true)
    try {
      const result = await sendProfileOtp('secondary_phone', secondaryOtpChannel)
      if (result.success === false) {
        setSecondaryError(result.message)
        return
      }
      setSecondaryOtpSent(true)
      setSecondarySuccess(getOtpDeliveryMessage(result, secondaryOtpChannel))
    } catch (error) {
      setSecondaryError(readApiError(error))
    } finally {
      setSecondaryLoading(false)
    }
  }

  const handleVerifySecondaryPhone = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSecondaryError(null)
    setSecondarySuccess(null)
    setValidationError(null)

    const trimmedPhone = secondaryPhoneInput.trim()
    if (!trimmedPhone || !secondaryOtp.trim()) {
      setValidationError(t('profile.errors.enterPhoneAndOtp'))
      return
    }

    setSecondaryLoading(true)
    try {
      await addSecondaryPhone({
        secondaryPhoneNumber: trimmedPhone,
        otp: secondaryOtp.trim(),
      })
      await dispatch(fetchUserProfile())
      setSecondarySuccess(t('profile.success.secondaryAdded'))
      setSecondaryOtp('')
      setSecondaryOtpSent(false)
      setSecondaryPhoneInput('')
      setShowSecondaryForm(false)
    } catch (error) {
      setSecondaryError(readApiError(error))
    } finally {
      setSecondaryLoading(false)
    }
  }

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(null)
    setValidationError(null)

    if (!currentPassword.trim()) {
      setValidationError(t('profile.errors.enterCurrentPassword'))
      return
    }

    if (newPassword.length < 6) {
      setValidationError(t('profile.errors.passwordMinLength'))
      return
    }

    if (newPassword !== confirmPassword) {
      setValidationError(t('profile.errors.passwordMismatch'))
      return
    }

    const action = await dispatch(
      changeUserPassword({
        currentPassword,
        newPassword,
      }),
    )

    if (changeUserPassword.fulfilled.match(action)) {
      setPasswordSuccess(action.payload || t('profile.success.passwordChanged'))
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      return
    }

    setPasswordError(action.payload ?? readApiError(action.error))
  }

  const handleRequestForgotOtp = async () => {
    setForgotError(null)
    setForgotSuccess(null)
    setValidationError(null)

    setForgotLoading(true)
    try {
      const result = await sendProfileOtp('password_reset', forgotChannel)
      if (result.success === false) {
        setForgotError(result.message)
        return
      }
      setForgotOtpSent(true)
      setForgotSuccess(getOtpDeliveryMessage(result, forgotChannel))
    } catch (error) {
      setForgotError(readApiError(error))
    } finally {
      setForgotLoading(false)
    }
  }

  const handleForgotPasswordReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setForgotError(null)
    setValidationError(null)

    if (!forgotOtp.trim()) {
      setValidationError(t('profile.errors.enterOtp'))
      return
    }

    if (forgotNewPassword.length < 6) {
      setValidationError(t('profile.errors.passwordMinLength'))
      return
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setValidationError(t('profile.errors.passwordMismatch'))
      return
    }

    setForgotLoading(true)
    try {
      const message = await resetPasswordWithOtp({
        otp: forgotOtp.trim(),
        newPassword: forgotNewPassword,
      })
      setForgotSuccess(message)
      setForgotOtp('')
      setForgotNewPassword('')
      setForgotConfirmPassword('')
      setForgotOtpSent(false)
      setShowForgotPassword(false)
    } catch (error) {
      setForgotError(readApiError(error))
    } finally {
      setForgotLoading(false)
    }
  }

  if (profileLoading && !user) {
    return (
      <section className="p-6 lg:p-10">
        <div className="max-w-3xl animate-pulse space-y-4">
          <div className="h-8 w-48 rounded-lg bg-slate-200" />
          <div className="h-4 w-72 rounded bg-slate-100" />
          <div className="h-64 rounded-2xl bg-slate-100" />
        </div>
      </section>
    )
  }

  return (
    <section className="p-6 lg:p-10">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-body">{t('profile.title')}</h1>
        <p className="mt-2 text-sm text-slateMuted">{t('profile.subtitle')}</p>
      </div>

      {loadError ? (
        <div className="mb-6 max-w-3xl rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      ) : null}

      {validationError ? (
        <div className="mb-6 max-w-3xl rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {validationError}
        </div>
      ) : null}

      <div className="max-w-3xl space-y-6">
        <article className="rounded-2xl border border-divider bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-bold text-nile">{t('profile.personal')}</h2>
          <p className="mb-6 text-sm text-slateMuted">{t('profile.personalDesc')}</p>

          {profileSuccess ? (
            <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-success">
              {profileSuccess}
            </div>
          ) : null}

          {profileError ? (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {profileError}
            </div>
          ) : null}

          <form className="space-y-4" onSubmit={handleProfileSubmit}>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-body">{t('profile.name')}</span>
              <div className="relative">
                <User className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder={t('profile.namePlaceholder')}
                  className={inputClassName}
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
                  value={user?.email ?? ''}
                  type="email"
                  readOnly
                  disabled
                  className={readOnlyClassName}
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-body">
                {t('profile.primaryPhone')}
              </span>
              <div className="relative">
                <Phone className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
                <input
                  value={user?.phoneNumber ?? ''}
                  type="tel"
                  readOnly
                  disabled
                  className={readOnlyClassName}
                />
              </div>
              <p className="mt-1.5 text-xs text-slateMuted">{t('profile.primaryPhoneNote')}</p>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-body">{t('profile.accountType')}</span>
              <div className="relative">
                <Shield className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
                <input
                  value={getLocalizedRoleLabel(user?.role, t)}
                  type="text"
                  readOnly
                  disabled
                  className={readOnlyClassName}
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={profileSaving}
              className="rounded-xl bg-nile px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-95 disabled:opacity-60"
            >
              {profileSaving ? t('common.saving') : t('common.save')}
            </button>
          </form>
        </article>

        <article className="rounded-2xl border border-divider bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-bold text-nile">{t('profile.secondarySection')}</h2>
          <p className="mb-6 text-sm text-slateMuted">{t('profile.secondaryDesc')}</p>

          {secondarySuccess ? (
            <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-success">
              {secondarySuccess}
            </div>
          ) : null}

          {secondaryError ? (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {secondaryError}
            </div>
          ) : null}

          {hasSecondaryPhone ? (
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-body">
                {t('profile.secondaryPhone')}
              </span>
              <div className="relative">
                <Smartphone className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
                <input
                  value={user?.secondaryPhoneNumber ?? ''}
                  type="tel"
                  readOnly
                  disabled
                  className={readOnlyClassName}
                />
              </div>
            </label>
          ) : !showSecondaryForm ? (
            <button
              type="button"
              onClick={() => setShowSecondaryForm(true)}
              className="rounded-xl border border-nile bg-white px-5 py-2.5 text-sm font-bold text-nile transition-colors hover:bg-nile/5"
            >
              {t('profile.addPhone')}
            </button>
          ) : (
            <form className="space-y-4" onSubmit={handleVerifySecondaryPhone}>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-body">
                  {t('profile.newPhone')}
                </span>
                <div className="relative">
                  <Smartphone className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
                  <input
                    value={secondaryPhoneInput}
                    onChange={(e) => setSecondaryPhoneInput(e.target.value)}
                    type="tel"
                    placeholder="+20 11 0000 0000"
                    className={inputClassName}
                    disabled={secondaryOtpSent}
                  />
                </div>
              </label>

              <fieldset className="space-y-2">
                <legend className="mb-1.5 text-sm font-semibold text-body">
                  {t('profile.sendOtpVia')}
                </legend>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-body">
                  <input
                    type="radio"
                    name="secondaryOtpChannel"
                    value="email"
                    checked={secondaryOtpChannel === 'email'}
                    onChange={() => setSecondaryOtpChannel('email')}
                    disabled={secondaryOtpSent}
                  />
                  {t('profile.registeredEmail')} ({user?.email})
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-body">
                  <input
                    type="radio"
                    name="secondaryOtpChannel"
                    value="phone"
                    checked={secondaryOtpChannel === 'phone'}
                    onChange={() => setSecondaryOtpChannel('phone')}
                    disabled={secondaryOtpSent}
                  />
                  {t('profile.primaryPhoneChannel')} ({user?.phoneNumber || '—'})
                </label>
              </fieldset>

              {!secondaryOtpSent ? (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void handleRequestSecondaryOtp()}
                    disabled={secondaryLoading}
                    className="rounded-xl border border-nile bg-white px-5 py-2.5 text-sm font-bold text-nile transition-colors hover:bg-nile/5 disabled:opacity-60"
                  >
                    {secondaryLoading ? t('common.sendingOtp') : t('common.sendOtp')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSecondaryForm(false)
                      setSecondaryOtpSent(false)
                      setSecondaryOtp('')
                      setSecondaryPhoneInput('')
                      setSecondaryError(null)
                    }}
                    className="rounded-xl border border-divider px-5 py-2.5 text-sm font-semibold text-slateMuted hover:bg-offwhite"
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              ) : (
                <>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-body">
                      {t('common.otpCode')}
                    </span>
                    <div className="relative">
                      <KeyRound className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
                      <input
                        value={secondaryOtp}
                        onChange={(e) => setSecondaryOtp(e.target.value)}
                        type="text"
                        inputMode="numeric"
                        placeholder={t('common.otpPlaceholder')}
                        className={inputClassName}
                      />
                    </div>
                  </label>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="submit"
                      disabled={secondaryLoading}
                      className="rounded-xl bg-nile px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-95 disabled:opacity-60"
                    >
                      {secondaryLoading ? t('common.verifying') : t('profile.confirmAddPhone')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSecondaryOtpSent(false)
                        setSecondaryOtp('')
                      }}
                      className="rounded-xl border border-divider px-5 py-2.5 text-sm font-semibold text-slateMuted hover:bg-offwhite"
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </article>

        <article className="rounded-2xl border border-divider bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-bold text-nile">{t('profile.security')}</h2>
          <p className="mb-6 text-sm text-slateMuted">{t('profile.securityDesc')}</p>

          {passwordSuccess ? (
            <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-success">
              {passwordSuccess}
            </div>
          ) : null}

          {passwordError ? (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {passwordError}
            </div>
          ) : null}

          <form className="space-y-4" onSubmit={handlePasswordSubmit}>
            <h3 className="text-sm font-bold text-body">{t('profile.changePassword')}</h3>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-body">
                {t('profile.currentPassword')}
              </span>
              <div className="relative">
                <Lock className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
                <input
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  className={inputClassName}
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-body">
                {t('profile.newPassword')}
              </span>
              <div className="relative">
                <Lock className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type="password"
                  placeholder={t('profile.passwordMin')}
                  className={inputClassName}
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-body">
                {t('profile.confirmPassword')}
              </span>
              <div className="relative">
                <Lock className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  placeholder={t('profile.confirmPasswordPlaceholder')}
                  className={inputClassName}
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={passwordSaving}
              className="rounded-xl border border-nile bg-white px-5 py-2.5 text-sm font-bold text-nile transition-colors hover:bg-nile/5 disabled:opacity-60"
            >
              {passwordSaving ? t('profile.changingPassword') : t('profile.changePasswordBtn')}
            </button>
          </form>

          <div className="mt-8 border-t border-divider pt-6">
            <button
              type="button"
              onClick={() => setShowForgotPassword((prev) => !prev)}
              className="text-sm font-bold text-nile hover:text-gold"
            >
              {showForgotPassword ? t('profile.hideForgot') : t('profile.forgotSection')}
            </button>

            {showForgotPassword ? (
              <form className="mt-4 space-y-4" onSubmit={handleForgotPasswordReset}>
                {forgotSuccess ? (
                  <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-success">
                    {forgotSuccess}
                  </div>
                ) : null}

                {forgotError ? (
                  <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {forgotError}
                  </div>
                ) : null}

                <fieldset className="space-y-2">
                  <legend className="mb-1.5 text-sm font-semibold text-body">
                    {t('profile.sendOtpVia')}
                  </legend>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-body">
                    <input
                      type="radio"
                      name="forgotChannel"
                      value="email"
                      checked={forgotChannel === 'email'}
                      onChange={() => setForgotChannel('email')}
                      disabled={forgotOtpSent}
                    />
                    {t('common.email')} ({user?.email})
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-body">
                    <input
                      type="radio"
                      name="forgotChannel"
                      value="phone"
                      checked={forgotChannel === 'phone'}
                      onChange={() => setForgotChannel('phone')}
                      disabled={forgotOtpSent}
                    />
                    {t('profile.primaryPhoneChannel')} ({user?.phoneNumber || '—'})
                  </label>
                </fieldset>

                {!forgotOtpSent ? (
                  <button
                    type="button"
                    onClick={() => void handleRequestForgotOtp()}
                    disabled={forgotLoading}
                    className="rounded-xl border border-nile bg-white px-5 py-2.5 text-sm font-bold text-nile transition-colors hover:bg-nile/5 disabled:opacity-60"
                  >
                    {forgotLoading ? t('common.sendingOtp') : t('common.sendOtp')}
                  </button>
                ) : (
                  <>
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-semibold text-body">
                        {t('common.otpCode')}
                      </span>
                      <div className="relative">
                        <KeyRound className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
                        <input
                          value={forgotOtp}
                          onChange={(e) => setForgotOtp(e.target.value)}
                          type="text"
                          inputMode="numeric"
                          placeholder={t('common.otpPlaceholder')}
                          className={inputClassName}
                        />
                      </div>
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-sm font-semibold text-body">
                        {t('profile.newPassword')}
                      </span>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
                        <input
                          value={forgotNewPassword}
                          onChange={(e) => setForgotNewPassword(e.target.value)}
                          type="password"
                          placeholder={t('profile.passwordMin')}
                          className={inputClassName}
                        />
                      </div>
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-sm font-semibold text-body">
                        {t('profile.confirmPassword')}
                      </span>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
                        <input
                          value={forgotConfirmPassword}
                          onChange={(e) => setForgotConfirmPassword(e.target.value)}
                          type="password"
                          placeholder={t('profile.reenterPassword')}
                          className={inputClassName}
                        />
                      </div>
                    </label>

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="rounded-xl bg-nile px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-95 disabled:opacity-60"
                    >
                      {forgotLoading ? t('profile.changingPassword') : t('profile.resetPasswordBtn')}
                    </button>
                  </>
                )}
              </form>
            ) : null}
          </div>
        </article>
      </div>
    </section>
  )
}
