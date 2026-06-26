import { useCallback, useEffect, useRef } from "react";
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

function donePhase(logoUrl: string): Phase {
  return {
    kind: "done",
    displayUrl: resolveLogoUrl(logoUrl),
    storedUrl: logoUrl,
  };
}

function resolvePhase(
  projectId: string | null,
  generating: boolean,
  savedLogoUrl: string | undefined,
  error: string | null,
): Phase {
  if (!projectId) {
    return { kind: "error", msg: "لم يتم العثور على المشروع. أكمل الخطوات السابقة أولاً." };
  }
  if (generating) {
    return { kind: "generating" };
  }
  if (savedLogoUrl) {
    return donePhase(savedLogoUrl);
  }
  if (error) {
    return { kind: "error", msg: error };
  }
  return { kind: "generating" };
}

export default function LogoGeneratorStep(props: LogoGeneratorStepProps) {
  const { projectId } = props;

  const propsRef = useRef(props);
  propsRef.current = props;

  const hasAutoStarted = useRef(false);

  const dispatch = useAppDispatch();
  const { generating, saved, error } = useAppSelector((s) => s.branding);

  const phase = resolvePhase(projectId, generating, saved?.logoUrl, error);

  const runGenerate = useCallback(() => {
    const current = propsRef.current;
    if (!projectId) return;

    void dispatch(
      generateLogo({
        projectId,
        brandName: current.brandName,
        tagline: current.tagline,
        businessType: current.businessType,
        audience: current.audience,
        symbolHint: current.symbolHint,
        vibe: current.vibe,
        logoStyle: current.logoStyle,
        palette: current.palette,
      }),
    );
  }, [dispatch, projectId]);

  useEffect(() => {
    if (saved?.logoUrl || !projectId) return;
    if (hasAutoStarted.current) return;
    hasAutoStarted.current = true;
    runGenerate();
  }, [projectId, runGenerate, saved?.logoUrl]);

  const handleRetry = () => {
    dispatch(clearSavedBranding());
    runGenerate();
  };

  const handleDownload = async () => {
    if (phase.kind !== "done") return;
    await downloadLogoFile(phase.displayUrl, `${props.brandName || "logo"}-logo.png`);
  };

  const displayName = props.brandName || "";
  const displayTagline = props.tagline || "";

  return (
    <div className="flex flex-col items-center gap-6 py-4 font-cairo" dir="rtl">
      <div className="text-center">
        <h2 className="text-lg font-bold text-body">لوجو مشروعك بالذكاء الاصطناعي</h2>
        <p className="mt-1 text-xs text-slateMuted">تم توليد اللوجو بناءً على بيانات مشروعك</p>
      </div>

      <div className="w-full max-w-sm rounded-2xl border border-divider bg-surface p-6 shadow-md">
        {phase.kind === "generating" && (
          <div className="flex flex-col items-center gap-3 py-10">
            <Loader2 className="h-10 w-10 animate-spin text-heading" />
            <p className="text-sm font-semibold text-heading">جاري تصميم اللوجو الخاص بك...</p>
            <div className="h-1.5 w-48 overflow-hidden rounded-full bg-divider">
              <div className="h-full w-3/4 animate-pulse rounded-full bg-gradient-to-l from-gold to-nile" />
            </div>
            <p className="text-[10px] text-slateMuted">قد يستغرق حتى دقيقتين، يرجى الانتظار...</p>
          </div>
        )}

        {phase.kind === "done" && (
          <img
            src={phase.displayUrl}
            alt="generated logo"
            className="mx-auto w-full rounded-xl object-contain"
          />
        )}

        {phase.kind === "error" && (
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
          disabled={phase.kind === "generating"}
          onClick={handleRetry}
          className="flex items-center gap-2 rounded-xl border border-divider bg-surface px-5 py-2.5 text-sm font-semibold text-body shadow-sm transition-all hover:border-nile disabled:opacity-40"
        >
          <RefreshCw className="h-4 w-4" />
          إعادة التوليد
        </button>

        <button
          type="button"
          disabled={phase.kind !== "done"}
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
