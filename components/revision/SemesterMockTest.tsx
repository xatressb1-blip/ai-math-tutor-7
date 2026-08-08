"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { buildSemesterMockTest } from "@/services/revision/mock-test-bank";
import { saveMockTestResult } from "@/services/revision/mock-test-storage";
import type { MockTestAttempt, MockTestResult } from "@/types/revision";

export function SemesterMockTest() {
  const questions = useMemo(() => buildSemesterMockTest(20), []);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<MockTestResult | null>(null);
  const startedAt = useRef(new Date().toISOString());

  function submit() {
    const attempts: MockTestAttempt[] = questions.map((question) => {
      const selectedChoiceId = answers[question.id] ?? "";
      return {
        questionId: question.id,
        selectedChoiceId,
        isCorrect: selectedChoiceId === question.correctChoiceId,
      };
    });

    const correct = attempts.filter((item) => item.isCorrect).length;
    const chapterBreakdown: Record<string, { correct: number; total: number }> = {};
    const skillMistakes: Record<string, number> = {};

    questions.forEach((question, index) => {
      const key = `Chương ${question.chapter}`;
      chapterBreakdown[key] ??= { correct: 0, total: 0 };
      chapterBreakdown[key].total += 1;
      if (attempts[index].isCorrect) chapterBreakdown[key].correct += 1;
      else skillMistakes[question.skillName] = (skillMistakes[question.skillName] ?? 0) + 1;
    });

    const next: MockTestResult = {
      id: `mock-${Date.now()}`,
      startedAt: startedAt.current,
      completedAt: new Date().toISOString(),
      score: Math.round((correct / questions.length) * 100),
      correct,
      total: questions.length,
      chapterBreakdown,
      skillMistakes,
    };

    saveMockTestResult(next);
    setResult(next);
  }

  if (result) {
    const weakSkills = Object.entries(result.skillMistakes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return (
      <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-slate-950 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <section className="rounded-[2rem] bg-white p-7 text-center shadow-lg">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-indigo-600">
              Semester Mock Test
            </p>
            <div className="mx-auto mt-5 grid h-28 w-28 place-items-center rounded-full bg-slate-950 text-4xl font-black text-white">
              {result.score}
            </div>
            <h1 className="mt-5 text-3xl font-black">
              {result.correct}/{result.total} câu đúng
            </h1>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {Object.entries(result.chapterBreakdown).map(([chapter, item]) => (
                <div key={chapter} className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-2xl font-black">{item.correct}/{item.total}</div>
                  <div className="text-xs font-black uppercase tracking-[0.08em] text-slate-500">{chapter}</div>
                </div>
              ))}
            </div>

            {weakSkills.length > 0 && (
              <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50 p-5 text-left">
                <p className="text-xs font-black uppercase tracking-[0.1em] text-rose-600">Cần ôn tiếp</p>
                <div className="mt-3 space-y-2">
                  {weakSkills.map(([skill, count]) => (
                    <p key={skill} className="text-sm font-bold text-rose-950">
                      • {skill}: {count} lỗi
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-7 flex flex-wrap justify-center gap-2">
              <Link href="/mastery" className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white">
                AI Revision Coach
              </Link>
              <Link href="/pilot" className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-black">
                Pilot Analytics
              </Link>
              <Link href="/" className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-black">
                Thư viện
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-indigo-200">
            Beta 2.4 · AI Mock Test
          </p>
          <h1 className="mt-3 text-4xl font-black">Đề mô phỏng học kỳ I</h1>
          <p className="mt-3 text-sm text-slate-300">
            {questions.length} câu tổng hợp từ ngân hàng Adaptive của các chương.
          </p>
        </header>

        <div className="mt-5 space-y-4">
          {questions.map((question, index) => (
            <article key={question.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-black uppercase tracking-[0.1em] text-indigo-600">
                  Câu {index + 1} · Chương {question.chapter} · Bài {question.lessonNumber}
                </p>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black">
                  Mức {question.difficulty}
                </span>
              </div>
              <h2 className="mt-3 text-base font-black leading-7">{question.prompt}</h2>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {question.choices.map((choice) => (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() =>
                      setAnswers((current) => ({ ...current, [question.id]: choice.id }))
                    }
                    className={`rounded-2xl border p-3 text-left text-sm font-bold ${
                      answers[question.id] === choice.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    {choice.id.toUpperCase()}. {choice.text}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="sticky bottom-4 mt-6 flex justify-end">
          <button
            type="button"
            onClick={submit}
            disabled={Object.keys(answers).length < questions.length}
            className="rounded-2xl bg-indigo-600 px-7 py-4 text-sm font-black text-white shadow-xl disabled:opacity-40"
          >
            Nộp bài ({Object.keys(answers).length}/{questions.length})
          </button>
        </div>
      </div>
    </main>
  );
}
