import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../../api/client'
import FikraTechLogo from '../branding/FikraTechLogo'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { logoutUser } from '../../store/slices/authSlice'
import UtilityTogglesBar from '../../layouts/UtilityTogglesBar'
import { useTranslation } from '../../i18n/LanguageContext'
import { ADMIN_PAGES } from '../../config/adminNav'
import { isAdminUser, type AuthUser } from '../../types/auth'

function readStoredUserName(fallback: string): string {
  const rawUser = localStorage.getItem(USER_STORAGE_KEY)
  if (!rawUser) {
    return fallback
  }

  try {
    const user = JSON.parse(rawUser) as { name?: string }
    return user.name?.trim() || fallback
  } catch {
    return fallback
  }
}

function readStoredAuthUser(): AuthUser | null {
  const rawUser = localStorage.getItem(USER_STORAGE_KEY)
  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser) as AuthUser
  } catch {
    return null
  }
}

export default function LandingHeader() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { t, dir } = useTranslation()
  const authUser = useAppSelector((state) => state.auth.user)
  const readAuthState = () => Boolean(localStorage.getItem(TOKEN_STORAGE_KEY))
  const [isLoggedIn, setIsLoggedIn] = useState(readAuthState)
  const [userName, setUserName] = useState(
    () => authUser?.name?.trim() || readStoredUserName(t('common.user')),
  )
  const [showDropdown, setShowDropdown] = useState(false)

  const currentUser = authUser ?? readStoredAuthUser()
  const isAdmin = isAdminUser(currentUser)

  const nav = [
    { href: '#hero', label: t('nav.home') },
    { href: '#about', label: t('nav.about') },
    { href: '#services', label: t('nav.services') },
    { href: '#contact', label: t('nav.contact') },
  ]

  const userMenuItems = useMemo(
    () => [
      { action: 'profile', label: t('header.editProfile') },
      { action: 'feasibility', label: t('header.feasibility') },
      { action: 'dashboard', label: t('header.dashboard') },
      { action: 'logout', label: t('header.logout') },
    ],
    [t],
  )

  const adminMenuItems = useMemo(
    () => [
      { action: 'profile', label: t('header.editProfile') },
      ...ADMIN_PAGES.map((page) => ({
        action: page.id,
        label: t(page.labelKey),
      })),
      { action: 'logout', label: t('header.logout') },
    ],
    [t],
  )

  const menuItems = isAdmin ? adminMenuItems : userMenuItems

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown && !(event.target as Element).closest('.profile-dropdown')) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showDropdown])

  useEffect(() => {
    setUserName(authUser?.name?.trim() || readStoredUserName(t('common.user')))
  }, [authUser?.name, t])

  useEffect(() => {
    const syncAuthState = () => {
      setIsLoggedIn(readAuthState())
      setUserName(readStoredUserName(t('common.user')))
    }

    syncAuthState()
    window.addEventListener('focus', syncAuthState)
    window.addEventListener('storage', syncAuthState)

    return () => {
      window.removeEventListener('focus', syncAuthState)
      window.removeEventListener('storage', syncAuthState)
    }
  }, [t])

  const handleLogout = () => {
    void dispatch(logoutUser())
    navigate('/', { replace: true })
    setIsLoggedIn(false)
    setUserName(t('common.user'))
    setShowDropdown(false)
  }

  const handleMenuClick = (action: string) => {
    setShowDropdown(false)

    if (action === 'logout') {
      handleLogout()
      return
    }

    if (action === 'profile') {
      navigate(isAdmin ? '/dashboard/admin/profile' : '/dashboard/user/profile')
      return
    }

    if (isAdmin) {
      const adminPage = ADMIN_PAGES.find((page) => page.id === action)
      if (adminPage) {
        navigate(adminPage.to)
      }
      return
    }

    switch (action) {
      case 'feasibility':
        navigate('/app/step3')
        break
      case 'dashboard':
        navigate('/app/step5')
        break
    }
  }

  const dropdownAlign = dir === 'rtl' ? 'right-0 text-right' : 'left-0 text-left'

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-nile shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 sm:py-3">
        <Link to="/" className="inline-flex rounded-xl px-1 py-1" aria-label="Fikra Tech">
          <FikraTechLogo />
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-white/90 transition-colors hover:text-gold"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <UtilityTogglesBar variant="dark" />
          {isLoggedIn ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                <span>
                  {t('header.welcome')} {userName}
                </span>
                <User className="h-4 w-4" />
              </button>
              {showDropdown ? (
                <div
                  className={`profile-dropdown absolute top-full mt-2 w-52 rounded-lg border border-white/20 bg-nile py-2 shadow-lg ${dropdownAlign}`}
                >
                  {menuItems.map((item, index) => (
                    <button
                      key={item.action}
                      type="button"
                      onClick={() => handleMenuClick(item.action)}
                      className={`block w-full px-4 py-2 text-sm text-white hover:bg-white/10 ${
                        isAdmin && item.action === 'logout' && index === menuItems.length - 1
                          ? 'border-t border-white/15'
                          : ''
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg border border-white/40 px-3 py-2 text-sm font-medium text-white transition-colors hover:border-gold hover:text-gold"
              >
                {t('header.login')}
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-gold px-3 py-2 text-sm font-bold text-nile-dark transition-opacity hover:opacity-90"
              >
                {t('header.register')}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
