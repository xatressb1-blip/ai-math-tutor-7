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

  return (
    <main className="min-h-screen bg-[#f6f8fc] px-4 py-6 text-slate-950 sm:px-8 sm:py-9">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-indigo-700">
                  Beta 2.2
                </span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-emerald-700">
                  Teacher Analytics Ready
                </span>
              </div>
              <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                Thư viện bài học Toán 7
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
                Mỗi bài có Lesson Definition riêng, có thể biên soạn, publish,
                version và mở trực tiếp trong Lesson Player.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/teacher"
                className="rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white"
              >
                👨‍🏫 Teacher Dashboard
              </Link>
              <Link
                href="/progress"
                className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white"
              >
                🗺️ Tiến độ Chương 1
              </Link>
              <Link
                href="/content"
                className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold hover:bg-slate-50"
              >
                📚 Content Repository
              </Link>
              <Link
                href="/authoring?lesson=lesson-player-01"
                className="rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white"
              >
                ✍️ Authoring Studio
              </Link>
            </div>
          </div>
        </header>

        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          <Metric label="Bài trong thư viện" value={cards.length} />
          <Metric label="Đã publish" value={publishedCount} />
          <Metric
            label="Teaching steps"
            value={cards.reduce((sum, card) => sum + card.lesson.steps.length, 0)}
          />
          <Metric
            label="Checkpoint"
            value={cards.reduce(
              (sum, card) =>
                sum +
                card.lesson.steps.filter((step) => step.action === "QUESTION").length,
              0,
            )}
          />
        </div>

        <section className="mt-7">
          <div className="mb-5">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-indigo-600">
              Chương 1
            </p>
            <h2 className="mt-2 text-3xl font-black">Số hữu tỉ</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {cards.map((card) => {
              const activeLesson = card.published?.lesson ?? card.lesson;
              return (
                <article
                  key={card.lesson.id}
                  className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
                >
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
                      <div className="text-lg font-black">
                        {activeLesson.estimatedMinutes}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                        phút
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <SmallStat label="Steps" value={activeLesson.steps.length} />
                    <SmallStat
                      label="Questions"
                      value={
                        activeLesson.steps.filter((step) => step.action === "QUESTION")
                          .length
                      }
                    />
                    <SmallStat label="Versions" value={card.versions} />
                  </div>

                  <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                      Mục tiêu chính
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm leading-6 text-slate-700">
                      {activeLesson.objectives.slice(0, 3).map((objective) => (
                        <li key={objective}>• {objective}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link
                      href={`/learn/${card.lesson.id}`}
                      className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white"
                    >
                      ▶ Học bài này
                    </Link>
                    <Link
                      href={`/tutor/${card.lesson.id}`}
                      className="rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-black text-indigo-700"
                    >
                      💬 Hỏi AI
                    </Link>
                    <Link
                      href={`/authoring?lesson=${card.lesson.id}`}
                      className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-black text-slate-700"
                    >
                      ✍️ Biên soạn
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-2xl font-black">{value}</div>
      <div className="mt-1 text-xs font-black uppercase tracking-[0.1em] text-slate-500">
        {label}
      </div>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3 text-center">
      <div className="text-lg font-black">{value}</div>
      <div className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">
        {label}
      </div>
    </div>
  );
}
