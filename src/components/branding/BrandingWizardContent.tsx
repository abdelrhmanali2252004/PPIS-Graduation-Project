import { Briefcase, Star, Crown, Square, Check, Loader2 } from "lucide-react";
import LogoGeneratorStep from "./LogoGeneratorStep";

const VIBES = [
  { id: "pro", title: "احترافي",    desc: "ثقة ومؤسسية",   Icon: Briefcase },
  { id: "fun", title: "مرح وحيوي", desc: "ألوان وطاقة",   Icon: Star      },
  { id: "lux", title: "فاخر وراقي", desc: "تفاصيل راقية", Icon: Crown     },
  { id: "min", title: "بسيط وعصري", desc: "مساحات وهدوء", Icon: Square    },
] as const;

const PALETTES = [
  { id: "as",   name: "تراث أسيوط", colors: ["#1B4C8C","#C9A05D","#F9FAFB","#111827","#059669"] },
  { id: "nile", name: "نيل هادئ",   colors: ["#0D2F5E","#38BDF8","#E5E7EB","#1E293B","#22C55E"] },
  { id: "sun",  name: "شمس الصعيد", colors: ["#B45309","#FDE68A","#FFFBEB","#422006","#15803D"] },
] as const;

type BrandingWizardContentProps = {
  // step index
  sub: number;

  // step-1 form state (lifted up)
  brandName: string;
  tagline: string;
  businessType: string;
  audience: string;
  symbolHint: string;
  onBrandNameChange: (v: string) => void;
  onTaglineChange: (v: string) => void;
  onBusinessTypeChange: (v: string) => void;
  onAudienceChange: (v: string) => void;
  onSymbolHintChange: (v: string) => void;

  // step-2 form state (lifted up)
  vibe: string;
  palette: string;
  logoStyle: string;
  onVibeChange: (v: string) => void;
  onPaletteChange: (v: string) => void;
  onLogoStyleChange: (v: string) => void;

  // accordion / sent (step-2 fallback)
  accordionOpen: boolean;
  sent: boolean;
  onAccordionToggle: () => void;
  onSent: () => void;

  // finish / submit
  submitting?: boolean;
  submitError?: string | null;
  submitSuccess?: boolean;
  onFinish?: () => void;

  // step 3 logo
  projectId?: string | null;
  generatingLogo?: boolean;

  // navigation
  onSubChange: (sub: number) => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function BrandingWizardContent({
  sub,
  brandName, tagline, businessType, audience, symbolHint,
  onBrandNameChange, onTaglineChange, onBusinessTypeChange,
  onAudienceChange, onSymbolHintChange,
  vibe, palette, logoStyle,
  onVibeChange, onPaletteChange, onLogoStyleChange,
  accordionOpen, sent, onAccordionToggle, onSent,
  submitting = false, submitError = null, submitSuccess = false,
  generatingLogo = false,
  projectId,
  onFinish,
  onSubChange, onPrev, onNext,
}: BrandingWizardContentProps) {
  // Steps 2 & 3 are locked until the user fills in a brand name
  const step1Complete = brandName.trim().length > 0;
  return (
    <div className="px-8 py-8 pb-20 font-cairo md:px-10" dir="rtl">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-body md:text-2xl">
          الخطوة الرابعة: الهوية بالذكاء الاصطناعي
        </h1>
        <p className="mt-1 text-sm text-slateMuted">أسئلة بسيطة لبناء هوية مشروعك</p>
      </header>

      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {["بيانات البراند", "الشخصية والألوان", "توليد الشعار"].map((label, i) => {
          const locked = i > 0 && !step1Complete;
          return (
            <div key={label} className="flex items-center">
              <button
                type="button"
                onClick={() => !locked && onSubChange(i)}
                disabled={locked}
                title={locked ? "أكمل بيانات البراند أولاً" : label}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all ${
                  i === sub
                    ? "bg-nile text-white shadow-[0_0_0_4px_rgba(27,76,140,0.2)] animate-pulse-glow"
                    : i < sub
                    ? "bg-gold text-nile-dark"
                    : locked
                    ? "border border-divider bg-white text-divider cursor-not-allowed"
                    : "border border-divider bg-white text-slateMuted hover:border-nile"
                }`}
              >
                {i + 1}
              </button>
              {i < 2 && (
                <div className={`mx-1 h-0.5 w-8 md:w-16 ${i < sub ? "bg-gold" : "bg-divider"}`} />
              )}
            </div>
          );
        })}
      </div>
      <p className="mb-6 text-center text-xs text-slateMuted">
        {["بيانات البراند", "الشخصية والألوان", "توليد الشعار"][sub]}
      </p>

      <div style={{ width: "80%", margin: "auto" }}>

        {/* ── Step 1: Brand Data ── */}
        {sub === 0 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-body">الاسم والشعار</label>
              <p className="text-xs text-slateMuted">
                اكتب اسم مشروعك الذي تريد ظهوره في اللوجو، ويمكنك إضافة جملة قصيرة كشعار.
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => onBrandNameChange(e.target.value)}
                  placeholder="مثال: بصمة ستور"
                  className="w-full rounded-xl border border-divider bg-white px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => onTaglineChange(e.target.value)}
                  placeholder="شعار اختياري: جودة في كل تفصيلة"
                  className="w-full rounded-xl border border-divider bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-body">نوع النشاط</label>
              <p className="text-xs text-slateMuted">
                ما هو مجال عملك؟ مثل مطعم، تجارة ملابس، محل موبايلات، أو شركة برمجة.
              </p>
              <input
                type="text"
                value={businessType}
                onChange={(e) => onBusinessTypeChange(e.target.value)}
                placeholder="اكتب نوع النشاط"
                className="w-full rounded-xl border border-divider bg-white px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-body">جمهورك مين؟</label>
              <p className="text-xs text-slateMuted">مين أكثر ناس هتشترى منك؟</p>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {[
                  { id: "youth",    label: "شباب"        },
                  { id: "kids",     label: "أطفال"       },
                  { id: "business", label: "رجال أعمال"  },
                  { id: "all",      label: "عامة الناس"  },
                ].map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => onAudienceChange(a.id)}
                    className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-all ${
                      audience === a.id
                        ? "border-nile bg-nile text-white"
                        : "border-divider bg-white text-body"
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-body">علامة مميزة</label>
              <p className="text-xs text-slateMuted">
                هل هناك رمز معين تريد ظهوره؟ مثل لمبة، سهم، ميزان، أو أي شكل في بالك.
              </p>
              <input
                type="text"
                value={symbolHint}
                onChange={(e) => onSymbolHintChange(e.target.value)}
                placeholder="اكتب الرمز المقترح (اختياري)"
                className="w-full rounded-xl border border-divider bg-white px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}

        {/* ── Step 2: Personality & Colors ── */}
        {sub === 1 && (
          <div className="space-y-4">
            {/* Vibe */}
            <div className="space-y-3 rounded-2xl border border-divider bg-white p-4">
              <label className="block text-sm font-bold text-body">روح البراند</label>
              <p className="text-xs text-slateMuted">عايز اللوجو يحسس الناس بإيه؟</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {VIBES.map((v) => {
                  const sel = vibe === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => onVibeChange(v.id)}
                      className={`relative rounded-2xl border-2 p-4 text-right transition-all ${
                        sel ? "border-nile bg-nile/5 shadow-md" : "border-divider bg-white hover:border-nile/30"
                      }`}
                    >
                      {sel && (
                        <span className="absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-nile text-white">
                          <Check className="h-4 w-4" />
                        </span>
                      )}
                      <v.Icon className="mb-2 h-7 w-7 text-gold" />
                      <div className="font-bold text-nile">{v.title}</div>
                      <div className="text-xs text-slateMuted">{v.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Logo style */}
            <div className="space-y-2 rounded-2xl border border-divider bg-white p-4">
              <label className="block text-sm font-bold text-body">ستايل اللوجو</label>
              <p className="text-xs text-slateMuted">اختار الشكل الأقرب لك.</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {[
                  { id: "icon", label: "أيقونة ورمز"        },
                  { id: "text", label: "اسم بخط مميز"        },
                  { id: "mix",  label: "ميكس بين الاثنين"    },
                ].map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => onLogoStyleChange(style.id)}
                    className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-all ${
                      logoStyle === style.id
                        ? "border-gold bg-gold/15 text-nile-dark"
                        : "border-divider bg-white text-body"
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Palette */}
            <div className="space-y-2 rounded-2xl border border-divider bg-white p-4">
              <label className="block text-sm font-bold text-body">اختيار الألوان</label>
              <p className="text-xs text-slateMuted">
                اختر لونك المفضل أو دع الذكاء الاصطناعي يختار الأنسب.
              </p>
            </div>
            {PALETTES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onPaletteChange(p.id)}
                className={`flex w-full flex-col gap-3 rounded-2xl border-2 p-4 text-right transition-all ${
                  palette === p.id ? "border-gold bg-gold/5 shadow-md" : "border-divider bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-body">{p.name}</span>
                  {p.id === "as" && (
                    <span className="rounded-full bg-nile/10 px-2 py-0.5 text-[10px] font-bold text-nile">
                      مُوصى به بواسطة AI ✦
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {p.colors.map((c) => (
                    <span
                      key={c}
                      className="h-10 flex-1 rounded-lg border border-black/5 shadow-inner"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </button>
            ))}
            <button
              type="button"
              onClick={() => onPaletteChange("ai")}
              className={`w-full rounded-2xl border-2 px-4 py-3 text-right text-sm font-semibold transition-all ${
                palette === "ai" ? "border-gold bg-gold/10 text-nile-dark" : "border-divider bg-white text-body"
              }`}
            >
              خلّي الذكاء الاصطناعي يختار أفضل ألوان حسب نشاطك
            </button>
            <p className="text-xs leading-relaxed text-slateMuted">
              ملاحظة WCAG 2026: تأكد من تباين النص الأساسي ≥ ٤.٥:١ على خلفيات فاتحة.
            </p>

            {/* Accordion fallback */}
            <div className="rounded-xl border border-divider">
              <button
                type="button"
                onClick={onAccordionToggle}
                className="flex w-full items-center justify-between px-4 py-3 text-sm font-bold text-body"
              >
                لم تعجبك أي من الخيارات؟
                <span className="text-gold">{accordionOpen ? "−" : "+"}</span>
              </button>
              {accordionOpen && (
                <div className="space-y-3 border-t border-divider bg-offwhite/50 px-4 py-4">
                  <div className="rounded-lg bg-nile/10 p-3 text-xs text-nile">
                    صفِّ ما تريد بالعربية — سنعيد التوليد أو نربطك بمصمم بشري.
                  </div>
                  <textarea
                    rows={3}
                    placeholder="ألوان، رموز، أسلوب خط..."
                    className="w-full rounded-lg border border-divider p-2 text-sm"
                  />
                  <div className="flex flex-wrap gap-2">
                    {["شات", "هاتف", "واتساب"].map((m) => (
                      <label key={m} className="flex cursor-pointer items-center gap-2 text-xs">
                        <input type="radio" name="cm" defaultChecked={m === "شات"} />
                        {m}
                      </label>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={onSent}
                    className="w-full rounded-lg bg-nile py-2 text-sm font-bold text-white"
                  >
                    إرسال
                  </button>
                  {sent && (
                    <p className="text-center text-xs font-semibold text-success">
                      تم استلام طلبك ✓
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Step 3: AI Logo Generator ── */}
        {sub === 2 && (
          <LogoGeneratorStep
            projectId={projectId ?? null}
            brandName={brandName}
            tagline={tagline}
            businessType={businessType}
            audience={audience}
            symbolHint={symbolHint}
            vibe={vibe}
            palette={palette}
            logoStyle={logoStyle}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between gap-3">
        <button
          type="button"
          disabled={sub === 0}
          onClick={onPrev}
          className="rounded-xl border border-divider px-5 py-2.5 text-sm font-semibold disabled:opacity-40"
        >
          السابق
        </button>

        {sub < 2 ? (
          <button
            type="button"
            onClick={onNext}
            className="rounded-xl bg-nile px-6 py-2.5 text-sm font-bold text-white shadow-md"
          >
            التالي
          </button>
        ) : (
          <div className="flex flex-col items-end gap-2">
            {submitError && (
              <p className="text-xs font-semibold text-red-500">{submitError}</p>
            )}
            {submitSuccess && (
              <p className="text-xs font-semibold text-green-600">تم إرسال الطلب بنجاح ✓</p>
            )}
            <button
              type="button"
              disabled={submitting || generatingLogo}
              onClick={onFinish}
              className="flex items-center gap-2 rounded-xl bg-gold px-6 py-2.5 text-sm font-bold text-nile-dark shadow-md disabled:opacity-60"
            >
              {submitting || generatingLogo ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {generatingLogo ? "جاري توليد اللوجو..." : "جاري الإرسال..."}
                </>
              ) : (
                "إنهاء وانتقل للوحة التحكم ✓"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
