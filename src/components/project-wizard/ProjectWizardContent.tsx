import { useNavigate } from "react-router-dom";
import {
  QUESTION_ITEMS,
  type ProjectAnswerKey,
  type ProjectAnswers,
} from "./questions";

type ProjectWizardContentProps = {
  idx: number;
  step: number;
  answers: ProjectAnswers;
  onAnswerChange: (key: ProjectAnswerKey, value: string) => void;
  onPrev: () => void;
  onNext: () => void;
  isLast: boolean;
};

export default function ProjectWizardContent({
  idx,
  step,
  answers,
  onAnswerChange,
  onPrev,
  onNext,
  isLast,
}: ProjectWizardContentProps) {
  const navigate = useNavigate();
  const currentQuestion = QUESTION_ITEMS[idx];
  const CurrentQuestionComponent = currentQuestion.Component;

  const handleNavigate = () => {
    navigate("/app/step3");
  };

  return (
    <div
      className="flex min-h-0 flex-col items-center overflow-y-auto px-6 py-8 pb-16 font-cairo"
      dir="rtl"
    >
      <div className="w-full max-w-[680px]">
        <header className="mb-6 text-center">
          <h1 className="text-xl font-bold text-body">
            الخطوة الثانية: تفاصيل المشروع
          </h1>
          <p className="mt-2 text-sm text-slateMuted">
            أجب عن الأسئلة لمساعدة الذكاء الاصطناعي على فهم فكرتك وسياق أسيوط.
          </p>
        </header>

        <div className="mb-6">
          <div className="flex items-center justify-between gap-1">
            {Array.from({ length: 12 }, (_, i) => {
              const n = i + 1;
              const active = n === step;
              const done = n < step;
              return (
                <div key={n} className="flex flex-1 items-center">
                  <div
                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      active
                        ? "bg-nile text-white shadow-[0_0_0_4px_rgba(27,76,140,0.25)] animate-pulse-glow"
                        : done
                          ? "bg-gold text-nile-dark"
                          : "border border-divider bg-white text-slateMuted"
                    }`}
                  >
                    {n}
                  </div>
                  {i < 11 && (
                    <div
                      className={`mx-0.5 h-0.5 flex-1 ${done ? "bg-gold" : "bg-divider"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-center text-xs text-slateMuted">
            السؤال {step} من ١٢
          </p>
        </div>

        <div className="rounded-2xl border border-divider bg-white p-6 shadow-sm">
          <CurrentQuestionComponent
            value={answers[currentQuestion.key]}
            onChange={(value) => onAnswerChange(currentQuestion.key, value)}
          />
        </div>

        <div className="mt-6 flex justify-between gap-3">
          <button
            type="button"
            disabled={idx === 0}
            onClick={onPrev}
            className="rounded-xl border border-divider px-5 py-2.5 text-sm font-semibold text-body disabled:opacity-40"
          >
            السابق
          </button>
          {!isLast ? (
            <button
              type="button"
              disabled={!answers[currentQuestion.key]?.trim()}
              onClick={onNext}
              className="rounded-xl bg-nile px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-nile/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              التالي
            </button>
          ) : (
            <button
              type="button"
              disabled={!answers[currentQuestion.key]?.trim()}
              onClick={handleNavigate}
              className="rounded-xl bg-gold px-6 py-2.5 text-sm font-bold text-nile-dark shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              توليد دراسة الجدوى ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
