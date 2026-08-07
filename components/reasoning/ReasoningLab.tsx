"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { getDemoStudentBrain } from "@/services/student/student-brain-service";
import {
  loadStudentBrainFromStorage,
  saveStudentBrainToStorage,
} from "@/services/student/student-brain-storage";
import {
  evaluateReasoningStep,
  calculateReasoningScores,
} from "@/services/reasoning/reasoning-engine";
import { saveReasoningSession } from "@/services/reasoning/reasoning-storage";
import { syncReasoningSessionToStudentBrain } from "@/services/reasoning/reasoning-student-sync";
import type { LessonDefinition } from "@/types/lesson";
import type {
  ReasoningProblem,
  ReasoningSessionSummary,
  ReasoningStepAttempt,
} from "@/types/reasoning";
import type { StudentBrainSnapshot } from "@/types/student";

export function ReasoningLab({
  lesson,
  problems,
}: {
  lesson: LessonDefinition;
  problems: ReasoningProblem[];
}) {
  const [problemIndex, setProblemIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [input, setInput] = useState("");
  const [attempts, setAttempts] = useState<ReasoningStepAttempt[]>([]);
  const [feedback, setFeedback] = useState("");
  const [hint, setHint] = useState("");
  const [completed, setCompleted] = useState(false);
  const [finalSummary, setFinalSummary] =
    useState<ReasoningSessionSummary | null>(null);
  const [brain, setBrain] = useState<StudentBrainSnapshot>(getDemoStudentBrain());
  const startedAt = useRef(new Date().toISOString());

  const problem = problems[problemIndex];
  const step = problem?.steps[stepIndex];

  const stepAttempts = useMemo(
    () => attempts.filter((attempt) => attempt.stepId === step?.id),
    [attempts, step?.id],
  );

  const scores = useMemo(() => calculateReasoningScores(attempts), [attempts]);

  const firstError = useMemo(() => {
    const attempt = attempts.find((item) => !item.isCorrect);
    if (!attempt || !problem) return null;
    const index = problem.steps.findIndex((item) => item.id === attempt.stepId);
    return {
      attempt,
      index,
      definition: problem.steps[index],
    };
  }, [attempts, problem]);

  useEffect(() => {
    const saved = loadStudentBrainFromStorage();
    if (saved) setBrain(saved);
  }, []);

  if (!problem || !step) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 p-6">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black">
            Bài này chưa có Step-by-Step Problem.
          </h1>
          <Link
            href={`/tutor/${lesson.id}`}
            className="mt-5 inline-block rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white"
          >
            Về AI Tutor
          </Link>
        </div>
      </main>
    );
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || completed) return;

    const evaluation = evaluateReasoningStep({
      step,
      input: text,
      previousAttempts: stepAttempts,
    });

    const attempt: ReasoningStepAttempt = {
      stepId: step.id,
      input: text,
      isCorrect: evaluation.isCorrect,
      attemptNumber: stepAttempts.length + 1,
      hintLevel: evaluation.hintLevel,
      category: evaluation.category,
      diagnosis: evaluation.diagnosis,
      createdAt: new Date().toISOString(),
    };

    const nextAttempts = [...attempts, attempt];
    setAttempts(nextAttempts);
    setFeedback(evaluation.feedback);
    setHint(evaluation.nextHint ?? "");
    setInput("");

    if (!evaluation.isCorrect) return;

    const finalStep = stepIndex === problem.steps.length - 1;
    if (!finalStep) {
      setTimeout(() => {
        setStepIndex((current) => current + 1);
        setFeedback("");
        setHint("");
      }, 450);
      return;
    }

    const completedAt = new Date().toISOString();
    const finalScores = calculateReasoningScores(nextAttempts);
    const summary: ReasoningSessionSummary = {
      problemId: problem.id,
      lessonId: lesson.id,
      skillName: problem.skillName,
      completed: true,
      correctSteps: problem.steps.length,
      totalSteps: problem.steps.length,
      attempts: nextAttempts,
      reasoningScore: finalScores.reasoningScore,
      persistenceScore: finalScores.persistenceScore,
      misconceptionCount: finalScores.misconceptionCount,
      firstAttemptAccuracy: finalScores.firstAttemptAccuracy,
      hintDependencyScore: finalScores.hintDependencyScore,
      recoveryScore: finalScores.recoveryScore,
      firstErrorStepId: finalScores.firstErrorStepId,
      startedAt: startedAt.current,
      completedAt,
    };

    saveReasoningSession(summary);
    const nextBrain = syncReasoningSessionToStudentBrain({
      brain,
      lesson,
      summary,
    });
    saveStudentBrainToStorage(nextBrain);
    setBrain(nextBrain);
    setFinalSummary(summary);
    setCompleted(true);
  }

  function restart() {
    setStepIndex(0);
    setInput("");
    setAttempts([]);
    setFeedback("");
    setHint("");
    setCompleted(false);
    setFinalSummary(null);
    startedAt.current = new Date().toISOString();
  }

  const progress = Math.round(
    ((stepIndex + (completed ? 1 : 0)) / problem.steps.length) * 100,
  );

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-5 text-slate-950 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-indigo-200">
                  Beta 2.1
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-emerald-200">
                  Step-by-Step Solution Analyzer
                </span>
              </div>
              <p className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                Bài {lesson.lessonNumber} · {problem.skillName}
              </p>
              <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                {problem.title}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                {problem.prompt}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href={`/tutor/${lesson.id}`}
                className="rounded-2xl bg-white px-4 py-2.5 text-sm font-black text-slate-950"
              >
                💬 AI Tutor
              </Link>
              <Link
                href={`/learn/${lesson.id}`}
                className="rounded-2xl border border-white/15 px-4 py-2.5 text-sm font-black text-white"
              >
                ← Bài học
              </Link>
            </div>
          </div>
        </header>

        <div className="mt-5 grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
          <aside className="space-y-4">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-indigo-600">
                Reasoning Analytics
              </p>
              <div className="mt-3 flex items-end justify-between gap-4">
                <div className="text-4xl font-black">{progress}%</div>
                <div className="text-sm font-bold text-slate-500">
                  Bước {Math.min(stepIndex + 1, problem.steps.length)}/
                  {problem.steps.length}
                </div>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-950"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <Metric value={scores.reasoningScore} label="Reasoning" />
                <Metric
                  value={scores.firstAttemptAccuracy}
                  label="First try"
                  suffix="%"
                />
                <Metric
                  value={scores.hintDependencyScore}
                  label="Hint dependency"
                  suffix="%"
                  lowerIsBetter
                />
                <Metric
                  value={scores.recoveryScore}
                  label="Recovery"
                  suffix="%"
                />
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                Step Map
              </p>
              <div className="mt-4 space-y-3">
                {problem.steps.map((item, index) => {
                  const itemAttempts = attempts.filter(
                    (attempt) => attempt.stepId === item.id,
                  );
                  const solved = itemAttempts.some((attempt) => attempt.isCorrect);
                  const hasError = itemAttempts.some(
                    (attempt) => !attempt.isCorrect,
                  );
                  const active = index === stepIndex && !completed;

                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border p-3 ${
                        active
                          ? "border-indigo-300 bg-indigo-50"
                          : solved
                            ? "border-emerald-200 bg-emerald-50"
                            : hasError
                              ? "border-amber-200 bg-amber-50"
                              : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`grid h-8 w-8 place-items-center rounded-xl text-xs font-black ${
                            solved
                              ? "bg-emerald-600 text-white"
                              : active
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-slate-500"
                          }`}
                        >
                          {solved ? "✓" : index + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-black uppercase tracking-[0.08em] text-slate-500">
                            Bước {index + 1}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-sm font-bold">
                            {item.instruction.replace(/^Bước \d+:\s*/i, "")}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {firstError && (
              <section className="rounded-[2rem] border border-rose-200 bg-rose-50 p-5 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-rose-600">
                  First Error Detection
                </p>
                <h2 className="mt-2 text-xl font-black text-rose-950">
                  Lỗi đầu tiên xuất hiện ở Bước {firstError.index + 1}
                </h2>
                <p className="mt-2 text-sm leading-6 text-rose-900">
                  {firstError.attempt.diagnosis ??
                    "AI chưa thấy ý chính cần có ở bước này."}
                </p>
                <p className="mt-3 rounded-xl bg-white/70 p-3 text-xs font-bold leading-5 text-rose-800">
                  AI sẽ sửa từ lỗi đầu tiên trước, thay vì chấm sai toàn bộ lời
                  giải phía sau.
                </p>
              </section>
            )}
          </aside>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-lg sm:p-7">
            {completed && finalSummary ? (
              <div className="py-5">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-emerald-50 text-3xl">
                  ✓
                </div>
                <h2 className="mt-5 text-center text-3xl font-black">
                  Hoàn thành phân tích từng bước
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-7 text-slate-600">
                  Đáp án cuối: <strong>{problem.finalAnswer}</strong>. AI đã ghi
                  cả độ chính xác lần đầu, mức phụ thuộc gợi ý và khả năng tự sửa
                  lỗi vào Student Brain.
                </p>

                <div className="mx-auto mt-7 grid max-w-3xl gap-3 sm:grid-cols-4">
                  <SummaryMetric
                    value={`${finalSummary.reasoningScore}/100`}
                    label="Reasoning"
                  />
                  <SummaryMetric
                    value={`${finalSummary.firstAttemptAccuracy}%`}
                    label="Đúng lần đầu"
                  />
                  <SummaryMetric
                    value={`${finalSummary.hintDependencyScore}%`}
                    label="Phụ thuộc Hint"
                  />
                  <SummaryMetric
                    value={`${finalSummary.recoveryScore}%`}
                    label="Tự sửa lỗi"
                  />
                </div>

                {firstError && (
                  <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-rose-100 bg-rose-50 p-4 text-left">
                    <p className="text-xs font-black uppercase tracking-[0.1em] text-rose-600">
                      Bước sai đầu tiên
                    </p>
                    <p className="mt-2 text-sm font-bold leading-6 text-rose-950">
                      Bước {firstError.index + 1}:{" "}
                      {firstError.attempt.diagnosis ??
                        firstError.definition?.keyIdea}
                    </p>
                  </div>
                )}

                <div className="mt-7 flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={restart}
                    className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white"
                  >
                    Luyện lại
                  </button>
                  <Link
                    href={`/tutor/${lesson.id}`}
                    className="rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-black text-indigo-700"
                  >
                    Hỏi AI về lời giải
                  </Link>
                  <Link
                    href="/progress"
                    className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-black text-slate-700"
                  >
                    Xem tiến độ
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-indigo-600">
                      Bước {stepIndex + 1}
                    </p>
                    <h2 className="mt-2 text-2xl font-black">
                      {step.instruction}
                    </h2>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600">
                    Hint level {Math.min(stepAttempts.length + 1, 3)}/3
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Hãy viết cách em suy nghĩ. AI sẽ tìm bước sai đầu tiên và chỉ
                  đưa gợi ý vừa đủ để em tự sửa.
                </p>

                <form onSubmit={submit} className="mt-6">
                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    rows={5}
                    placeholder="Ví dụ: Em quy đồng về mẫu 12 nên..."
                    className="w-full resize-none rounded-2xl border border-slate-300 bg-slate-50 px-4 py-4 text-base leading-7 outline-none focus:border-indigo-500"
                  />
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-slate-400">
                      Lượt thử bước này: {stepAttempts.length}
                    </span>
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      className="rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-black text-white disabled:opacity-40"
                    >
                      Phân tích bước này
                    </button>
                  </div>
                </form>

                {feedback && (
                  <div
                    className={`mt-5 rounded-2xl border p-4 ${
                      stepAttempts.at(-1)?.isCorrect
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-amber-200 bg-amber-50"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-black uppercase tracking-[0.1em]">
                        AI Step Analyzer
                      </p>
                      {!stepAttempts.at(-1)?.isCorrect && (
                        <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em]">
                          Hint {stepAttempts.at(-1)?.hintLevel}/3
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm font-bold leading-6">{feedback}</p>
                    {hint && (
                      <p className="mt-3 rounded-xl bg-white/70 p-3 text-sm leading-6">
                        <strong>
                          {stepAttempts.at(-1)?.hintLevel === 3
                            ? "Giải thích:"
                            : "Gợi ý:"}
                        </strong>{" "}
                        {hint}
                      </p>
                    )}
                    {stepAttempts.at(-1)?.diagnosis && (
                      <p className="mt-3 text-xs font-black text-rose-700">
                        Chẩn đoán: {stepAttempts.at(-1)?.diagnosis}
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-7 border-t border-slate-100 pt-5">
                  <p className="text-xs font-black uppercase tracking-[0.1em] text-slate-400">
                    Lịch sử bước hiện tại
                  </p>
                  <div className="mt-3 space-y-2">
                    {stepAttempts.length === 0 ? (
                      <p className="text-sm text-slate-400">
                        Chưa có lượt thử.
                      </p>
                    ) : (
                      stepAttempts.map((attempt) => (
                        <div
                          key={`${attempt.stepId}-${attempt.attemptNumber}`}
                          className="rounded-xl bg-slate-50 p-3 text-sm"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p>
                              <strong>Lượt {attempt.attemptNumber}:</strong>{" "}
                              {attempt.input}
                            </p>
                            <span
                              className={`shrink-0 text-xs font-black ${
                                attempt.isCorrect
                                  ? "text-emerald-600"
                                  : "text-amber-700"
                              }`}
                            >
                              {attempt.isCorrect
                                ? "✓ Đúng"
                                : `Hint ${attempt.hintLevel}`}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function Metric({
  value,
  label,
  suffix = "",
  lowerIsBetter = false,
}: {
  value: number;
  label: string;
  suffix?: string;
  lowerIsBetter?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3 text-center">
      <div className="text-xl font-black">
        {value}
        {suffix}
      </div>
      <div className="mt-1 text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">
        {label}
      </div>
      {lowerIsBetter && (
        <div className="mt-1 text-[9px] font-bold text-slate-400">
          thấp hơn = tốt hơn
        </div>
      )}
    </div>
  );
}

function SummaryMetric({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
      <div className="text-2xl font-black">{value}</div>
      <div className="mt-1 text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">
        {label}
      </div>
    </div>
  );
}
