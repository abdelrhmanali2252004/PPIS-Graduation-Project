import { Link } from 'react-router-dom'

const nav = [
  { href: '#hero', label: 'الرئيسية' },
  { href: '#about', label: 'رؤيتنا' },
  { href: '#services', label: 'المميزات الذكية' },
  { href: '#contact', label: 'اتصل بنا' },
]

export default function LandingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-nile shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-10 w-10 rotate-45 border-2 border-gold bg-gold/20 mx-3"
            aria-hidden
          />
          <span className="text-lg font-bold text-white">فكرة  TECH</span>
        </div>
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
          <Link
            to="/login"
            className="rounded-lg border border-white/40 px-3 py-2 text-sm font-medium text-white transition-colors hover:border-gold hover:text-gold"
          >
            تسجيل الدخول
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-gold px-3 py-2 text-sm font-bold text-nile-dark transition-opacity hover:opacity-90"
          >
            إنشاء حساب
          </Link>
        </div>
      </div>
    </header>
  )
}
