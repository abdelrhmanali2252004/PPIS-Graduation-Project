import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import FikraTechLogo from "../components/branding/FikraTechLogo";
import { AIFloatingBubble } from "./AIFloatingBubble";
//import { BottomStatusBar } from './BottomStatusBar'

const STEPS = [
  { n: 1, path: "/app/step1", label: "مركز أبحاث السوق" },
  { n: 2, path: "/app/step2", label: "تفاصيل المشروع" },
  { n: 3, path: "/app/step3", label: "مخرجات الجدوى" },
  { n: 4, path: "/app/step4", label: "الهوية البصرية" },
  { n: 5, path: "/app/step5", label: "لوحة التحكم" },
] as const;

type AppShellProps = {
  activeStep: 1 | 2 | 3 | 4 | 5;
  progressPercent: number;
  bottomStepLabel: string;
  aiTip: string;
  aiPulseKey?: number;
  mainScrollable?: boolean;
  hideBottomBar?: boolean;
  rightPanel?: ReactNode;
  children: ReactNode;
};

export function AppShell({
  activeStep,
  progressPercent,
  bottomStepLabel,
  aiTip,
  aiPulseKey = 0,
  mainScrollable = false,
  hideBottomBar = false,
  rightPanel,
  children,
}: AppShellProps) {
  console.log(mainScrollable);
  console.log(bottomStepLabel, hideBottomBar);

  return (
    <div
      dir="rtl"
      className="flex h-screen overflow-hidden bg-offwhite font-cairo"
    >
      <aside className="flex w-[240px] shrink-0 flex-col bg-nile text-white">
        <div className="border-b border-white/15 px-4 py-5">
          <Link to="/" className="inline-flex">
            <FikraTechLogo variant="compact" />
          </Link>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
          {STEPS.map((s) => {
            const allDone = activeStep === 5 && progressPercent >= 100;
            const active = s.n === activeStep && !allDone;
            const done = s.n < activeStep || allDone;
            const canNavigate = active || done;
            return canNavigate ? (
              <Link
                key={s.n}
                to={s.path}
                className={`block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "border-r-4 border-gold bg-white/10 font-semibold text-white"
                    : "text-gold hover:bg-white/10"
                }`}
              >
                <span className="text-xs text-white/50">{s.n}.</span> {s.label}
              </Link>
            ) : (
              <div
                key={s.n}
                className="block cursor-not-allowed rounded-lg px-3 py-2.5 text-sm text-slateMuted/50"
              >
                <span className="text-xs text-white/50">{s.n}.</span> {s.label}
              </div>
            );
          })}
        </nav>
        <div className="border-t border-white/15 px-4 py-3">
          <div className="mb-2 flex items-center justify-between text-xs text-white/60">
            <span>التقدم</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gold transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </aside>

      <div className="relative flex min-w-0 flex-1 flex-row">
        <main className={`min-w-0 flex-1 overflow-y-auto `}>{children}</main>

        {rightPanel}
      </div>

      <AIFloatingBubble tip={aiTip} pulseKey={aiPulseKey} />
      {/* {!hideBottomBar && <BottomStatusBar stepLabel={bottomStepLabel} />} */}
    </div>
  );
}
