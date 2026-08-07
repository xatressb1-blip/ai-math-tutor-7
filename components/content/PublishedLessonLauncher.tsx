"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";
import { getPublishedLessonRecord } from "@/services/content/content-repository-storage";
import { getAdaptiveExerciseBank } from "@/services/exercise/adaptive-exercise-bank-registry";
import type { PublishedLessonRecord } from "@/types/content-repository";
import type { LessonDefinition } from "@/types/lesson";

export function PublishedLessonLauncher({
  fallbackLesson,
  nextLesson,
}: {
  fallbackLesson: LessonDefinition;
  nextLesson?: LessonDefinition;
}) {
  const [lesson, setLesson] = useState<LessonDefinition>(fallbackLesson);
  const [publishedRecord, setPublishedRecord] =
    useState<PublishedLessonRecord | null>(null);

  useEffect(() => {
    const record = getPublishedLessonRecord(fallbackLesson.id);
    if (!record) {
      setLesson(fallbackLesson);
      setPublishedRecord(null);
      return;
    }
    setPublishedRecord(record);
    setLesson(record.lesson);
  }, [fallbackLesson]);

  const adaptiveBank = getAdaptiveExerciseBank(fallbackLesson.id);

  return (
    <>
      <div className="fixed right-4 top-4 z-50 flex flex-wrap justify-end gap-2">
        {publishedRecord ? (
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700 shadow-sm">
            Published v{publishedRecord.version}
          </span>
        ) : (
          <span className="rounded-full border border-slate-200 bg-white/95 px-3 py-2 text-xs font-black text-slate-500 shadow-sm">
            Built-in lesson
          </span>
        )}
        <Link
          href="/"
          className="rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-xs font-black text-slate-700 shadow-md backdrop-blur hover:bg-slate-50"
        >
          🏠 Thư viện
        </Link>
        <Link
          href="/progress"
          className="rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-xs font-black text-slate-700 shadow-md backdrop-blur hover:bg-slate-50"
        >
          🗺️ Tiến độ
        </Link>
        <Link
          href={`/tutor/${fallbackLesson.id}`}
          className="rounded-full border border-indigo-200 bg-indigo-50/95 px-4 py-2 text-xs font-black text-indigo-700 shadow-md backdrop-blur hover:bg-indigo-100"
        >
          💬 Hỏi AI
        </Link>
        <Link
          href={`/reasoning-lab/${fallbackLesson.id}`}
          className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-black text-indigo-700 shadow-md hover:bg-indigo-100"
        >
          🧠 Lập luận
        </Link>
        <Link
          href={`/authoring?lesson=${fallbackLesson.id}`}
          className="rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-xs font-black text-slate-700 shadow-md backdrop-blur hover:bg-slate-50"
        >
          ✍️ Authoring
        </Link>
        <Link
          href="/content"
          className="rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-xs font-black text-slate-700 shadow-md backdrop-blur hover:bg-slate-50"
        >
          📚 Content Repo
        </Link>
      </div>

      <LessonPlayer
        lesson={lesson}
        adaptiveBank={adaptiveBank}
        nextLesson={nextLesson}
      />
    </>
  );
}
