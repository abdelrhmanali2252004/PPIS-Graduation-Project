import { type ReactNode, useMemo } from "react";
import { Download, RefreshCw, Share2 } from "lucide-react";
import type {
  FeasibilityRiskLevel,
  FeasibilityStep3Response,
  MarketReadinessLabel,
} from "../../store/slices/feasibilitySlice";
import FeasibilityLoading from "./FeasibilityLoading";

const TABS = [
  { id: "summary", label: "الملخص التنفيذي" },
  { id: "market", label: "تحليل السوق" },
  { id: "financial", label: "التوقعات المالية" },
  { id: "tech", label: "التشغيل والتسويق" },
] as const;

export type TabId = (typeof TABS)[number]["id"];

function toDisplayString(value: unknown): string {
  if (value == null) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function formatNumber(value: number, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat("ar-EG", {
    maximumFractionDigits,
  }).format(value);
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.min(100, Math.max(0, value));
}

function getRiskStyles(level: FeasibilityRiskLevel) {
  switch (level) {
    case "منخفض":
      return {
        badge: "bg-success/15 text-success",
        bar: "bg-success",
      };
    case "مرتفع":
      return {
        badge: "bg-red-100 text-red-700",
        bar: "bg-red-500",
      };
    default:
      return {
        badge: "bg-warning/20 text-warning",
        bar: "bg-warning",
      };
  }
}

function getMarketStyles(label: MarketReadinessLabel) {
  switch (label) {
    case "ممتاز":
      return {
        badge: "bg-success/15 text-success",
        bar: "bg-success",
      };
    case "جيد":
      return {
        badge: "bg-nile/10 text-nile",
        bar: "bg-nile",
      };
    case "مقبول":
      return {
        badge: "bg-gold/15 text-nile-dark",
        bar: "bg-gold",
      };
    default:
      return {
        badge: "bg-red-100 text-red-700",
        bar: "bg-red-500",
      };
  }
}

function Prose({ text }: { text?: unknown }) {
  const s = toDisplayString(text);
  if (!s.trim()) {
    return (
      <p className="text-sm text-slateMuted">لا يوجد نص لهذا القسم.</p>
    );
  }
  return (
    <p className="whitespace-pre-wrap text-sm leading-7 text-body/90">{s}</p>
  );
}

function ProgressMetric({
  title,
  value,
  subtitle,
  badge,
  barClassName,
}: {
  title: string;
  value: number;
  subtitle: string;
  badge?: string;
  barClassName: string;
}) {
  const normalized = clampPercent(value);
  return (
    <div className="rounded-2xl border border-divider bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-slateMuted">{title}</div>
          <div className="mt-1 text-2xl font-black text-body">
            {formatNumber(normalized)}%
          </div>
        </div>
        {badge ? (
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${badge}`}>
            {subtitle}
          </span>
        ) : null}
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-divider">
        <div
          className={`h-full rounded-full transition-[width] ${barClassName}`}
          style={{ width: `${normalized}%` }}
        />
      </div>
      {!badge ? (
        <p className="mt-2 text-xs font-semibold text-slateMuted">{subtitle}</p>
      ) : null}
    </div>
  );
}

function RoiTrendChart({ values }: { values: number[] }) {
  if (!values.length) {
    return (
      <div className="rounded-2xl border border-divider bg-white p-4 shadow-sm">
        <div className="text-xs text-slateMuted">اتجاه العائد</div>
        <p className="mt-3 text-sm text-slateMuted">لا توجد بيانات اتجاه متاحة.</p>
      </div>
    );
  }

  const width = 260;
  const height = 88;
  const padding = 8;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const points = values
    .map((value, index) => {
      const x =
        padding +
        (index * (width - padding * 2)) / Math.max(1, values.length - 1);
      const y =
        height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-2xl border border-divider bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <div className="text-xs text-slateMuted">اتجاه العائد المتوقع</div>
          <div className="mt-1 text-sm font-semibold text-body">
            {values.length} نقاط قياس
          </div>
        </div>
        <div className="text-left text-xs text-slateMuted">
          <div>أدنى: {formatNumber(min, 1)}</div>
          <div>أعلى: {formatNumber(max, 1)}</div>
        </div>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-24 w-full overflow-visible"
        aria-label="ROI trend chart"
      >
        <path
          d={`M ${padding} ${height - padding} H ${width - padding}`}
          stroke="#E5E7EB"
          strokeWidth="1"
          fill="none"
        />
        <polyline
          points={points}
          fill="none"
          stroke="#C9A05D"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {values.map((value, index) => {
          const x =
            padding +
            (index * (width - padding * 2)) / Math.max(1, values.length - 1);
          const y =
            height - padding - ((value - min) / range) * (height - padding * 2);
          return <circle key={`${value}-${index}`} cx={x} cy={y} r="3.5" fill="#1B4C8C" />;
        })}
      </svg>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-bold text-nile">{title}</h3>
      {children}
    </div>
  );
}

type FeasibilityContentProps = {
  tab: TabId;
  onTabChange: (tab: TabId) => void;
  projectMissing: boolean;
  loading: boolean;
  error: string | null;
  study: FeasibilityStep3Response | null;
  onRetry: () => void;
};

function studyTitle(study: FeasibilityStep3Response | null): string {
  if (study?.project?.name) {
    return study.project.name;
  }

  const t = toDisplayString(study?.res?.executiveSummary).trim();
  if (!t) {
    return "مشروعك";
  }
  const oneLine = t.replace(/\s+/g, " ").slice(0, 72);
  return oneLine.length < t.length ? `${oneLine}…` : oneLine;
}

export default function FeasibilityContent({
  tab,
  onTabChange,
  projectMissing,
  loading,
  error,
  study,
  onRetry,
}: FeasibilityContentProps) {
  const headerSubtitle = useMemo(() => studyTitle(study), [study]);
  const riskStyles = study ? getRiskStyles(study.res.riskLevel) : null;
  const marketStyles = study ? getMarketStyles(study.res.marketReadinessLabel) : null;

  if (projectMissing) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-6 py-10" dir="rtl">
        <div className="max-w-md rounded-2xl border border-amber-200 bg-amber-50 px-6 py-8 text-center">
          <p className="text-sm font-semibold text-amber-900">
            لا يوجد رقم مشروع محفوظ. أكمل الخطوة الأولى وخطوة تفاصيل المشروع أولاً.
          </p>
        </div>
      </div>
    );
  }

  if (loading && !study) {
    return <FeasibilityLoading />;
  }

  if (error && !study) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 py-10" dir="rtl">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
          <p className="text-sm text-red-800">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-nile px-4 py-2.5 text-sm font-bold text-white"
          >
            <RefreshCw className="h-4 w-4" />
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (!study) {
    return null;
  }

  const res = study.res;

  return (
    <div className="px-8 py-8 pb-16 font-cairo md:px-10" dir="rtl">
      <header className="mb-6 flex flex-col gap-4 border-b border-divider pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-body md:text-2xl">
            مخرجات دراسة الجدوى
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-nile/10 px-3 py-1 text-xs font-semibold text-nile">
              {headerSubtitle}

            </span>
            {study.marketResearchUsed ? (
              <span className="rounded-full border border-gold/50 bg-gold/10 px-2 py-0.5 text-xs font-bold text-nile-dark">
                مرجع دراسة السوق
              </span>
            ) : null}
            <span className="rounded-full border border-divider bg-offwhite px-2 py-0.5 text-xs font-semibold text-slateMuted">
              {study.message === "success" ? "تم التوليد" : study.message}
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

      <div className="mb-8 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ProgressMetric
          title="جاهزية السوق"
          value={res.marketReadinessScore}
          subtitle={res.marketReadinessLabel}
          badge={marketStyles?.badge}
          barClassName={marketStyles?.bar ?? "bg-nile"}
        />
        <ProgressMetric
          title="مستوى المخاطرة"
          value={res.riskScore}
          subtitle={res.riskLevel}
          badge={riskStyles?.badge}
          barClassName={riskStyles?.bar ?? "bg-warning"}
        />
        <div className="rounded-2xl border border-divider bg-white p-4 shadow-sm">
          <div className="text-xs text-slateMuted">العائد على الاستثمار</div>
          <div className="mt-1 text-2xl font-black text-gold">
            {formatNumber(res.roiPercent, 1)}%
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-divider">
            <div
              className="h-full rounded-full bg-gold transition-[width]"
              style={{ width: `${clampPercent(res.roiPercent / 2)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slateMuted">
            شريط نسبي حتى ٢٠٠٪ مع مخطط الاتجاه في البطاقة المجاورة.
          </p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <RoiTrendChart values={res.roiTrend} />
        <div className="rounded-2xl border border-divider bg-white p-4 shadow-sm">
          <div className="mb-3 text-xs text-slateMuted">وسوم تنفيذية</div>
          <div className="flex flex-wrap gap-2">
            {res.executiveTags?.length ? (
              res.executiveTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-nile/10 px-3 py-1 text-xs font-semibold text-nile"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-sm text-slateMuted">لا توجد وسوم حالياً.</span>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <p className="mb-4 text-center text-xs text-slateMuted">جاري التحديث…</p>
      ) : null}

      <div className="mb-8 flex flex-wrap gap-2 border-b border-divider pb-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onTabChange(t.id)}
            className={`rounded-t-lg px-4 py-2 text-sm font-semibold transition-colors ${tab === t.id
              ? "bg-nile text-white"
              : "text-slateMuted hover:bg-offwhite"
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-divider bg-white p-6 shadow-sm">
        {tab === "summary" && (
          <div className="space-y-4">
            <Prose text={res.executiveSummary} />
          </div>
        )}

        {tab === "market" && (
          <div className="space-y-8">
            <Section title="تحليل السوق والعملاء">
              <Prose text={res.marketAndCustomersAnalysis} />
            </Section>
            <Section title="تحليل المنافسين">
              <Prose text={res.competitorsAnalysis} />
            </Section>
          </div>
        )}

        {tab === "financial" && (
          <div className="space-y-8">
            <Section title="تكاليف التأسيس">
              <Prose text={res.costs?.establishment} />
            </Section>
            <Section title="تكاليف التشغيل">
              <Prose text={res.costs?.operating} />
            </Section>
            <Section title="توقعات الإيرادات والأرباح">
              <Prose text={res.revenueAndProfitOutlook} />
            </Section>
          </div>
        )}

        {tab === "tech" && (
          <div className="space-y-8">
            <Section title="نموذج التشغيل والتنفيذ">
              <Prose text={res.operationsModel} />
            </Section>
            <Section title="خطة التسويق والمبيعات">
              <Prose text={res.marketingAndSalesPlan} />
            </Section>
            <Section title="المتطلبات التقنية">
              <Prose text={res.technicalRequirements} />
            </Section>
          </div>
        )}
      </div>

      <div className="mt-8 rounded-2xl border border-divider bg-offwhite/80 p-6">
        <h2 className="mb-4 text-sm font-bold text-nile">المخاطر والتوصيات</h2>
        <div className="space-y-6">
          <Section title="تحليل المخاطر وخطط التخفيف">
            <Prose text={res.risksAndMitigation} />
          </Section>
          <Section title="التوصيات">
            <Prose text={res.recommendations} />
          </Section>
          <Section title="خطة عمل 90 يومًا">
            <Prose text={res.ninetyDayActionPlan} />
          </Section>
        </div>
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
        <p className="text-xs text-white/60">
          متاح للاستشارة: الأحد–الخميس ١٠ ص – ٦ م
        </p>
      </section>
    </div>
  );
}
