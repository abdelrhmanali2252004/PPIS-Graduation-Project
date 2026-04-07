import { CloudUpload, Building2, Zap, Target, MapPin } from 'lucide-react'

export default function MarketResearchContent() {
  return (
    <div className="px-8 py-8 pb-14 font-cairo md:px-10" dir="rtl">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-body md:text-2xl">الخطوة الأولى: مركز أبحاث السوق</h1>
        <p className="mt-1 text-sm font-medium text-nile">Step 1: Market Research Hub</p>
      </header>
      <p className="mb-8 max-w-3xl text-sm leading-7 text-body/80">
        ابدأ من وقائع موثقة: إما رفع مستنداتك الحالية ليقرأها الذكاء الاصطناعي ويستشهد بها، أو اطلب
        دراسة سوق يعدّها فريقنا مدعوماً بالذكاء الاصطناعي وبيانات محلية من أسيوط.
      </p>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
        <div
          className="flex-1 rounded-2xl border border-divider bg-white p-6 shadow-sm"
          style={{ borderTop: '4px solid #1B4C8C' }}
        >
          <span className="mb-3 inline-block rounded-full bg-nile/10 px-2 py-0.5 text-xs font-bold text-nile">
            RAG Technology
          </span>
          <h2 className="mb-4 text-lg font-bold text-nile">لديك ملفات بالفعل؟</h2>
          <div className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-nile/30 bg-offwhite/50 px-4 py-8 transition-colors hover:border-nile/50">
            <CloudUpload className="mb-3 h-10 w-10 text-nile/60" />
            <p className="mb-2 text-center text-sm font-medium text-body">
              اسحب ملفات PDF هنا أو انقر للتحميل
            </p>
            <span className="rounded-md bg-nile/10 px-2 py-1 text-xs text-nile">PDF فقط</span>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-slateMuted">
            يقرأ النظام تقارير الغرفة التجارية والعقود الممسوحة ضوئياً ويستخرج الجداول والشروح
            للاستخدام في دراستك.
          </p>
          <div className="mt-6">
            <div className="mb-1 flex justify-between text-xs text-slateMuted">
              <span>مؤشر الثقة (تجريبي)</span>
              <span>—</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-divider">
              <div
                className="h-full w-[35%] rounded-full bg-gradient-to-l from-gold to-nile"
                aria-hidden
              />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-center px-2 lg:flex-col lg:py-0" aria-hidden>
          <div className="hidden h-px flex-1 bg-divider lg:block lg:h-auto lg:w-px lg:flex-none" />
          <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-gold">أو</span>
          <div className="hidden h-px flex-1 bg-divider lg:block lg:h-auto lg:w-px lg:flex-none" />
        </div>

        <div
          className="flex-1 rounded-2xl border border-divider bg-white p-6 shadow-sm"
          style={{ borderTop: '4px solid #C9A05D' }}
        >
          <span className="mb-3 inline-block rounded-full bg-gold/15 px-2 py-0.5 text-xs font-bold text-nile-dark">
            AI + Team
          </span>
          <h2 className="mb-4 text-lg font-bold text-body">أو، اطلب إعداد دراسة السوق</h2>
          <div className="mb-6 flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-2 text-body/90">
              <Zap className="h-4 w-4 text-gold" /> سريع
            </span>
            <span className="flex items-center gap-2 text-body/90">
              <Target className="h-4 w-4 text-gold" /> دقيق
            </span>
            <span className="flex items-center gap-2 text-body/90">
              <MapPin className="h-4 w-4 text-gold" /> محلي
            </span>
          </div>
          <button
            type="button"
            className="mb-4 w-full rounded-xl bg-gradient-to-l from-gold to-gold/80 py-3 text-sm font-bold text-nile-dark shadow-md transition-opacity hover:opacity-95"
          >
            اطلب دراسة السوق الآن
          </button>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slateMuted">
            <Building2 className="h-4 w-4" />
            <span>تقدير التسليم: ٣–٥ أيام عمل</span>
            <span className="rounded-md bg-nile/10 px-2 py-0.5 font-medium text-nile">أسيوط</span>
          </div>
        </div>
      </div>
    </div>
  )
}
