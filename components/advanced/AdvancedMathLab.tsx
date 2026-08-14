"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { calculateReasoningScores } from "@/services/reasoning/reasoning-engine";
import { evaluateAdvancedReasoningStep } from "@/services/advanced/advanced-reasoning-evaluator";
import { saveReasoningSession } from "@/services/reasoning/reasoning-storage";
import { syncReasoningSessionToStudentBrain } from "@/services/reasoning/reasoning-student-sync";
import { getDemoStudentBrain } from "@/services/student/student-brain-service";
import { loadStudentBrainFromStorage, saveStudentBrainToStorage } from "@/services/student/student-brain-storage";
import type { AdvancedMathProblem } from "@/types/advanced";
import type { LessonDefinition } from "@/types/lesson";
import type { ReasoningSessionSummary, ReasoningStepAttempt } from "@/types/reasoning";
import type { StudentBrainSnapshot } from "@/types/student";

export function AdvancedMathLab({
  lesson,
  problems,
}: {
  lesson: LessonDefinition;
  problems: AdvancedMathProblem[];
}) {
  const [brain, setBrain] = useState<StudentBrainSnapshot>(getDemoStudentBrain());
  const [problemIndex, setProblemIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [input, setInput] = useState("");
  const [attempts, setAttempts] = useState<ReasoningStepAttempt[]>([]);
  const [feedback, setFeedback] = useState("");
  const [hint, setHint] = useState("");
  const [completed, setCompleted] = useState(false);
  const [completedProblemIds, setCompletedProblemIds] = useState<string[]>([]);
  const [finalSummary, setFinalSummary] = useState<ReasoningSessionSummary | null>(null);
  const startedAt = useRef(new Date().toISOString());

  useEffect(() => {
    const saved = loadStudentBrainFromStorage();
    if (saved) setBrain(saved);
  }, []);

  const problem = problems[problemIndex];
  const step = problem?.steps[stepIndex];
  const stepAttempts = useMemo(
    () => attempts.filter((attempt) => attempt.stepId === step?.id),
    [attempts, step?.id],
  );
  const scores = useMemo(() => calculateReasoningScores(attempts), [attempts]);

  if (!problem || !step) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 p-6">
        <div className="max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black">Chưa có bài nâng cao cho nội dung này</h1>
          <Link href={`/learn/${lesson.id}`} className="mt-5 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white">
            ← Quay lại bài học
          </Link>
        </div>
      </main>
    );
  }

  function resetForProblem(index: number) {
    setProblemIndex(index);
    setStepIndex(0);
    setInput("");
    setAttempts([]);
    setFeedback("");
    setHint("");
    setCompleted(false);
    setFinalSummary(null);
    startedAt.current = new Date().toISOString();
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || completed) return;

    const evaluation = evaluateAdvancedReasoningStep({ step, input: text, previousAttempts: stepAttempts });
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
    if (stepIndex < problem.steps.length - 1) {
      setStepIndex((value) => value + 1);
      setFeedback("");
      setHint("");
      return;
    }

    const completedAt = new Date().toISOString();
    const finalScores = calculateReasoningScores(nextAttempts);
    const summary: ReasoningSessionSummary = {
      problemId: problem.id,
      lessonId: lesson.id,
      skillName: problem.skillName,
      canonicalSkillId: problem.canonicalSkillId,
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
    const nextBrain = syncReasoningSessionToStudentBrain({ brain, lesson, summary });
    saveStudentBrainToStorage(nextBrain);
    setBrain(nextBrain);
    setFinalSummary(summary);
    setCompleted(true);
    setCompletedProblemIds((items) => [...new Set([...items, problem.id])]);
  }

  const progress = Math.round(((stepIndex + (completed ? 1 : 0)) / problem.steps.length) * 100);

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-5 text-slate-950 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-amber-300">
                Toán nâng cao · Bài {lesson.lessonNumber}
              </p>
              <h1 className="mt-2 text-3xl font-black sm:text-4xl">Thử thách tư duy: {lesson.title}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                Phần này không yêu cầu em làm thật nhanh. AI quan tâm cách em lập luận, cách em tự sửa và lý do đằng sau đáp án.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href={`/tutor/${lesson.id}`} className="rounded-2xl bg-white px-4 py-2.5 text-sm font-black text-slate-950">💬 Hỏi gia sư AI</Link>
              <Link href={`/learn/${lesson.id}`} className="rounded-2xl border border-white/15 px-4 py-2.5 text-sm font-black text-white">← Bài học chuẩn</Link>
            </div>
          </div>
        </header>

        <section className="mt-5 rounded-[2rem] border border-amber-200 bg-amber-50 p-5 sm:p-6">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-amber-700">Lộ trình nâng cao</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {problems.map((item, index) => {
              const active = index === problemIndex;
              const done = completedProblemIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => resetForProblem(index)}
                  className={`rounded-2xl border p-4 text-left transition ${active ? "border-slate-950 bg-white shadow-sm" : "border-amber-200 bg-white/70 hover:bg-white"}`}
                >
                  <p className="text-xs font-black uppercase tracking-[0.1em] text-amber-700">{done ? "✓ Đã hoàn thành" : item.levelLabel}</p>
                  <h2 className="mt-2 font-black">{item.title}</h2>
                  <p className="mt-2 text-xs leading-5 text-slate-600">{item.learningGoal}</p>
                </button>
              );
            })}
          </div>
        </section>

        <div className="mt-5 grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
          <aside className="space-y-4">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-indigo-600">AI đồng hành</p>
              <h2 className="mt-2 text-xl font-black">{problem.levelLabel}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{problem.companionMessage}</p>
              <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-slate-950" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-xs font-bold text-slate-500">Bước {Math.min(stepIndex + 1, problem.steps.length)}/{problem.steps.length} · {progress}%</p>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Theo dõi suy luận</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Metric label="Suy luận" value={`${scores.reasoningScore}/100`} />
                <Metric label="Đúng lần đầu" value={`${scores.firstAttemptAccuracy}%`} />
                <Metric label="Phụ thuộc gợi ý" value={`${scores.hintDependencyScore}%`} />
                <Metric label="Tự sửa" value={`${scores.recoveryScore}%`} />
              </div>
            </section>
          </aside>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-lg sm:p-7">
            {completed && finalSummary ? (
              <div className="py-4">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-2xl">✓</div>
                <p className="mt-5 text-xs font-black uppercase tracking-[0.12em] text-emerald-600">Đã hoàn thành thử thách</p>
                <h2 className="mt-2 text-3xl font-black">Em đã chứng minh được cách suy nghĩ của mình</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">Kết luận: <strong>{problem.finalAnswer}</strong></p>
                <div className="mt-5 grid gap-3 sm:grid-cols-4">
                  <Metric label="Suy luận" value={`${finalSummary.reasoningScore}/100`} />
                  <Metric label="Đúng lần đầu" value={`${finalSummary.firstAttemptAccuracy}%`} />
                  <Metric label="Phụ thuộc gợi ý" value={`${finalSummary.hintDependencyScore}%`} />
                  <Metric label="Tự sửa" value={`${finalSummary.recoveryScore}%`} />
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {problemIndex < problems.length - 1 ? (
                    <button type="button" onClick={() => resetForProblem(problemIndex + 1)} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white">Thử thách tiếp theo →</button>
                  ) : (
                    <Link href="/mastery" className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white">Xem mức độ thành thạo →</Link>
                  )}
                  <button type="button" onClick={() => resetForProblem(problemIndex)} className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-black">Làm lại thử thách</button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-indigo-600">{problem.levelLabel}</p>
                <h2 className="mt-2 text-3xl font-black">{problem.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{problem.prompt}</p>
                <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.1em] text-slate-500">Bước {stepIndex + 1}</p>
                  <p className="mt-2 text-lg font-black">{step.instruction}</p>
                </div>

                <form onSubmit={submit} className="mt-5">
                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    rows={5}
                    placeholder="Viết cách em suy nghĩ ở đây. Có thể dùng lời, phép tính hoặc cả hai."
                    className="w-full rounded-2xl border border-slate-300 p-4 text-sm leading-7 outline-none focus:border-indigo-500"
                  />
                  <button type="submit" disabled={!input.trim()} className="mt-3 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white disabled:opacity-40">AI kiểm tra cách suy nghĩ</button>
                </form>

                {feedback ? (
                  <div className={`mt-5 rounded-2xl p-4 ${stepAttempts.at(-1)?.isCorrect ? "bg-emerald-50 text-emerald-950" : "bg-amber-50 text-amber-950"}`}>
                    <p className="font-black">{feedback}</p>
                    {hint ? <p className="mt-2 text-sm leading-6"><strong>Gợi ý:</strong> {hint}</p> : null}
                  </div>
                ) : null}
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <div className="text-lg font-black">{value}</div>
      <div className="mt-1 text-[10px] font-black uppercase tracking-[0.08em] text-slate-500">{label}</div>
    </div>
  );
}
