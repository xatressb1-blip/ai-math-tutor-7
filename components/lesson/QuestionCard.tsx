"use client";

import type { TeachingFeedback } from "@/services/teaching/teaching-session-engine";
import type { LessonQuestion } from "@/types/lesson";

const confidenceLabel = {
  LOW: "đang quan sát",
  MEDIUM: "khá phù hợp",
  HIGH: "lặp lại rõ",
} as const;

export function QuestionCard({
  question,
  selectedChoiceId,
  feedback,
  onSelect,
  onCheck,
  attemptCount = 0,
  solved = false,
}: {
  question: LessonQuestion;
  selectedChoiceId: string | null;
  feedback: TeachingFeedback | null;
  onSelect: (choiceId: string) => void;
  onCheck: () => void;
  attemptCount?: number;
  solved?: boolean;
}) {
  const diagnosis = feedback?.brainDecision.diagnosis;

  return (
    <div className="mt-6 rounded-3xl border border-indigo-100 bg-indigo-50/60 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-indigo-600">
          Câu hỏi · {question.skillName}
        </p>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-slate-500">
          {solved ? "Đã hoàn thành" : `Lượt thử ${attemptCount + 1}`}
        </span>
      </div>

      <h3 className="mt-3 text-xl font-black leading-8 text-slate-950">
        {question.prompt}
      </h3>

      <div className="mt-5 grid gap-3">
        {question.choices.map((choice) => {
          const selected = choice.id === selectedChoiceId;
          return (
            <button
              key={choice.id}
              type="button"
              onClick={() => onSelect(choice.id)}
              disabled={solved}
              className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold transition disabled:cursor-default ${
                selected
                  ? "border-indigo-600 bg-white text-indigo-700 shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 enabled:hover:border-indigo-300"
              }`}
            >
              <span className="mr-2 inline-grid h-7 w-7 place-items-center rounded-lg bg-slate-100 text-xs font-black uppercase">
                {choice.id}
              </span>
              {choice.text}
            </button>
          );
        })}
      </div>

      {feedback && (
        <div className="mt-4 space-y-3">
          <div
            className={`rounded-2xl p-4 text-sm font-semibold leading-6 ${
              feedback.kind === "correct"
                ? "bg-emerald-100 text-emerald-900"
                : feedback.kind === "explain"
                  ? "bg-amber-100 text-amber-950"
                  : "bg-sky-100 text-sky-950"
            }`}
          >
            <p className="font-black">{feedback.title}</p>
            <p className="mt-1">{feedback.text}</p>
          </div>

          {diagnosis && (
            <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-700">
                  🧠 AI Teaching Brain
                </p>
                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-violet-600">
                  {confidenceLabel[diagnosis.confidence]}
                </span>
              </div>
              <p className="mt-2 text-sm font-black text-violet-950">
                AI suy đoán: {diagnosis.label}
              </p>
              <p className="mt-1 text-sm leading-6 text-violet-800">
                {diagnosis.evidence}
              </p>
              <div className="mt-3 rounded-xl bg-white/80 p-3 text-sm leading-6 text-slate-700">
                <strong>Cách dạy tiếp:</strong>{" "}
                {feedback.brainDecision.nextActionLabel}
              </div>
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={onCheck}
        disabled={!selectedChoiceId || solved}
        className="mt-5 w-full rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white transition enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {solved ? "Đã trả lời đúng" : "Kiểm tra câu trả lời"}
      </button>
    </div>
  );
}
