import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Download, RefreshCw, ImageOff } from "lucide-react";
import { downloadLogoFile, resolveLogoUrl } from "../../api/branding";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearSavedBranding, generateLogo } from "../../store/slices/brandingSlice";

export type LogoGeneratorStepProps = {
  projectId: string | null;
  brandName: string;
  tagline: string;
  businessType: string;
  audience: string;
  symbolHint: string;
  vibe: string;
  palette: string;
  logoStyle: string;
};

type Phase =
  | { kind: "generating" }
  | { kind: "done"; displayUrl: string; storedUrl: string }
  | { kind: "error"; msg: string };

export default function LogoGeneratorStep(props: LogoGeneratorStepProps) {
  const { projectId } = props;

  const dispatch = useAppDispatch();
  const { generating } = useAppSelector((s) => s.branding);

  const [phase, setPhase] = useState<Phase>({ kind: "generating" });

  const runIdRef = useRef(0);

  const runGenerate = useCallback(async () => {
    const runId = ++runIdRef.current;

    if (!projectId) {
      setPhase({ kind: "error", msg: "لم يتم العثور على المشروع. أكمل الخطوات السابقة أولاً." });
      return;
    }

    setPhase({ kind: "generating" });
    
    const result = await dispatch(
      generateLogo({
        projectId,
        brandName: props.brandName,
        tagline: props.tagline,
        businessType: props.businessType,
        audience: props.audience,
        symbolHint: props.symbolHint,
        vibe: props.vibe,
        logoStyle: props.logoStyle,
        palette: props.palette,
      }),
    );

    if (runId !== runIdRef.current) return;

    if (generateLogo.fulfilled.match(result)) {
      const { logoUrl } = result.payload;
      setPhase({
        kind: "done",
        displayUrl: resolveLogoUrl(logoUrl),
        storedUrl: logoUrl,
      });
      return;
    }

    const msg =
      (generateLogo.rejected.match(result) ? result.payload : null) ??
      "حدث خطأ غير متوقع";
    setPhase({ kind: "error", msg });
  }, [
    dispatch,
    projectId,
    props.brandName,
    props.tagline,
    props.businessType,
    props.audience,
    props.symbolHint,
    props.vibe,
    props.logoStyle,
    props.palette,
  ]);

  useEffect(() => {
    dispatch(clearSavedBranding());
    void runGenerate();

    return () => {
      runIdRef.current += 1;
    };
  }, [dispatch, runGenerate]);

  const handleRetry = () => {
    dispatch(clearSavedBranding());
    void runGenerate();
  };

  const handleDownload = async () => {
    if (phase.kind !== "done") return;
    await downloadLogoFile(phase.displayUrl, `${props.brandName || "logo"}-logo.png`);
  };

  const isLoading = phase.kind === "generating" || generating;
  const isDone = phase.kind === "done";
  const isError = phase.kind === "error";

  const displayName = props.brandName || "";
  const displayTagline = props.tagline || "";

  return (
    <div className="flex flex-col items-center gap-6 py-4 font-cairo" dir="rtl">
      <div className="text-center">
        <h2 className="text-lg font-bold text-body">لوجو مشروعك بالذكاء الاصطناعي</h2>
        <p className="mt-1 text-xs text-slateMuted">تم توليد اللوجو بناءً على بيانات مشروعك</p>
      </div>

      <div className="w-full max-w-sm rounded-2xl border border-divider bg-surface p-6 shadow-md">
        {isLoading && (
          <div className="flex flex-col items-center gap-3 py-10">
            <Loader2 className="h-10 w-10 animate-spin text-heading" />
            <p className="text-sm font-semibold text-heading">جاري تصميم اللوجو الخاص بك...</p>
            <div className="h-1.5 w-48 overflow-hidden rounded-full bg-divider">
              <div className="h-full w-3/4 animate-pulse rounded-full bg-gradient-to-l from-gold to-nile" />
            </div>
            <p className="text-[10px] text-slateMuted">قد يستغرق حتى دقيقتين، يرجى الانتظار...</p>
          </div>
        )}

        {isDone && phase.kind === "done" && (
          <img
            src={phase.displayUrl}
            alt="generated logo"
            className="mx-auto w-full rounded-xl object-contain"
          />
        )}

        {isError && phase.kind === "error" && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <ImageOff className="h-10 w-10 text-slateMuted" />
            <p className="text-sm font-semibold text-red-500">فشل توليد اللوجو</p>
            <p className="max-w-xs text-xs text-slateMuted">{phase.msg}</p>
          </div>
        )}

        {displayName && (
          <p className="mt-4 text-center text-base font-bold text-heading">{displayName}</p>
        )}
        {displayTagline && (
          <p className="mt-1 text-center text-xs text-slateMuted">{displayTagline}</p>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          disabled={isLoading}
          onClick={handleRetry}
          className="flex items-center gap-2 rounded-xl border border-divider bg-surface px-5 py-2.5 text-sm font-semibold text-body shadow-sm transition-all hover:border-nile disabled:opacity-40"
        >
          <RefreshCw className="h-4 w-4" />
          إعادة التوليد
        </button>

        <button
          type="button"
          disabled={!isDone}
          onClick={() => void handleDownload()}
          className="flex items-center gap-2 rounded-xl bg-nile px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-nile/90 disabled:opacity-40"
        >
          <Download className="h-4 w-4" />
          تحميل اللوجو
        </button>
      </div>
    </div>
  );
}
