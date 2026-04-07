export default function FeasibilityLoading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-10" dir="rtl">
      <div className="w-full max-w-xl rounded-2xl border border-divider bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 h-14 w-14 animate-pulse rounded-full bg-nile/10 p-3">
          <div className="h-full w-full animate-spin rounded-full border-4 border-nile/20 border-t-nile" />
        </div>
        <h2 className="mb-2 text-lg font-bold text-nile">جاري توليد مخرجات دراسة الجدوى</h2>
        <p className="mb-5 text-sm text-slateMuted">
          الذكاء الاصطناعي يحلل بيانات مشروعك ويعد النتائج النهائية...
        </p>
        <div className="mx-auto h-2 w-full max-w-sm overflow-hidden rounded-full bg-divider">
          <div className="h-full w-full animate-pulse rounded-full bg-gradient-to-l from-gold to-nile" />
        </div>
        <p className="mt-3 text-xs text-slateMuted">يرجى الانتظار لثوانٍ قليلة</p>
      </div>
    </div>
  )
}
