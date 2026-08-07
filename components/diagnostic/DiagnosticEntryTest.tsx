"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  buildDiagnosticResult,
  getDiagnosticQuestions,
  getNextDiagnosticQuestion,
} from "@/services/diagnostic/diagnostic-engine";
import { saveDiagnosticResult } from "@/services/diagnostic/diagnostic-storage";
import { syncDiagnosticToStudentBrain } from "@/services/diagnostic/diagnostic-student-sync";
import { getDemoStudentBrain } from "@/services/student/student-brain-service";
import {
  loadStudentBrainFromStorage,
  saveStudentBrainToStorage,
} from "@/services/student/student-brain-storage";
import type {
  DiagnosticAnswer,
  DiagnosticQuestion,
  DiagnosticResult,
} from "@/types/diagnostic";

const TOTAL = getDiagnosticQuestions().length;

export function DiagnosticEntryTest() {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<DiagnosticAnswer[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const questionStartedAt = useRef(Date.now());

  const question = useMemo(
    () => (started && !result ? getNextDiagnosticQuestion({ answers }) : null),
    [answers, result, started],
  );

  const progress = Math.round((answers.length / TOTAL) * 100);

  function begin() {
    setStarted(true);
    setAnswers([]);
    setSelectedChoice(null);
    setResult(null);
    questionStartedAt.current = Date.now();
  }

  function submit(question: DiagnosticQuestion) {
    if (!selectedChoice) return;
    const responseSeconds = Math.max(
      1,
      Math.round((Date.now() - questionStartedAt.current) / 1000),
    );
    const nextAnswer: DiagnosticAnswer = {
      questionId: question.id,
      domain: question.domain,
      lessonNumber: question.lessonNumber,
      skillName: question.skillName,
      difficulty: question.difficulty,
      choiceId: selectedChoice,
      isCorrect: selectedChoice === question.correctChoiceId,
      responseSeconds,
    };
    const nextAnswers = [...answers, nextAnswer];
    const nextQuestion = getNextDiagnosticQuestion({ answers: nextAnswers });

    if (!nextQuestion) {
      const nextResult = buildDiagnosticResult(nextAnswers);
      saveDiagnosticResult(nextResult);
      const brain = loadStudentBrainFromStorage() ?? getDemoStudentBrain();
      const synced = syncDiagnosticToStudentBrain({
        brain,
        result: nextResult,
      });
      saveStudentBrainToStorage(synced);
      setAnswers(nextAnswers);
      setResult(nextResult);
      setSelectedChoice(null);
      return;
    }

    setAnswers(nextAnswers);
    setSelectedChoice(null);
    questionStartedAt.current = Date.now();
  }

  if (!started) {
    return (
      <main className="min-h-screen bg-[#f6f8fc] px-4 py-8 text-slate-950 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <section className="overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white shadow-xl sm:p-10">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-indigo-200">
              Beta 1.7 · Diagnostic Entry Test
            </span>
            <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              AI sẽ tìm điểm bắt đầu phù hợp với em.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Bài kiểm tra đầu vào gồm {TOTAL} câu ngắn về kiến thức tiền đề và
              4 bài đầu Chương 1. Đây không phải bài thi lấy điểm; mục tiêu là
              tránh bắt em học lại điều đã biết hoặc học quá nhanh khi nền tảng
              còn hổng.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <Info value={`~${TOTAL}`} label="Câu hỏi" />
              <Info value="8–12" label="Phút" />
              <Info value="1" label="Điểm bắt đầu" />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={begin}
                className="rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-slate-950"
              >
                Bắt đầu đánh giá →
              </button>
              <Link
                href="/"
                className="rounded-2xl border border-white/15 px-6 py-3.5 text-sm font-black text-white"
              >
                Về thư viện
              </Link>
            </div>
          </section>

          <section className="mt-6 grid gap-4 md:grid-cols-3">
            <Feature
              icon="🎯"
              title="Không học lại vô ích"
              text="Nếu kiến thức đã chắc, AI có thể đặt điểm bắt đầu ở bài sau."
            />
            <Feature
              icon="🧠"
              title="Đọc cả Confidence"
              text="Tốc độ phản hồi và độ ổn định được dùng cùng với đúng/sai."
            />
            <Feature
              icon="🗺️"
              title="Tạo lộ trình riêng"
              text="Kết quả được đồng bộ vào Student Brain và Learning Path."
            />
          </section>
        </div>
      </main>
    );
  }

  if (result) {
    return <DiagnosticResultView result={result} onRetry={begin} />;
  }

  if (!question) return null;

  return (
    <main className="min-h-screen bg-[#f6f8fc] px-4 py-6 text-slate-950 sm:px-8 sm:py-9">
      <div className="mx-auto max-w-4xl">
        <header className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-indigo-600">
                Diagnostic · {answers.length + 1}/{TOTAL}
              </p>
              <p className="mt-1 text-sm font-bold text-slate-600">
                {domainLabel(question.lessonNumber)} · Mức {question.difficulty}
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600">
              {progress}%
            </span>
          </div>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all"
              style={{ width: `${Math.max(4, progress)}%` }}
            />
          </div>
        </header>

        <section className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
            {question.skillName}
          </p>
          <h1 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">
            {question.prompt}
          </h1>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {question.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => setSelectedChoice(choice.id)}
                className={`rounded-2xl border p-4 text-left text-sm font-bold transition sm:text-base ${
                  selectedChoice === choice.id
                    ? "border-indigo-500 bg-indigo-50 text-indigo-950"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300"
                }`}
              >
                <span className="mr-2 text-indigo-600">
                  {choice.id.toUpperCase()}.
                </span>
                {choice.text}
              </button>
            ))}
          </div>

          <div className="mt-7 flex items-center justify-between gap-3">
            <p className="text-xs leading-5 text-slate-400">
              Diagnostic không hiện đáp án trong lúc làm để giữ kết quả khách
              quan hơn.
            </p>
            <button
              disabled={!selectedChoice}
              onClick={() => submit(question)}
              className="shrink-0 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              Câu tiếp theo →
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function DiagnosticResultView({
  result,
  onRetry,
}: {
  result: DiagnosticResult;
  onRetry: () => void;
}) {
  return (
    <main className="min-h-screen bg-[#f6f8fc] px-4 py-7 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-[2rem] bg-slate-950 p-7 text-white shadow-xl sm:p-10">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-300">
            Diagnostic Completed
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">
            AI đề xuất bắt đầu từ Bài {result.startingLessonNumber}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
            {result.recommendation}
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-4">
            <Info value={`${result.score}%`} label="Điểm tổng" />
            <Info value={`${result.confidence}`} label="Confidence" />
            <Info
              value={`${result.correctAnswers}/${result.totalQuestions}`}
              label="Câu đúng"
            />
            <Info value={`Bài ${result.startingLessonNumber}`} label="Start here" />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/learn/${result.startingLessonId}`}
              className="rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-slate-950"
            >
              Học từ điểm AI đề xuất →
            </Link>
            <Link
              href="/progress"
              className="rounded-2xl bg-indigo-500 px-6 py-3.5 text-sm font-black text-white"
            >
              Xem Learning Path
            </Link>
            <button
              onClick={onRetry}
              className="rounded-2xl border border-white/15 px-6 py-3.5 text-sm font-black text-white"
            >
              Làm lại Diagnostic
            </button>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-5">
          {result.lessonScores.map((row) => (
            <article
              key={row.lessonNumber}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-xs font-black uppercase tracking-[0.1em] text-slate-500">
                {row.lessonNumber === 0 ? "Tiền đề" : `Bài ${row.lessonNumber}`}
              </p>
              <p className="mt-2 text-3xl font-black">{row.score}</p>
              <p className="mt-1 text-xs text-slate-500">
                Confidence {row.confidence}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-2">
          <SkillList
            title="Điểm mạnh ban đầu"
            items={result.strongSkills}
            empty="Chưa đủ dữ liệu để xác định điểm mạnh rõ ràng."
            tone="emerald"
          />
          <SkillList
            title="Kỹ năng cần chú ý"
            items={result.weakSkills}
            empty="Chưa phát hiện kỹ năng yếu nổi bật trong bài đánh giá này."
            tone="rose"
          />
        </section>
      </div>
    </main>
  );
}

function domainLabel(lessonNumber: number) {
  return lessonNumber === 0 ? "Kiến thức tiền đề" : `Bài ${lessonNumber}`;
}

function Info({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-2xl font-black">{value}</p>
      <p className="mt-1 text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">
        {label}
      </p>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-2xl">{icon}</div>
      <h2 className="mt-3 font-black">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </article>
  );
}

function SkillList({
  title,
  items,
  empty,
  tone,
}: {
  title: string;
  items: string[];
  empty: string;
  tone: "emerald" | "rose";
}) {
  const styles =
    tone === "emerald"
      ? "border-emerald-100 bg-emerald-50 text-emerald-950"
      : "border-rose-100 bg-rose-50 text-rose-950";
  return (
    <article className={`rounded-[2rem] border p-6 ${styles}`}>
      <h2 className="text-xl font-black">{title}</h2>
      {items.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {items.map((item) => (
            <span key={item} className="rounded-full bg-white px-3 py-1.5 text-sm font-bold">
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm leading-6 opacity-80">{empty}</p>
      )}
    </article>
  );
}
