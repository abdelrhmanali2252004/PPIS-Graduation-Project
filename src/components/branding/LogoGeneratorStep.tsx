import { useEffect, useState, useRef } from "react";
import { Loader2, Download, RefreshCw, ImageOff } from "lucide-react";

export type LogoGeneratorStepProps = {
  brandName: string;
  tagline: string;
  businessType: string;
  audience: string;
  symbolHint: string;
  vibe: string;
  palette: string;
  logoStyle: string;
  savedLogoUrl?: string;
  savedLogoPrompt?: string;
  onLogoDone?: (logoUrl: string, logoPrompt: string) => void;
  onStartOver?: () => void;
};

const VIBE_LABELS: Record<string, string> = {
  pro: "professional and corporate",
  fun: "fun, vibrant and energetic",
  lux: "luxury and elegant",
  min: "minimal and modern",
};
const PALETTE_LABELS: Record<string, string> = {
  as:   "navy blue and gold",
  nile: "deep blue and sky blue",
  sun:  "warm amber and yellow",
  ai:   "AI-chosen colors",
};
const STYLE_LABELS: Record<string, string> = {
  icon: "icon and symbol only",
  text: "wordmark with distinctive typography",
  mix:  "combination mark with icon and text",
};

// ─── Groq: generate image prompt ───────────────────────────────────────────────
async function generatePromptFromGroq(data: LogoGeneratorStepProps): Promise<string> {
  const apiKey = (import.meta.env.VITE_GROQ_API_KEY as string | undefined)?.trim();
  if (!apiKey || apiKey === "your_groq_api_key_here") {
    throw new Error("VITE_GROQ_API_KEY is not configured in .env");
  }

  const parts = [
    `Brand name: "${data.brandName || "My Brand"}"`,
    `Tagline: "${data.tagline || "none"}"`,
    `Business type: "${data.businessType || "general business"}"`,
    `Target audience: "${data.audience || "general public"}"`,
    `Brand spirit: ${VIBE_LABELS[data.vibe] ?? data.vibe}`,
    `Logo style: ${STYLE_LABELS[data.logoStyle] ?? data.logoStyle}`,
    `Color palette: ${PALETTE_LABELS[data.palette] ?? data.palette}`,
  ];
  if (data.symbolHint) parts.push(`Symbol hint: "${data.symbolHint}"`);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 40,
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content:
              "You are a professional logo designer. Given brand data, output ONLY a concise English image-generation prompt (max 20 words) for a logo. You MUST include the exact brand name from the input in your prompt. No explanation, no quotes, just the prompt.",
          },
          { role: "user", content: parts.join("\n") },
        ],
      }),
    });
    if (!response.ok) throw new Error(`Groq error ${response.status}: ${await response.text()}`);
    const json = await response.json() as { choices: { message: { content: string } }[] };
    return json.choices[0].message.content.trim().replace(/^["']|["']$/g, "");
  } finally {
    clearTimeout(timer);
  }
}

// ─── Pollinations via backend proxy (avoids browser 403/CORS) ─────────────────
async function fetchLogoViaProxy(prompt: string): Promise<string> {
  const seed = Math.floor(Math.random() * 99_999);
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=turbo&width=512&height=512&nologo=true&seed=${seed}`;

  const baseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim()
    ?? "http://localhost:8090/api";

  const proxyUrl = `${baseUrl}/proxy/image?url=${encodeURIComponent(pollinationsUrl)}`;
  console.debug("[LogoGen] proxy url:", proxyUrl);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 300_000); // 5 min

  try {
    const res = await fetch(proxyUrl, { signal: controller.signal });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Proxy error ${res.status}: ${text}`);
    }
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } finally {
    clearTimeout(timer);
  }
}

// ─── Component ──────────────────────────────────────────────────────────────────
type Phase =
  | { kind: "idle" }
  | { kind: "groq" }
  | { kind: "image" }                              // fetching from Pollinations
  | { kind: "done"; url: string; prompt: string }
  | { kind: "error"; msg: string };

export default function LogoGeneratorStep(props: LogoGeneratorStepProps) {
  const { savedLogoUrl, savedLogoPrompt, onLogoDone, onStartOver } = props;

  const initialPhase: Phase = savedLogoUrl
    ? { kind: "done", url: savedLogoUrl, prompt: savedLogoPrompt ?? "" }
    : { kind: "idle" };

  const [phase, setPhase]             = useState<Phase>(initialPhase);
  const [imagePrompt, setImagePrompt] = useState(savedLogoPrompt ?? "");

  const triggered  = useRef(false);
  const blobUrlRef = useRef<string>("");

  useEffect(() => () => {
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
  }, []);

  const generate = async (data: LogoGeneratorStepProps) => {
    if (blobUrlRef.current) { URL.revokeObjectURL(blobUrlRef.current); blobUrlRef.current = ""; }
    setPhase({ kind: "groq" });
    setImagePrompt("");

    try {
      // Step 1 — Groq prompt
      const prompt = await generatePromptFromGroq(data);
      const clean  = prompt.replace(/\n/g, " ").trim();
      setImagePrompt(clean);
      console.debug("[LogoGen] prompt:", clean);

      // Step 2 — fetch via backend proxy (no CORS/403 issues)
      setPhase({ kind: "image" });
      const blobUrl = await fetchLogoViaProxy(clean);
      blobUrlRef.current = blobUrl;

      setPhase({ kind: "done", url: blobUrl, prompt: clean });
      onLogoDone?.(blobUrl, clean);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "حدث خطأ غير متوقع";
      console.error("[LogoGen] error:", msg);
      setPhase({ kind: "error", msg });
    }
  };

  // Auto-trigger once on mount
  useEffect(() => {
    if (savedLogoUrl) return;
    if (triggered.current) return;
    triggered.current = true;
    void generate(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetry = () => {
    if (onStartOver) {
      onStartOver();
    } else {
      void generate(props);
    }
  };

  const handleDownload = () => {
    if (phase.kind !== "done") return;
    const a = document.createElement("a");
    a.href = phase.url;
    a.download = `${props.brandName || "logo"}-logo.png`;
    a.click();
  };

  const isGenerating = phase.kind === "groq";
  const isFetching   = phase.kind === "image";
  const isLoading    = isGenerating || isFetching;
  const isDone       = phase.kind === "done";
  const isError      = phase.kind === "error";

  const displayName    = props.brandName || "";
  const displayTagline = props.tagline   || "";

  return (
    <div className="flex flex-col items-center gap-6 py-4 font-cairo" dir="rtl">
      <div className="text-center">
        <h2 className="text-lg font-bold text-body">لوجو مشروعك بالذكاء الاصطناعي</h2>
        <p className="mt-1 text-xs text-slateMuted">تم توليد اللوجو بناءً على بيانات مشروعك</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm rounded-2xl border border-divider bg-white p-6 shadow-md">

        {/* Groq loading */}
        {isGenerating && (
          <div className="flex flex-col items-center gap-3 py-10">
            <Loader2 className="h-10 w-10 animate-spin text-nile" />
            <p className="text-sm font-semibold text-nile">جاري إنشاء وصف اللوجو...</p>
            <div className="h-1.5 w-48 overflow-hidden rounded-full bg-divider">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-l from-gold to-nile" />
            </div>
          </div>
        )}

        {/* Pollinations loading */}
        {isFetching && (
          <div className="flex flex-col items-center gap-3 py-10">
            <Loader2 className="h-10 w-10 animate-spin text-nile" />
            <p className="text-sm font-semibold text-nile">جاري تصميم لوجوك...</p>
            <div className="h-1.5 w-48 overflow-hidden rounded-full bg-divider">
              <div className="h-full w-3/4 animate-pulse rounded-full bg-gradient-to-l from-gold to-nile" />
            </div>
            <p className="text-[10px] text-slateMuted">قد يستغرق حتى دقيقتين، يرجى الانتظار...</p>
          </div>
        )}

        {/* Done — blob URL so download works directly */}
        {isDone && phase.kind === "done" && (
          <img
            src={phase.url}
            alt="generated logo"
            className="mx-auto w-full rounded-xl object-contain"
          />
        )}

        {/* Error */}
        {isError && phase.kind === "error" && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <ImageOff className="h-10 w-10 text-slateMuted" />
            <p className="text-sm font-semibold text-red-500">فشل توليد اللوجو</p>
            <p className="max-w-xs text-xs text-slateMuted">{phase.msg}</p>
          </div>
        )}

        {displayName && (
          <p className="mt-4 text-center text-base font-bold text-nile">{displayName}</p>
        )}
        {displayTagline && (
          <p className="mt-1 text-center text-xs text-slateMuted">{displayTagline}</p>
        )}
        {imagePrompt && (
          <p className="mt-3 rounded-lg bg-offwhite px-3 py-2 text-center text-[10px] leading-relaxed text-slateMuted" dir="ltr">
            {imagePrompt}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          disabled={isLoading}
          onClick={handleRetry}
          className="flex items-center gap-2 rounded-xl border border-divider bg-white px-5 py-2.5 text-sm font-semibold text-body shadow-sm transition-all hover:border-nile disabled:opacity-40"
        >
          <RefreshCw className="h-4 w-4" />
          إعادة التوليد
        </button>

        <button
          type="button"
          disabled={!isDone}
          onClick={handleDownload}
          className="flex items-center gap-2 rounded-xl bg-nile px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-nile/90 disabled:opacity-40"
        >
          <Download className="h-4 w-4" />
          تحميل اللوجو
        </button>
      </div>
    </div>
  );
}
