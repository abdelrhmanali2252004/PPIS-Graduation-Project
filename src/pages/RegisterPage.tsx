import { Link } from 'react-router-dom'
import { User, Mail, Phone, Lock } from 'lucide-react'

export default function RegisterPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-offwhite font-cairo text-body">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10">
        <div className="grid w-full grid-cols-1 overflow-hidden rounded-2xl border border-divider bg-white shadow-lg md:grid-cols-2">
          <section className="p-6 sm:p-8 md:p-10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-nile">إنشاء حساب جديد</h2>
              <p className="mt-1 text-sm text-slateMuted">ابدأ رحلتك مع NextVenture OS في دقائق</p>
            </div>

            <form className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-body">الاسم الكامل</span>
                <div className="relative">
                  <User className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
                  <input
                    type="text"
                    placeholder="اكتب اسمك"
                    className="w-full rounded-xl border border-divider bg-white py-3 pr-10 pl-4 text-sm outline-none transition focus:border-nile focus:ring-2 focus:ring-nile/15"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-body">البريد الإلكتروني</span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-divider bg-white py-3 pr-10 pl-4 text-sm outline-none transition focus:border-nile focus:ring-2 focus:ring-nile/15"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-body">رقم الهاتف</span>
                <div className="relative">
                  <Phone className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
                  <input
                    type="tel"
                    placeholder="+20 10 0000 0000"
                    className="w-full rounded-xl border border-divider bg-white py-3 pr-10 pl-4 text-sm outline-none transition focus:border-nile focus:ring-2 focus:ring-nile/15"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-body">كلمة المرور</span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-divider bg-white py-3 pr-10 pl-4 text-sm outline-none transition focus:border-nile focus:ring-2 focus:ring-nile/15"
                  />
                </div>
              </label>

              <button
                type="submit"
                className="w-full rounded-xl bg-gold py-3 text-sm font-bold text-nile-dark shadow-md transition-opacity hover:opacity-95"
              >
                إنشاء حساب
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slateMuted">
              لديك حساب بالفعل؟{' '}
              <Link to="/login" className="font-bold text-nile hover:text-gold">
                تسجيل الدخول
              </Link>
            </p>
          </section>

          <section className="relative hidden overflow-hidden bg-gradient-to-b from-nile to-nile-dark p-8 text-white md:block">
            <div
              className="pointer-events-none absolute -right-10 top-8 h-28 w-28 rotate-12 border border-gold/30 bg-gold/10"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute bottom-10 left-10 h-20 w-20 rounded-full border border-white/20 bg-white/5"
              aria-hidden
            />
            <div className="relative">
              <span className="mb-4 inline-block rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
                NextVenture OS
              </span>
              <h1 className="mb-3 text-3xl font-extrabold">ابنِ مشروعك بثقة</h1>
              <p className="max-w-sm text-sm leading-7 text-white/80">
                بعد إنشاء الحساب، ستبدأ مباشرة في مركز أبحاث السوق وتبني خطة مشروعك خطوة خطوة.
              </p>
              <div className="mt-6 space-y-2 text-sm text-white/85">
                <div>• تحليل سوق محلي مخصص لأسيوط</div>
                <div>• توقعات مالية ذكية</div>
                <div>• متابعة تنفيذية في لوحة التحكم</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
