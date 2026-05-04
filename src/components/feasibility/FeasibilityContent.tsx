import { type ReactNode, useMemo } from "react";
import { Download, Share2, RefreshCw } from "lucide-react";
import type { FeasibilityStep3Response } from "../../store/slices/feasibilitySlice";
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

      {loading ? (
        <p className="mb-4 text-center text-xs text-slateMuted">جاري التحديث…</p>
      ) : null}

      <div className="mb-8 flex flex-wrap gap-2 border-b border-divider pb-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onTabChange(t.id)}
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
