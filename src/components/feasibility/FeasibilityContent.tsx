import { useEffect, useState } from 'react'
import { Download, Share2 } from 'lucide-react'
import FeasibilityLoading from './FeasibilityLoading'

const TABS = [
  { id: 'summary', label: 'الملخص التنفيذي' },
  { id: 'market', label: 'تحليل السوق' },
  { id: 'financial', label: 'التوقعات المالية' },
  { id: 'tech', label: 'المتطلبات التقنية' },
] as const

export type TabId = (typeof TABS)[number]['id']

function KpiArc({ pct, color }: { pct: number; color: string }) {
  const r = 36
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c
  return (
    <svg width="88" height="88" viewBox="0 0 88 88" className="shrink-0">
      <circle cx="44" cy="44" r={r} fill="none" stroke="#E5E7EB" strokeWidth="8" />
      <circle
        cx="44"
        cy="44"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 44 44)"
      />
    </svg>
  )
}

function SparklineGold() {
  const pts = '4,32 18,28 32,18 46,22 60,10 74,14 88,6'
  return (
    <svg width="92" height="40" viewBox="0 0 92 40" className="text-gold">
      <path d={`M${pts}`} fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function RiskSegments() {
  return (
    <div className="flex h-3 w-full max-w-[120px] gap-1">
      <div className="h-full flex-1 rounded bg-success/40" />
      <div className="h-full flex-1 rounded bg-warning" />
      <div className="h-full flex-1 rounded bg-divider" />
    </div>
  )
}

function DonutChart() {
  return (
    <div className="relative mx-auto h-40 w-40">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="16" />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#1B4C8C"
          strokeWidth="16"
          strokeDasharray="75 251"
          strokeLinecap="butt"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#C9A05D"
          strokeWidth="16"
          strokeDasharray="55 251"
          strokeDashoffset="-75"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#059669"
          strokeWidth="16"
          strokeDasharray="40 251"
          strokeDashoffset="-130"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-body">
        شرائح
      </div>
    </div>
  )
}

type FeasibilityContentProps = {
  tab: TabId
  onTabChange: (tab: TabId) => void
}

export default function FeasibilityContent({ tab, onTabChange }: FeasibilityContentProps) {
  const [isGenerating, setIsGenerating] = useState(true)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsGenerating(false)
    }, 5000)

    return () => window.clearTimeout(timeoutId)
  }, [])

  if (isGenerating) {
    return <FeasibilityLoading />
  }

  return (
    <div className="px-8 py-8 pb-16 font-cairo md:px-10" dir="rtl">
      <header className="mb-6 flex flex-col gap-4 border-b border-divider pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-body md:text-2xl">مخرجات دراسة الجدوى</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-nile/10 px-3 py-1 text-xs font-semibold text-nile">
              مشروع: مطعم أسيوط النموذجي
            </span>
            <span className="rounded-full border border-gold/50 bg-gold/10 px-2 py-0.5 text-xs font-bold text-nile-dark">
              AI-Verified ✦
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-divider bg-white px-3 py-2 text-xs font-semibold text-body hover:bg-offwhite"
          >
            <Download className="h-4 w-4" /> تنزيل
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-divider bg-white px-3 py-2 text-xs font-semibold text-body hover:bg-offwhite"
          >
            <Share2 className="h-4 w-4" /> مشاركة
          </button>
        </div>
      </header>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl border border-divider bg-white p-4 shadow-sm">
          <KpiArc pct={78} color="#059669" />
          <div>
            <div className="text-xs text-slateMuted">جاهزية السوق</div>
            <div className="text-2xl font-black text-success">٧٨٪</div>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-divider bg-white p-4 shadow-sm">
          <SparklineGold />
          <div>
            <div className="text-xs text-slateMuted">العائد التقديري</div>
            <div className="text-2xl font-black text-gold">١٤٢٪</div>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-divider bg-white p-4 shadow-sm">
          <RiskSegments />
          <div>
            <div className="text-xs text-slateMuted">مستوى المخاطرة</div>
            <div className="text-xl font-bold text-warning">متوسط</div>
          </div>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2 border-b border-divider pb-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onTabChange(t.id)}
            className={`rounded-t-lg px-4 py-2 text-sm font-semibold transition-colors ${
              tab === t.id ? 'bg-nile text-white' : 'text-slateMuted hover:bg-offwhite'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-divider bg-white p-6 shadow-sm">
        {tab === 'summary' && (
          <div className="space-y-4">
            <p className="text-sm leading-7 text-body/90">
              المشروع يظهر توافقاً قوياً مع طلب المستهلك في مناطق متوسطة الكثافة بأسيوط، مع
              نقاط قوة في التسعير والوصول.
            </p>
            <p className="text-sm leading-7 text-body/90">
              التوقعات المالية للسنة الأولى تدعم التعادل في الشهر ٩–١١ عند استيفاء افتراضات
              الإشغال المرصودة.
            </p>
            <p className="text-sm leading-7 text-body/90">
              يُنصح بمراجعة تكلفة التشغيل مع خبير بشري قبل التمويل الخارجي.
            </p>
            <div className="flex flex-wrap gap-2">
              {['طلب مؤكد على القطاع', 'هامش مساهمة جيد', 'مخاطر تنظيمية منخفضة'].map((x) => (
                <span
                  key={x}
                  className="rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success"
                >
                  {x}
                </span>
              ))}
            </div>
          </div>
        )}

        {tab === 'market' && (
          <div>
            <div className="mb-6 overflow-x-auto">
              <table className="w-full min-w-[320px] text-right text-sm">
                <thead>
                  <tr className="border-b border-divider text-slateMuted">
                    <th className="pb-2">المنافس</th>
                    <th className="pb-2">الموقع</th>
                    <th className="pb-2">نقطة تميز</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['أ', 'شرق', 'سعر'],
                    ['ب', 'غرب', 'خدمة'],
                    ['ج', 'جديدة أسيوط', 'علامة'],
                  ].map((row) => (
                    <tr key={row[0]} className="border-b border-divider/80">
                      <td className="py-2">{row[0]}</td>
                      <td className="py-2">{row[1]}</td>
                      <td className="py-2">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mb-3 text-center text-xs font-semibold text-nile">توزيع الشرائح</p>
            <div className="flex flex-col items-center gap-2 md:flex-row md:justify-center md:gap-8">
              <DonutChart />
              <ul className="text-xs text-body/80">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-nile" /> عائلات
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gold" /> شباب
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-success" /> سياح داخلي
                </li>
              </ul>
            </div>
          </div>
        )}

        {tab === 'financial' && (
          <div>
            <div className="mb-6 overflow-x-auto">
              <table className="w-full min-w-[400px] text-right text-sm">
                <thead>
                  <tr className="bg-offwhite text-slateMuted">
                    <th className="p-2">البند</th>
                    <th className="p-2">السنة ١</th>
                    <th className="p-2">السنة ٢</th>
                    <th className="p-2">السنة ٣</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['الإيرادات', '820', '940', '1,050'],
                    ['مصاريف تشغيل', '610', '680', '720'],
                    ['صافي الربح', '120', '180', '240'],
                  ].map((r) => (
                    <tr key={r[0]} className="border-b border-divider">
                      {r.map((c) => (
                        <td key={c} className="p-2">
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mb-2 text-xs text-slateMuted">نسب مساهمة الإيراد (تقريبي)</p>
            <div className="flex h-8 w-full overflow-hidden rounded-lg">
              <div className="bg-nile" style={{ width: '45%' }} />
              <div className="bg-gold" style={{ width: '30%' }} />
              <div className="bg-success" style={{ width: '25%' }} />
            </div>
          </div>
        )}

        {tab === 'tech' && (
          <ul className="space-y-3">
            {[
              ['نظام نقاط بيع', 'مطلوب'],
              ['ربط مخزون', 'مطلوب'],
              ['تطبيق توصيل', 'اختياري'],
              ['كاميرات مراقبة', 'مطلوب'],
              ['Wi-Fi للزبائن', 'اختياري'],
              ['نسخ احتياطي سحابي', 'مطلوب'],
            ].map(([name, tag]) => (
              <li
                key={name}
                className="flex items-center justify-between rounded-lg border border-divider px-4 py-3"
              >
                <span className="text-sm font-medium">{name}</span>
                <span
                  className={`rounded px-2 py-0.5 text-xs font-bold ${
                    tag === 'مطلوب'
                      ? 'bg-nile/10 text-nile'
                      : 'bg-slateMuted/15 text-slateMuted'
                  }`}
                >
                  {tag}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <section className="mt-10 rounded-2xl bg-gradient-to-br from-nile-dark to-nile p-8 text-white shadow-lg">
        <div className="mb-4 flex flex-col items-start gap-4 md:flex-row md:items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-lg font-bold text-gold">
            ك
          </div>
          <div>
            <div className="text-lg font-bold">م. كريم السيد</div>
            <div className="text-sm text-white/70">خبير جدوى — صعيد مصر</div>
          </div>
        </div>
        <button
          type="button"
          className="mb-2 w-full rounded-xl bg-white py-3 text-sm font-bold text-nile shadow-md md:w-auto md:px-10"
        >
          تواصل مع خبير الآن
        </button>
        <p className="text-xs text-white/60">متاح للاستشارة: الأحد–الخميس ١٠ ص – ٦ م</p>
      </section>
    </div>
  )
}
