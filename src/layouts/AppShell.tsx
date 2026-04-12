import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
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
          <Link to="/" className="flex items-center gap-2">
            <span
              className="inline-block h-9 w-9 rotate-45 border-2 border-gold bg-gold/20"
              aria-hidden
            />
            <span className="text-lg font-bold text-white">فكرة TECH</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
          {STEPS.map((s) => {
            const allDone = activeStep === 5 && progressPercent >= 100;
            const active = s.n === activeStep && !allDone;
            const done = s.n < activeStep || allDone;
            return active ? (
              <Link
                key={s.n}
                to={s.path}
                className="block rounded-lg px-3 py-2.5 text-sm transition-colors border-r-4 border-gold bg-white/10 font-semibold text-white"
              >
                <span className="text-xs text-white/50">{s.n}.</span> {s.label}
              </Link>
            ) : (
              <div
                key={s.n}
                className={`block rounded-lg px-3 py-2.5 text-sm ${done ? "text-gold" : "text-slateMuted/50"} cursor-not-allowed ${done ? "" : ""}`}
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
        <div className="flex items-center gap-2 border-t border-white/15 px-4 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
            <User className="h-5 w-5 text-gold" />
          </div>
          <div className="min-w-0 text-sm">
            <div className="truncate font-medium">رائد أعمال</div>
            <div className="truncate text-xs text-white/60">أسيوط، مصر</div>
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
