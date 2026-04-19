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

  const handleNavigate = () => {
    navigate("/app/step3");
  };

  return (
    <div
      className="flex min-h-0 flex-col items-center overflow-y-auto px-4 py-8 pb-16 font-cairo sm:px-6"
      dir="rtl"
    >
      <div className="w-full max-w-[760px]">
        <header className="mb-6 text-center">
          <h1 className="text-xl font-bold text-body">
            الخطوة الثانية: تفاصيل المشروع
          </h1>
          <p className="mt-2 text-sm text-slateMuted">
            أجب عن الأسئلة لمساعدة الذكاء الاصطناعي على فهم فكرتك وسياق أسيوط.
          </p>
        </header>

        <div className="mb-6">
          <div className="rounded-2xl border border-divider bg-white px-3 py-3 sm:px-4">
            <div className="grid grid-cols-6 justify-items-center gap-2 sm:grid-cols-8 md:grid-cols-12">
            {Array.from({ length: QUESTION_ITEMS.length }, (_, i) => {
              const n = i + 1;
              const active = n === step;
              const done = n < step;
              return (
                <div
                  key={n}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    active
                      ? "bg-nile text-white shadow-[0_0_0_4px_rgba(27,76,140,0.25)] animate-pulse-glow"
                      : done
                        ? "bg-gold text-nile-dark"
                        : "border border-divider bg-white text-slateMuted"
                  }`}
                >
                  {n}
                </div>
              );
            })}
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-slateMuted">
            السؤال {step} من {QUESTION_ITEMS.length}
          </p>
        </div>

        <div className="rounded-2xl border border-divider bg-white p-4 shadow-sm sm:p-6">
          <p className="mb-2 inline-flex rounded-full bg-nile/10 px-3 py-1 text-xs font-bold text-nile">
            {currentQuestion.stage}
          </p>
          <h2 className="mb-2 text-lg font-bold text-nile">{currentQuestion.title}</h2>
          {currentQuestion.helpText && (
            <p className="mb-4 text-sm text-slateMuted">{currentQuestion.helpText}</p>
          )}

          {currentQuestion.inputType === "options" && (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {currentQuestion.options?.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onAnswerChange(currentQuestion.key, option)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    answers[currentQuestion.key] === option
                      ? "bg-nile text-white"
                      : "border border-divider bg-offwhite text-body hover:border-nile/40"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {currentQuestion.inputType === "text" && (
            <input
              value={answers[currentQuestion.key]}
              onChange={(e) => onAnswerChange(currentQuestion.key, e.target.value)}
              placeholder={currentQuestion.placeholder ?? "اكتب إجابتك هنا"}
              className="w-full rounded-xl border border-divider bg-offwhite px-4 py-3 text-sm outline-none focus:border-nile focus:ring-2 focus:ring-nile/20"
            />
          )}

          {currentQuestion.inputType === "textarea" && (
            <>
              <textarea
                value={answers[currentQuestion.key]}
                onChange={(e) =>
                  onAnswerChange(
                    currentQuestion.key,
                    e.target.value.slice(0, currentQuestion.maxLength ?? 300),
                  )
                }
                rows={5}
                placeholder={currentQuestion.placeholder ?? "اكتب إجابتك هنا"}
                className="w-full rounded-xl border border-divider bg-offwhite px-4 py-3 text-sm outline-none focus:border-nile focus:ring-2 focus:ring-nile/20"
              />
              <p className="mt-2 text-left text-xs text-slateMuted">
                {answers[currentQuestion.key].length}/{currentQuestion.maxLength ?? 300}
              </p>
            </>
          )}
        </div>

        <div className="mt-6 flex flex-wrap justify-between gap-3">
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
