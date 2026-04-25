import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { TOKEN_STORAGE_KEY } from "../../api/client";

const nav = [
  { href: "#hero", label: "الرئيسية" },
  { href: "#about", label: "رؤيتنا" },
  { href: "#services", label: "خدماتنا" },
  { href: "#contact", label: "اتصل بنا" },
];

export default function LandingHeader() {
  const navigate = useNavigate();
  const readAuthState = () => Boolean(localStorage.getItem(TOKEN_STORAGE_KEY));
  const [isLoggedIn, setIsLoggedIn] = useState(readAuthState);
  const userName = (() => {
    const hasToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (hasToken) {
      const userData = localStorage.getItem("ideaTechUser");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          return user.name || "مستخدم";
        } catch {
          return "مستخدم";
        }
      }
    } 
    return "مستخدم";
  })();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showDropdown &&
        !(event.target as Element).closest(".profile-dropdown")
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  useEffect(() => {
    const syncAuthState = () => setIsLoggedIn(readAuthState());

    syncAuthState();
    window.addEventListener("focus", syncAuthState);
    window.addEventListener("storage", syncAuthState);

    return () => {
      window.removeEventListener("focus", syncAuthState);
      window.removeEventListener("storage", syncAuthState);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    navigate("/", { replace: true });
    setIsLoggedIn(false);
    setShowDropdown(false);
  };

  const handleMenuClick = (action: string) => {
    setShowDropdown(false);
    switch (action) {
      case "profile":
        // TODO: Navigate to profile page
        break;
      case "feasibility":
        navigate("/app/step3");
        break;
      case "dashboard":
        navigate("/app/step5");
        break;
      case "logout":
        handleLogout();
        break;
    }
  };
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-nile shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-10 w-10 rotate-45 border-2 border-gold bg-gold/20 mx-3"
            aria-hidden
          />
          <span className="text-lg font-bold text-white">فكرة TECH</span>
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
          {isLoggedIn ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                <span>مرحباً {userName}</span>
                <User className="h-4 w-4" />
              </button>
              {showDropdown && (
                <div className="profile-dropdown absolute right-0 top-full mt-2 w-48 rounded-lg border border-white/20 bg-nile py-2 shadow-lg">
                  <button
                    type="button"
                    onClick={() => handleMenuClick("profile")}
                    className="block w-full px-4 py-2 text-right text-sm text-white hover:bg-white/10"
                  >
                    تعديل البروفايل
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMenuClick("feasibility")}
                    className="block w-full px-4 py-2 text-right text-sm text-white hover:bg-white/10"
                  >
                    صفحة مخرجات الجدوى
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMenuClick("dashboard")}
                    className="block w-full px-4 py-2 text-right text-sm text-white hover:bg-white/10"
                  >
                    لوحة التحكم
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMenuClick("logout")}
                    className="block w-full px-4 py-2 text-right text-sm text-white hover:bg-white/10"
                  >
                    تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </header>
  );
}
