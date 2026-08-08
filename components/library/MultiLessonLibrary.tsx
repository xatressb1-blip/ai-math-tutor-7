"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  getPublishedLessonRecord,
  listContentRecords,
} from "@/services/content/content-repository-storage";
import type { LessonDefinition } from "@/types/lesson";
import type { PublishedLessonRecord } from "@/types/content-repository";
import { hasAdaptiveExerciseBank } from "@/services/exercise/adaptive-exercise-bank-registry";

type LessonCardState = {
  lesson: LessonDefinition;
  published: PublishedLessonRecord | null;
  versions: number;
};

const chapterTitles: Record<number, string> = {
  1: "Số hữu tỉ",
  2: "Số thực",
  3: "Góc và đường thẳng song song",
};

export function MultiLessonLibrary({
  lessons,
}: {
  lessons: LessonDefinition[];
}) {
  const [cards, setCards] = useState<LessonCardState[]>(
    lessons.map((lesson) => ({ lesson, published: null, versions: 0 })),
  );

  useEffect(() => {
    const records = listContentRecords();
    setCards(
      lessons.map((lesson) => ({
        lesson,
        published: getPublishedLessonRecord(lesson.id),
        versions: records.filter((record) => record.lessonId === lesson.id).length,
      })),
    );
  }, [lessons]);

  const publishedCount = useMemo(
    () => cards.filter((card) => card.published).length,
    [cards],
  );

  const chapters = useMemo(
    () =>
      [...new Set(cards.map((card) => card.lesson.chapter))]
        .sort((a, b) => a - b)
        .map((chapter) => ({
          number: chapter,
          title: chapterTitles[chapter] ?? `Chương ${chapter}`,
          cards: cards.filter((card) => card.lesson.chapter === chapter),
        })),
    [cards],
  );

  return (
    <main className="min-h-screen bg-[#f6f8fc] px-4 py-6 text-slate-950 sm:px-8 sm:py-9">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap gap-2">
              <Link href="/mastery" className="rounded-2xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-950">
                🎯 Semester Mastery
              </Link>
              <Link href="/mock-test" className="rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white">
                📝 Mock Test
              </Link>
              <Link href="/pilot" className="rounded-2xl bg-sky-600 px-4 py-2.5 text-sm font-bold text-white">
                📊 Pilot Analytics
              </Link>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-indigo-700">
                  Beta 2.4.0
                </span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-emerald-700">
                  Chapters I–III Ready
                </span>
              </div>
              <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                Thư viện bài học Toán 7
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
                11 bài học từ Chương I đến Chương III. Chương II và III được
                đưa vào Lesson Player, Adaptive Practice, AI Tutor và Reasoning Lab.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link href="/geometry-lab" className="rounded-2xl bg-cyan-600 px-4 py-2.5 text-sm font-bold text-white">
                📐 Geometry Lab
              </Link>
              <Link href="/knowledge-engine" className="rounded-2xl bg-fuchsia-600 px-4 py-2.5 text-sm font-bold text-white">
                🧠 Knowledge Engine
              </Link>
              <Link href="/teacher" className="rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white">
                👨‍🏫 Teacher Dashboard
              </Link>
              <Link href="/progress" className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white">
                🗺️ Tiến độ
              </Link>
              <Link href="/content" className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold hover:bg-slate-50">
                📚 Content Repository
              </Link>
            </div>
          </div>
        </header>

        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          <Metric label="Bài trong thư viện" value={cards.length} />
          <Metric label="Đã publish" value={publishedCount} />
          <Metric label="Teaching steps" value={cards.reduce((sum, card) => sum + card.lesson.steps.length, 0)} />
          <Metric label="Adaptive Ready" value={cards.filter((card) => hasAdaptiveExerciseBank(card.lesson.id)).length} />
        </div>

        {chapters.map((chapter) => (
          <section key={chapter.number} className="mt-9">
            <div className="mb-5">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-indigo-600">
                Chương {chapter.number}
              </p>
              <h2 className="mt-2 text-3xl font-black">{chapter.title}</h2>
              <p className="mt-2 text-sm text-slate-500">
                {chapter.cards.length} bài · {chapter.cards.filter((card) => hasAdaptiveExerciseBank(card.lesson.id)).length} Adaptive Ready
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {chapter.cards.map((card) => {
                const activeLesson = card.published?.lesson ?? card.lesson;
                return (
                  <article key={card.lesson.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-700">
                            Bài {activeLesson.lessonNumber}
                          </span>
                          {card.published ? (
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                              Published v{card.published.version}
                            </span>
                          ) : (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                              Built-in
                            </span>
                          )}
                          {hasAdaptiveExerciseBank(card.lesson.id) && (
                            <span className="rounded-full bg-fuchsia-50 px-3 py-1 text-xs font-black text-fuchsia-700">
                              Adaptive Ready
                            </span>
                          )}
                        </div>
                        <h3 className="mt-4 text-2xl font-black leading-tight">
                          {activeLesson.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {activeLesson.subtitle}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-950 px-3 py-2 text-center text-white">
                        <div className="text-lg font-black">{activeLesson.estimatedMinutes}</div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">phút</div>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-2">
                      <SmallStat label="Steps" value={activeLesson.steps.length} />
                      <SmallStat label="Questions" value={activeLesson.steps.filter((step) => step.action === "QUESTION").length} />
                      <SmallStat label="Versions" value={card.versions} />
                    </div>

                    <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Mục tiêu chính</p>
                      <ul className="mt-2 space-y-1.5 text-sm leading-6 text-slate-700">
                        {activeLesson.objectives.slice(0, 3).map((objective) => (
                          <li key={objective}>• {objective}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <Link href={`/learn/${card.lesson.id}`} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white">
                        ▶ Học bài này
                      </Link>
                      <Link href={`/tutor/${card.lesson.id}`} className="rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-black text-indigo-700">
                        💬 Hỏi AI
                      </Link>
                      <Link href={`/reasoning-lab/${card.lesson.id}`} className="rounded-2xl border border-fuchsia-200 bg-fuchsia-50 px-5 py-3 text-sm font-black text-fuchsia-700">
                        🧩 Reasoning
                      </Link>
                      <Link href={`/authoring?lesson=${card.lesson.id}`} className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-black text-slate-700">
                        ✍️ Biên soạn
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-2xl font-black">{value}</div>
      <div className="mt-1 text-xs font-black uppercase tracking-[0.1em] text-slate-500">{label}</div>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3 text-center">
      <div className="text-lg font-black">{value}</div>
      <div className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">{label}</div>
    </div>
  );
}
