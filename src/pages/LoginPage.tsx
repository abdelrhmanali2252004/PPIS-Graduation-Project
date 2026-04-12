import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const storedUser = localStorage.getItem("ideaTechUser");
    if (!storedUser) {
      setError("لا يوجد حساب مسجل. الرجاء إنشاء حساب أولاً.");
      return;
    }

    try {
      const user = JSON.parse(storedUser) as {
        email: string;
        password: string;
      };
      if (email.trim() === user.email && password === user.password) {
        localStorage.setItem("ideaTechSession", user.email);
        navigate("/app/step1", { replace: true });
      } else {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
      }
    } catch {
      setError("حدث خطأ أثناء قراءة بيانات الحساب. الرجاء إعادة التسجيل.");
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-offwhite font-cairo text-body">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10">
        <div className="grid w-full grid-cols-1 overflow-hidden rounded-2xl border border-divider bg-white shadow-lg md:grid-cols-2">
          <section className="relative hidden overflow-hidden bg-gradient-to-b from-nile to-nile-dark p-8 text-white md:block">
            <div
              className="pointer-events-none absolute -left-10 top-8 h-28 w-28 rotate-12 border border-gold/30 bg-gold/10"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute bottom-10 right-10 h-20 w-20 rounded-full border border-white/20 bg-white/5"
              aria-hidden
            />
            <div className="relative">
              <span className="mb-4 inline-block text-lg font-bold text-white">
                فكرة TECH
              </span>
              <h1 className="mb-3 text-3xl font-extrabold">مرحباً بعودتك</h1>
              <p className="max-w-sm text-sm leading-7 text-white/80">
                سجّل الدخول لمتابعة مشروعك وخطتك الذكية، وتتبع التقدم خطوة
                بخطوة.
              </p>
            </div>
          </section>

          <section className="p-6 sm:p-8 md:p-10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-nile">تسجيل الدخول</h2>
              <p className="mt-1 text-sm text-slateMuted">
                أدخل بياناتك للوصول إلى حسابك
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-body">
                  البريد الإلكتروني
                </span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-divider bg-white py-3 pr-10 pl-4 text-sm outline-none transition focus:border-nile focus:ring-2 focus:ring-nile/15"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-body">
                  كلمة المرور
                </span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-divider bg-white py-3 pr-10 pl-4 text-sm outline-none transition focus:border-nile focus:ring-2 focus:ring-nile/15"
                  />
                </div>
              </label>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <label className="flex items-center gap-2 text-slateMuted">
                  <input type="checkbox" className="accent-nile" />
                  تذكرني
                </label>
                <button
                  type="button"
                  className="font-semibold text-nile hover:text-gold"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>

              {error ? (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                className="w-full rounded-xl bg-nile py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-95"
              >
                دخول
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slateMuted">
              ليس لديك حساب؟{" "}
              <Link
                to="/register"
                className="font-bold text-gold hover:text-nile"
              >
                إنشاء حساب
              </Link>
            </p>

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-xs font-semibold text-nile/80 hover:text-gold"
              >
                العودة إلى الصفحة الرئيسية
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
