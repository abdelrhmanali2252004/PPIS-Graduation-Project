import { Briefcase, Star, Crown, Square, Check } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const VIBES = [
  {
    id: "pro",
    title: "احترافي",
    desc: "ثقة ومؤسسية",
    Icon: Briefcase,
  },
  {
    id: "fun",
    title: "مرح وحيوي",
    desc: "ألوان وطاقة",
    Icon: Star,
  },
  {
    id: "lux",
    title: "فاخر وراقي",
    desc: "تفاصيل راقية",
    Icon: Crown,
  },
  {
    id: "min",
    title: "بسيط وعصري",
    desc: "مساحات وهدوء",
    Icon: Square,
  },
] as const;

const PALETTES = [
  {
    id: "as",
    name: "تراث أسيوط",
    colors: ["#1B4C8C", "#C9A05D", "#F9FAFB", "#111827", "#059669"],
  },
  {
    id: "nile",
    name: "نيل هادئ",
    colors: ["#0D2F5E", "#38BDF8", "#E5E7EB", "#1E293B", "#22C55E"],
  },
  {
    id: "sun",
    name: "شمس الصعيد",
    colors: ["#B45309", "#FDE68A", "#FFFBEB", "#422006", "#15803D"],
  },
] as const;

function LogoGeometric() {
  return (
    <svg viewBox="0 0 120 80" className="h-full w-full">
      <polygon
        points="40,10 70,10 85,35 70,60 40,60 25,35"
        fill="#1B4C8C"
        opacity="0.9"
      />
      <polygon points="55,20 90,25 75,55 45,50" fill="#C9A05D" opacity="0.95" />
    </svg>
  );
}

function LogoCalligraphy() {
  return (
    <svg viewBox="0 0 120 80" className="h-full w-full bg-body rounded-lg">
      <text
        x="50%"
        y="55%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#C9A05D"
        style={{ fontSize: "42px", fontFamily: "Cairo, serif" }}
      >
        م
      </text>
    </svg>
  );
}

function LogoContemporary() {
  return (
    <svg viewBox="0 0 120 80" className="h-full w-full">
      <circle cx="60" cy="40" r="32" fill="#1B4C8C" />
      <path
        d="M52 28 L68 28 L62 52 Z M48 48 Q60 38 72 48"
        fill="none"
        stroke="#F9FAFB"
        strokeWidth="3"
      />
    </svg>
  );
}

type BrandingWizardContentProps = {
  sub: number;
  vibe: string;
  palette: string;
  preview: Record<string, "card" | "mobile">;
  accordionOpen: boolean;
  sent: boolean;
  onSubChange: (sub: number) => void;
  onVibeChange: (vibe: string) => void;
  onPaletteChange: (palette: string) => void;
  onPreviewChange: (id: string, mode: "card" | "mobile") => void;
  onAccordionToggle: () => void;
  onSent: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function BrandingWizardContent({
  sub,
  vibe,
  palette,
  preview,
  accordionOpen,
  sent,
  onSubChange,
  onVibeChange,
  onPaletteChange,
  onPreviewChange,
  onAccordionToggle,
  onSent,
  onPrev,
  onNext,
}: BrandingWizardContentProps) {
  const navigate = useNavigate();
  const [brandName, setBrandName] = useState("");
  const [tagline, setTagline] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [audience, setAudience] = useState("");
  const [logoStyle, setLogoStyle] = useState("mix");
  const [symbolHint, setSymbolHint] = useState("");
  return (
    <div className="px-8 py-8 pb-20 font-cairo md:px-10" dir="rtl">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-body md:text-2xl">
          الخطوة الرابعة: الهوية بالذكاء الاصطناعي
        </h1>
        <p className="mt-1 text-sm text-slateMuted">
          أسئلة بسيطة لبناء هوية مشروعك
        </p>
      </header>

      <div className="mb-8 flex items-center justify-center gap-2">
        {["بيانات البراند", "الشخصية والألوان", "توليد الشعار"].map((label, i) => (
          <div key={label} className="flex items-center">
            <button
              type="button"
              onClick={() => onSubChange(i)}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all ${
                i === sub
                  ? "bg-nile text-white shadow-[0_0_0_4px_rgba(27,76,140,0.2)] animate-pulse-glow"
                  : i < sub
                    ? "bg-gold text-nile-dark"
                    : "border border-divider bg-white text-slateMuted"
              }`}
            >
              {i + 1}
            </button>
            {i < 2 && (
              <div
                className={`mx-1 h-0.5 w-8 md:w-16 ${i < sub ? "bg-gold" : "bg-divider"}`}
              />
            )}
          </div>
        ))}
      </div>
      <p className="mb-6 text-center text-xs text-slateMuted">
        {["بيانات البراند", "الشخصية والألوان", "توليد الشعار"][sub]}
      </p>
      <div
        className=""
        style={{
          width: "80%",
          margin: "auto",
        }}
      >
        {sub === 0 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-body">
                الاسم والشعار
              </label>
              <p className="text-xs text-slateMuted">
                اكتب اسم مشروعك الذي تريد ظهوره في اللوجو، ويمكنك إضافة جملة
                قصيرة كشعار.
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="مثال: بصمة ستور"
                  className="w-full rounded-xl border border-divider bg-white px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="شعار اختياري: جودة في كل تفصيلة"
                  className="w-full rounded-xl border border-divider bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-body">
                نوع النشاط
              </label>
              <p className="text-xs text-slateMuted">
                ما هو مجال عملك؟ مثل مطعم، تجارة ملابس، محل موبايلات، أو شركة
                برمجة.
              </p>
              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                placeholder="اكتب نوع النشاط"
                className="w-full rounded-xl border border-divider bg-white px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-body">
                جمهورك مين؟
              </label>
              <p className="text-xs text-slateMuted">
                مين أكثر ناس هتشترى منك؟
              </p>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {[
                  { id: "youth", label: "شباب" },
                  { id: "kids", label: "أطفال" },
                  { id: "business", label: "رجال أعمال" },
                  { id: "all", label: "عامة الناس" },
                ].map((a) => {
                  const sel = audience === a.id;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setAudience(a.id)}
                      className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-all ${
                        sel
                          ? "border-nile bg-nile text-white"
                          : "border-divider bg-white text-body"
                      }`}
                    >
                      {a.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-body">
                علامة مميزة
              </label>
              <p className="text-xs text-slateMuted">
                هل هناك رمز معين تريد ظهوره؟ مثل لمبة، سهم، ميزان، أو أي شكل
                في بالك.
              </p>
              <input
                type="text"
                value={symbolHint}
                onChange={(e) => setSymbolHint(e.target.value)}
                placeholder="اكتب الرمز المقترح (اختياري)"
                className="w-full rounded-xl border border-divider bg-white px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}

        {sub === 1 && (
          <div className="space-y-4">
            <div className="space-y-3 rounded-2xl border border-divider bg-white p-4">
              <label className="block text-sm font-bold text-body">
                روح البراند
              </label>
              <p className="text-xs text-slateMuted">
                عايز اللوجو يحسس الناس بإيه؟
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {VIBES.map((v) => {
                  const sel = vibe === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => onVibeChange(v.id)}
                      className={`relative rounded-2xl border-2 p-4 text-right transition-all ${
                        sel
                          ? "border-nile bg-nile/5 shadow-md"
                          : "border-divider bg-white hover:border-nile/30"
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

            <div className="space-y-2 rounded-2xl border border-divider bg-white p-4">
              <label className="block text-sm font-bold text-body">
                ستايل اللوجو
              </label>
              <p className="text-xs text-slateMuted">
                اختار الشكل الأقرب لك.
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {[
                  { id: "icon", label: "أيقونة ورمز" },
                  { id: "text", label: "اسم بخط مميز" },
                  { id: "mix", label: "ميكس بين الاثنين" },
                ].map((style) => {
                  const sel = logoStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setLogoStyle(style.id)}
                      className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-all ${
                        sel
                          ? "border-gold bg-gold/15 text-nile-dark"
                          : "border-divider bg-white text-body"
                      }`}
                    >
                      {style.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 rounded-2xl border border-divider bg-white p-4">
              <label className="block text-sm font-bold text-body">
                اختيار الألوان
              </label>
              <p className="text-xs text-slateMuted">
                اختر لونك المفضل أو دع الذكاء الاصطناعي يختار الأنسب.
              </p>
            </div>
            {PALETTES.map((p) => {
              const sel = palette === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onPaletteChange(p.id)}
                  className={`flex w-full flex-col gap-3 rounded-2xl border-2 p-4 text-right transition-all ${
                    sel
                      ? "border-gold bg-gold/5 shadow-md"
                      : "border-divider bg-white"
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
              );
            })}
            <button
              type="button"
              onClick={() => onPaletteChange("ai")}
              className={`w-full rounded-2xl border-2 px-4 py-3 text-right text-sm font-semibold transition-all ${
                palette === "ai"
                  ? "border-gold bg-gold/10 text-nile-dark"
                  : "border-divider bg-white text-body"
              }`}
            >
              خلّي الذكاء الاصطناعي يختار أفضل ألوان حسب نشاطك
            </button>
            <p className="text-xs leading-relaxed text-slateMuted">
              ملاحظة WCAG 2026: تأكد من تباين النص الأساسي ≥ ٤.٥:١ على خلفيات
              فاتحة.
            </p>
          </div>
        )}

        {sub === 2 && (
          <div className="space-y-6">
            <div className="animate-pulse-glow rounded-xl border border-gold/40 bg-nile/5 px-4 py-3">
              <div className="mb-1 text-xs font-bold text-nile">
                جاري توليد المفاهيم بالذكاء الاصطناعي
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-divider">
                <div className="h-full w-[72%] animate-pulse rounded-full bg-gradient-to-l from-gold to-nile" />
              </div>
            </div>

            <div className="flex gap-1 flex-wrap">
              {[
                { id: "geo", title: "الهندسي", Node: LogoGeometric },
                { id: "cal", title: "الخطي", Node: LogoCalligraphy },
                { id: "con", title: "المعاصر", Node: LogoContemporary },
              ].map(({ id, title, Node }) => (
                <div
                  key={id}
                  className=" rounded-2xl border border-divider bg-white p-4 shadow-sm"
                >
                  <div className="mb-2 font-bold text-nile">{title}</div>
                  <div
                    className={`mx-auto mb-3 overflow-hidden rounded-xl border border-divider bg-offwhite ${
                      preview[id] === "mobile" ? "max-w-[120px]" : "max-w-full"
                    }`}
                    style={{
                      aspectRatio: preview[id] === "mobile" ? "9/16" : "3/2",
                    }}
                  >
                    <Node />
                  </div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onPreviewChange(id, "card")}
                      className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                        preview[id] === "card"
                          ? "bg-nile text-white"
                          : "bg-offwhite"
                      }`}
                    >
                      بطاقة عمل
                    </button>
                    <button
                      type="button"
                      onClick={() => onPreviewChange(id, "mobile")}
                      className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                        preview[id] === "mobile"
                          ? "bg-nile text-white"
                          : "bg-offwhite"
                      }`}
                    >
                      شاشة موبايل
                    </button>
                  </div>
                  <button
                    type="button"
                    className="w-full rounded-lg border border-gold bg-gold/10 py-2 text-sm font-bold text-nile-dark"
                  >
                    اختر هذا
                  </button>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-divider">
              <button
                type="button"
                onClick={onAccordionToggle}
                className="flex w-full items-center justify-between px-4 py-3 text-sm font-bold text-body"
              >
                لم تعجبك أي من التصاميم؟
                <span className="text-gold">{accordionOpen ? "−" : "+"}</span>
              </button>
              {accordionOpen && (
                <div className="space-y-3 border-t border-divider bg-offwhite/50 px-4 py-4">
                  <div className="rounded-lg bg-nile/10 p-3 text-xs text-nile">
                    صفِّ ما تريد بالعربية — سنعيد التوليد أو نربطك بمصمم بشري.
                  </div>
                  <textarea
                    rows={3}
                    placeholder="ألوان، رموز، أسلوب خط..."
                    className="w-full rounded-lg border border-divider p-2 text-sm"
                  />
                  <div className="flex flex-wrap gap-2">
                    {["شات", "هاتف", "واتساب"].map((m) => (
                      <label
                        key={m}
                        className="flex cursor-pointer items-center gap-2 text-xs"
                      >
                        <input
                          type="radio"
                          name="cm"
                          defaultChecked={m === "شات"}
                        />
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
      </div>

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
          <button
            type="button"
            onClick={() => navigate("/app/step5")}
            className="rounded-xl bg-gold px-6 py-2.5 text-sm font-bold text-nile-dark shadow-md"
          >
            إنهاء وانتقل للوحة التحكم ✓
          </button>
        )}
      </div>
    </div>
  );
}
