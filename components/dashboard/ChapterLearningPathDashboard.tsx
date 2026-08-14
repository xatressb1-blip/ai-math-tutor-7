"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getDemoStudentBrain } from "@/services/student/student-brain-service";
import { loadStudentBrainFromStorage } from "@/services/student/student-brain-storage";
import { buildChapterProgress } from "@/services/learning/chapter-progress-engine";
import type { LessonDefinition } from "@/types/lesson";
import type { StudentBrainSnapshot } from "@/types/student";
import type { LessonPathStatus } from "@/types/chapter-progress";

const statusMeta: Record<
  LessonPathStatus,
  { label: string; badge: string; dot: string }
> = {
  LOCKED: {
    label: "Đang khóa",
    badge: "bg-slate-100 text-slate-500",
    dot: "bg-slate-300",
  },
  AVAILABLE: {
    label: "Sẵn sàng",
    badge: "bg-indigo-50 text-indigo-700",
    dot: "bg-indigo-500",
  },
  IN_PROGRESS: {
    label: "Đang học",
    badge: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  NEEDS_REVIEW: {
    label: "Cần ôn",
    badge: "bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
  },
  COMPLETED: {
    label: "Đã hoàn thành",
    badge: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
};

export function ChapterLearningPathDashboard({
  lessons,
}: {
  lessons: LessonDefinition[];
}) {
  const [brain, setBrain] = useState<StudentBrainSnapshot>(getDemoStudentBrain());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = loadStudentBrainFromStorage();
    if (saved) setBrain(saved);
    setReady(true);
  }, []);

  const progress = useMemo(
    () =>
      buildChapterProgress({
        lessons,
        brain,
        chapterTitle: "Số hữu tỉ",
      }),
    [lessons, brain],
  );

  const recommendation = progress.lessons.find(
    (lesson) => lesson.lessonId === progress.recommendedLessonId,
  );

  return (
    <main className="min-h-screen bg-[#f6f8fc] px-4 py-6 text-slate-950 sm:px-8 sm:py-9">
      <div className="mx-auto max-w-7xl">
        <header className="overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-indigo-200">
                  Beta 1.6
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-emerald-200">
                  Chapter Learning Path
                </span>
              </div>
              <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                Chương 1 · {progress.title}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
                {brain.profile.displayName}, đây là bản đồ học tập của em. Hệ
                thống dùng lịch sử học, độ chính xác, Confidence và Mastery để
                quyết định bài nào nên học tiếp.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                <Link
                  href="/"
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950"
                >
                  ← Thư viện bài học
                </Link>
                {recommendation && recommendation.status !== "LOCKED" && (
                  <Link
                    href={`/tutor/${recommendation.lessonId}`}
                    className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-black text-white"
                  >
                    💬 Hỏi AI bài đang ưu tiên
                  </Link>
                )}
                {recommendation && recommendation.status !== "LOCKED" && (
                  <Link
                    href={`/learn/${recommendation.lessonId}`}
                    className="rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-black text-white"
                  >
                    Học theo đề xuất →
                  </Link>
                )}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-indigo-200">
                    Tiến độ Chương 1
                  </p>
                  <p className="mt-2 text-5xl font-black">
                    {progress.overallProgress}%
                  </p>
                </div>
                <div className="text-right text-sm text-slate-300">
                  <p>{progress.completedLessons}/{progress.lessons.length} bài hoàn thành</p>
                  <p className="mt-1">{brain.sessions.length} buổi AI đang nhớ</p>
                </div>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-white transition-all"
                  style={{ width: `${progress.overallProgress}%` }}
                />
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <DarkMetric
                  value={progress.completedLessons}
                  label="Hoàn thành"
                />
                <DarkMetric value={progress.reviewLessons} label="Cần ôn" />
                <DarkMetric
                  value={progress.availableLessons}
                  label="Có thể học"
                />
              </div>
            </div>
          </div>
        </header>

        <section className="mt-6 rounded-[2rem] border border-indigo-100 bg-indigo-50 p-5 sm:p-6">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-indigo-600">
            AI Recommendation
          </p>
          <h2 className="mt-2 text-2xl font-black text-indigo-950">
            {progress.recommendation}
          </h2>
          <p className="mt-2 text-sm leading-6 text-indigo-800">
            Quyết định hiện tại là dữ liệu Beta: một bài được coi là hoàn thành
            khi độ chính xác đạt khoảng 70%, mức tự tin không thấp và mức độ thành thạo đủ ổn.
          </p>
        </section>

        <section className="mt-7">
          <div className="mb-5">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-indigo-600">
              Learning Path
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">
              Em đang ở đâu trong Chương 1?
            </h2>
          </div>

          <div className="space-y-4">
            {progress.lessons.map((lesson, index) => {
              const meta = statusMeta[lesson.status];
              const canOpen = lesson.status !== "LOCKED";

              return (
                <article
                  key={lesson.lessonId}
                  className={`relative overflow-hidden rounded-[1.75rem] border bg-white p-5 shadow-sm sm:p-6 ${
                    lesson.status === "LOCKED"
                      ? "border-slate-200 opacity-70"
                      : lesson.status === "NEEDS_REVIEW"
                        ? "border-rose-200"
                        : lesson.status === "COMPLETED"
                          ? "border-emerald-200"
                          : "border-indigo-100"
                  }`}
                >
                  <div className="grid gap-5 lg:grid-cols-[72px_1fr_auto] lg:items-center">
                    <div className="relative">
                      <div
                        className={`grid h-14 w-14 place-items-center rounded-2xl text-xl font-black ${
                          lesson.status === "COMPLETED"
                            ? "bg-emerald-600 text-white"
                            : lesson.status === "LOCKED"
                              ? "bg-slate-200 text-slate-500"
                              : "bg-slate-950 text-white"
                        }`}
                      >
                        {lesson.status === "COMPLETED" ? "✓" : index + 1}
                      </div>
                      {index < progress.lessons.length - 1 && (
                        <div className="absolute left-7 top-14 hidden h-12 w-px bg-slate-200 lg:block" />
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${meta.badge}`}
                        >
                          {meta.label}
                        </span>
                        {lesson.attempts > 0 && (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                            {lesson.attempts} lượt học
                          </span>
                        )}
                      </div>

                      <h3 className="mt-3 text-xl font-black sm:text-2xl">
                        Bài {lesson.lessonNumber}. {lesson.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {lesson.reason}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <DataPill
                          label="Độ chính xác"
                          value={
                            lesson.latestAccuracy === null
                              ? "—"
                              : `${lesson.latestAccuracy}%`
                          }
                        />
                        <DataPill
                          label="Mức tự tin"
                          value={
                            lesson.latestConfidence === null
                              ? "—"
                              : `${lesson.latestConfidence}/100`
                          }
                        />
                        <DataPill
                          label="Thành thạo"
                          value={
                            lesson.masteryAverage === null
                              ? "—"
                              : `${lesson.masteryAverage}/100`
                          }
                        />
                      </div>
                    </div>

                    <div className="lg:text-right">
                      {canOpen ? (
                        <Link
                          href={`/learn/${lesson.lessonId}`}
                          className={`inline-flex rounded-2xl px-5 py-3 text-sm font-black text-white ${
                            lesson.status === "NEEDS_REVIEW"
                              ? "bg-rose-600"
                              : lesson.status === "COMPLETED"
                                ? "bg-emerald-600"
                                : "bg-slate-950"
                          }`}
                        >
                          {lesson.status === "COMPLETED"
                            ? "Học lại"
                            : lesson.status === "NEEDS_REVIEW"
                              ? "Ôn ngay"
                              : lesson.status === "IN_PROGRESS"
                                ? "Tiếp tục"
                                : "Bắt đầu"}
                        </Link>
                      ) : (
                        <span className="inline-flex rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-400">
                          🔒 Chưa mở
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-7 grid gap-5 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-6">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-600">
              Student Brain
            </p>
            <h2 className="mt-2 text-2xl font-black">
              AI đang ghi nhớ {brain.skills.length} kỹ năng
            </h2>
            <div className="mt-5 space-y-3">
              {[...brain.skills]
                .sort((a, b) => a.masteryScore - b.masteryScore)
                .slice(0, 5)
                .map((skill) => (
                  <div
                    key={skill.id}
                    className="rounded-2xl bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-black">{skill.skillName}</p>
                      <span className="text-sm font-black">
                        {skill.masteryScore}/100
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-slate-950"
                        style={{ width: `${skill.masteryScore}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-white p-6">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-rose-600">
              Review Queue
            </p>
            <h2 className="mt-2 text-2xl font-black">
              Những điểm cần chú ý
            </h2>
            <div className="mt-5 space-y-3">
              {brain.mistakes.filter((item) => !item.resolved).length > 0 ? (
                brain.mistakes
                  .filter((item) => !item.resolved)
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 5)
                  .map((mistake) => (
                    <div
                      key={mistake.id}
                      className="rounded-2xl border border-rose-100 bg-rose-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-bold leading-6 text-rose-950">
                          {mistake.description}
                        </p>
                        <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-black text-rose-700">
                          {mistake.count} lần
                        </span>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
                  Chưa có lỗi lặp lại cần ưu tiên ôn.
                </div>
              )}
            </div>
          </article>
        </section>

        {!ready && (
          <p className="mt-6 text-center text-sm text-slate-400">
            Đang đọc hồ sơ học tập AI…
          </p>
        )}
      </div>
    </main>
  );
}

function DarkMetric({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="text-xl font-black">{value}</div>
      <div className="mt-1 text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">
        {label}
      </div>
    </div>
  );
}

function DataPill({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600">
      {label}: <strong className="text-slate-900">{value}</strong>
    </span>
  );
}
