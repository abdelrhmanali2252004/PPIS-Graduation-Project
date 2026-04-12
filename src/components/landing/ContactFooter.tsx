import { Mail, MapPin, Phone } from "lucide-react";

function IconLinkedin({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconTwitter({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function IconFacebook({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export default function ContactFooter() {
  return (
    <footer id="contact" className="bg-body px-4 py-14 text-white">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-8 text-center text-2xl font-bold text-gold">
          اتصل بنا
        </h2>
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
            <Phone className="mx-auto mb-2 h-5 w-5 text-gold" />
            <div className="mb-1 text-xs text-white/60">الهاتف</div>
            <div className="text-sm font-semibold text-white/90" dir="ltr">
              +20 88 123 4567
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
            <Mail className="mx-auto mb-2 h-5 w-5 text-gold" />
            <div className="mb-1 text-xs text-white/60">البريد الإلكتروني</div>
            <div className="text-sm font-semibold text-white/90">
              hello@nextventure.os
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center sm:col-span-2 lg:col-span-1">
            <MapPin className="mx-auto mb-2 h-5 w-5 text-gold" />
            <div className="mb-1 text-xs text-white/60">العنوان</div>
            <div className="text-sm font-semibold text-white/90">
             جامعه أسيوط
            </div>
          </div>
        </div>
        <div className="mb-8 flex justify-center gap-4">
          <a
            href="#"
            className="text-slateMuted transition-colors hover:text-gold"
            aria-label="LinkedIn"
          >
            <IconLinkedin className="h-6 w-6" />
          </a>
          <a
            href="#"
            className="text-slateMuted transition-colors hover:text-gold"
            aria-label="Twitter"
          >
            <IconTwitter className="h-6 w-6" />
          </a>
          <a
            href="#"
            className="text-slateMuted transition-colors hover:text-gold"
            aria-label="Facebook"
          >
            <IconFacebook className="h-6 w-6" />
          </a>
        </div>
        <p className="text-center text-xs text-white/50">
          © {new Date().getFullYear()} FkraTech جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}
