import { Download, Calendar } from 'lucide-react'
import { useState } from 'react'

function KpiGauge({ pct }: { pct: number }) {
  const r = 32
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#E5E7EB" strokeWidth="7" />
      <circle
        cx="36"
        cy="36"
        r={r}
        fill="none"
        stroke="#059669"
        strokeWidth="7"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
      />
    </svg>
  )
}

function Sparkline() {
  return (
    <svg width="80" height="36" viewBox="0 0 80 36" className="text-gold">
      <path
        d="M4,28 16,22 28,26 40,12 52,18 64,8 76,14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  )
}

function ScoreRing() {
  return (
    <div className="relative h-16 w-16 animate-pulse-glow rounded-full">
      <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
        <circle cx="32" cy="32" r="26" fill="none" stroke="#E5E7EB" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r="26"
          fill="none"
          stroke="#1B4C8C"
          strokeWidth="6"
          strokeDasharray="164"
          strokeDashoffset="25"
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-nile">
        85
      </span>
    </div>
  )
}

function BudgetChart() {
  const planned = [20, 28, 35, 42, 48, 55]
  const actual = [18, 30, 38, 45, 52, 62]
  const w = 280
  const h = 120
  const max = 70
  const toY = (v: number) => h - (v / max) * (h - 20) - 10
  const toX = (i: number) => 20 + (i * (w - 40)) / (planned.length - 1)
  const path = (arr: number[]) => arr.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(v)}`).join(' ')
  const crossIdx = 4
  const cx = toX(crossIdx)
  const cy = toY(actual[crossIdx])
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="areaP" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B4C8C" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#1B4C8C" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path
        d={`${path(planned)} L ${toX(planned.length - 1)} ${h} L ${toX(0)} ${h} Z`}
        fill="url(#areaP)"
      />
      <path d={path(planned)} fill="none" stroke="#1B4C8C" strokeWidth="2" />
      <path d={path(actual)} fill="none" stroke="#DC2626" strokeWidth="2" strokeDasharray="4 3" />
      <circle cx={cx} cy={cy} r="5" fill="#DC2626" />
      <text x={cx + 8} y={cy - 4} className="fill-danger text-[9px] font-bold">
        تجاوز!
      </text>
    </svg>
  )
}

function HeatmapRow({ label, pct, tone }: { label: string; pct: number; tone: 'red' | 'amber' | 'green' }) {
  const bg = tone === 'red' ? 'bg-danger/80' : tone === 'amber' ? 'bg-warning/80' : 'bg-success/80'
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-24 shrink-0 text-slateMuted">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-divider">
        <div className={`h-full rounded-full ${bg}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-left font-mono text-[10px]">{pct}%</span>
    </div>
  )
}

export function AlertsPanel() {
  return (
    <aside
      className="hidden w-[260px] shrink-0 overflow-y-auto border-r border-divider bg-white lg:block"
      dir="rtl"
    >
      <div className="border-b border-divider p-4">
        <h2 className="text-sm font-bold text-nile">منظومة التنبيه الذكي</h2>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="h-2 w-2 animate-blink rounded-full bg-danger" />
          <span className="font-semibold text-body">٣ تنبيهات جديدة</span>
        </div>
      </div>
      <div className="space-y-3 p-3">
        <div className="rounded-xl border-s-4 border-danger bg-offwhite p-3 shadow-sm">
          <div className="mb-1 text-xs font-bold text-danger">حرج</div>
          <p className="mb-2 text-xs leading-relaxed text-body">تجاوز التكاليف التشغيلية ١٢٪</p>
          <button type="button" className="text-xs font-bold text-nile">
            اتخذ إجراءً ←
          </button>
        </div>
        <div className="rounded-xl border-s-4 border-gold bg-offwhite p-3 shadow-sm">
          <div className="mb-1 text-xs font-bold text-warning">فرصة</div>
          <p className="mb-2 text-xs leading-relaxed text-body">حركة مرور مرتفعة في أسيوط الجديدة</p>
          <button type="button" className="text-xs font-bold text-nile">
            استغل الفرصة ←
          </button>
        </div>
        <div className="rounded-xl border-s-4 border-nile bg-offwhite p-3 shadow-sm">
          <div className="mb-1 text-xs font-bold text-nile">إجراء</div>
          <p className="mb-2 text-xs leading-relaxed text-body">تحديث وثائق الترخيص</p>
          <button type="button" className="text-xs font-bold text-nile">
            رفع المستندات ←
          </button>
        </div>
      </div>
    </aside>
  )
}
const TABS = [
  { id: "summary", label: "الملخص التنفيذي" },
  { id: "market", label: "تحليل السوق" },
  { id: "financial", label: "التوقعات المالية" },
  { id: "tech", label: "المتطلبات التقنية" },
] as const;

export type TabId = (typeof TABS)[number]["id"];


export default function ExecutiveDashboardContent() {
  const [tab, setTab] = useState<TabId>('summary')

  return (
    <div className="relative pb-14">
      <div className="overflow-y-auto px-6 py-8 pb-20 font-cairo lg:px-10" dir="rtl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-xl font-bold text-body md:text-2xl">لوحة التحكم الاستراتيجية</h1>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-divider bg-white px-3 py-2 text-xs font-semibold"
            >
              <Download className="h-4 w-4" />
              تنزيل PDF
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-nile px-3 py-2 text-xs font-bold text-white"
            >
              <Calendar className="h-4 w-4" />
              جدولة مراجعة خبير
            </button>
          </div>
        </header>

        <div className="mb-8 lg:hidden">
          <div className="rounded-xl border border-divider bg-white p-3 text-sm font-bold text-nile">
            التنبيهات: ٣ جديدة — افتح الشاشة الواسعة لعرض اللوحة الجانبية كاملة.
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="flex items-center gap-3 rounded-2xl border border-divider bg-white p-4 shadow-sm">
            <KpiGauge pct={70} />
            <div>
              <div className="text-xs text-slateMuted">رأس المال المتبقي</div>
              <div className="text-xl font-black text-success">٧٠٪</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-divider bg-white p-4 shadow-sm">
            <Sparkline />
            <div>
              <div className="text-xs text-slateMuted">العائد المتوقع</div>
              <div className="text-xl font-black text-gold">١٤٢٪</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-divider bg-white p-4 shadow-sm">
            <ScoreRing />
            <div>
              <div className="text-xs text-slateMuted">درجة صحة المشروع</div>
              <div className="text-sm font-bold text-nile">٨٥/١٠٠ — ممتاز</div>
            </div>
          </div>
          <div className="rounded-2xl border border-divider bg-white p-4 shadow-sm">
            <div className="mb-2 text-xs text-slateMuted">اختراق السوق</div>
            <div className="mb-1 text-xl font-black text-nile">٣٤٪</div>
            <div className="relative h-3 overflow-hidden rounded-full bg-divider">
              <div className="h-full w-[34%] rounded-full bg-nile" />
              <div
                className="absolute top-0 h-full w-0.5 bg-gold"
                style={{ left: '60%', transform: 'translateX(-50%)' }}
                title="هدف ٦٠٪"
              />
            </div>
            <div className="mt-1 text-[10px] text-slateMuted">علامة ذهبية: هدف ٦٠٪</div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-divider bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-nile">الميزانية: مخطط vs فعلي</h3>
            <BudgetChart />
            <div className="mt-2 flex flex-wrap gap-4 text-[10px] text-slateMuted">
              <span className="flex items-center gap-1">
                <span className="h-2 w-4 rounded bg-nile/60" /> مخطط
              </span>
              <span className="flex items-center gap-1">
                <span className="h-0.5 w-4 border-t-2 border-dashed border-danger" /> فعلي
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-divider bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-nile">خريطة الانحراف — أقسام العمل</h3>
            <div className="space-y-3">
              <HeatmapRow label="تشغيل" pct={88} tone="red" />
              <HeatmapRow label="تسويق" pct={45} tone="green" />
              <HeatmapRow label="مخزون" pct={62} tone="amber" />
              <HeatmapRow label="موارد بشرية" pct={70} tone="amber" />
              <HeatmapRow label="صيانة" pct={40} tone="green" />
              <HeatmapRow label="تقنية" pct={55} tone="amber" />
            </div>
            <p className="mt-3 text-[10px] text-slateMuted">
              أحمر: أداء تحت الخطة · أخضر: فوق التوقع · كهرمان: ضغط تكلفة
            </p>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2 border-b border-divider pb-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-t-lg px-4 py-2 text-sm font-semibold transition-colors ${
              tab === t.id
                ? "bg-nile text-white"
                : "text-slateMuted hover:bg-offwhite"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-divider bg-white p-6 shadow-sm my-5">
        {tab === "summary" && (
          <div className="space-y-4">
            <p className="text-sm leading-7 text-body/90">
              المشروع يظهر توافقاً قوياً مع طلب المستهلك في مناطق متوسطة الكثافة
              بأسيوط، مع نقاط قوة في التسعير والوصول.
            </p>
            <p className="text-sm leading-7 text-body/90">
              التوقعات المالية للسنة الأولى تدعم التعادل في الشهر ٩–١١ عند
              استيفاء افتراضات الإشغال المرصودة.
            </p>
            <p className="text-sm leading-7 text-body/90">
              يُنصح بمراجعة تكلفة التشغيل مع خبير بشري قبل التمويل الخارجي.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "طلب مؤكد على القطاع",
                "هامش مساهمة جيد",
                "مخاطر تنظيمية منخفضة",
              ].map((x) => (
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

        {tab === "market" && (
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
                    ["أ", "شرق", "سعر"],
                    ["ب", "غرب", "خدمة"],
                    ["ج", "جديدة أسيوط", "علامة"],
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
            <p className="mb-3 text-center text-xs font-semibold text-nile">
              توزيع الشرائح
            </p>
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
                  <span className="h-2 w-2 rounded-full bg-success" /> سياح
                  داخلي
                </li>
              </ul>
            </div>
          </div>
        )}

        {tab === "financial" && (
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
                    ["الإيرادات", "820", "940", "1,050"],
                    ["مصاريف تشغيل", "610", "680", "720"],
                    ["صافي الربح", "120", "180", "240"],
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
            <p className="mb-2 text-xs text-slateMuted">
              نسب مساهمة الإيراد (تقريبي)
            </p>
            <div className="flex h-8 w-full overflow-hidden rounded-lg">
              <div className="bg-nile" style={{ width: "45%" }} />
              <div className="bg-gold" style={{ width: "30%" }} />
              <div className="bg-success" style={{ width: "25%" }} />
            </div>
          </div>
        )}

        {tab === "tech" && (
          <ul className="space-y-3">
            {[
              ["نظام نقاط بيع", "مطلوب"],
              ["ربط مخزون", "مطلوب"],
              ["تطبيق توصيل", "اختياري"],
              ["كاميرات مراقبة", "مطلوب"],
              ["Wi-Fi للزبائن", "اختياري"],
              ["نسخ احتياطي سحابي", "مطلوب"],
            ].map(([name, tag]) => (
              <li
                key={name}
                className="flex items-center justify-between rounded-lg border border-divider px-4 py-3"
              >
                <span className="text-sm font-medium">{name}</span>
                <span
                  className={`rounded px-2 py-0.5 text-xs font-bold ${
                    tag === "مطلوب"
                      ? "bg-nile/10 text-nile"
                      : "bg-slateMuted/15 text-slateMuted"
                  }`}
                >
                  {tag}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

        <section className="rounded-2xl border border-divider bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-nile">تفاصيل تحليل المشروع</h3>
          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-divider bg-offwhite/70 p-4">
              <div className="mb-1 text-xs text-slateMuted">اسم المشروع</div>
              <div className="text-sm font-bold text-body">مطعم أسيوط النموذجي</div>
            </div>
            <div className="rounded-xl border border-divider bg-offwhite/70 p-4">
              <div className="mb-1 text-xs text-slateMuted">آخر تحليل</div>
              <div className="text-sm font-bold text-body">اليوم — 11:20 AM</div>
            </div>
            <div className="rounded-xl border border-divider bg-offwhite/70 p-4">
              <div className="mb-1 text-xs text-slateMuted">حالة المشروع</div>
              <div className="text-sm font-bold text-success">جاهز للتوسع المرحلي</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-right text-sm">
              <thead>
                <tr className="border-b border-divider text-slateMuted">
                  <th className="px-2 py-2">المحور التحليلي</th>
                  <th className="px-2 py-2">التقييم</th>
                  <th className="px-2 py-2">الملاحظة</th>
                  <th className="px-2 py-2">الإجراء المقترح</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['السوق', 'قوي', 'طلب مستقر في شرق أسيوط', 'زيادة تغطية التوصيل 15%'],
                  ['التمويل', 'متوازن', 'السيولة مناسبة لـ 6 أشهر', 'تتبع المصروفات الثابتة أسبوعيا'],
                  ['التشغيل', 'متوسط', 'ضغط في ساعات الذروة', 'إضافة وردية مسائية جزئية'],
                ].map((row) => (
                  <tr key={row[0]} className="border-b border-divider/70">
                    <td className="px-2 py-3 font-semibold text-body">{row[0]}</td>
                    <td className="px-2 py-3 text-nile">{row[1]}</td>
                    <td className="px-2 py-3 text-body/80">{row[2]}</td>
                    <td className="px-2 py-3 text-gold">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}

function DonutChart() {
  return (
    <div className="relative mx-auto h-40 w-40">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="16"
        />
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
  );
}