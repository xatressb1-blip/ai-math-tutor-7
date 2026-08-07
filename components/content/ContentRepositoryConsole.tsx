"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  activateContentVersion,
  archivePublishedLesson,
  clearContentRepository,
  listContentRecords,
} from "@/services/content/content-repository-storage";
import type { PublishedLessonRecord } from "@/types/content-repository";

export function ContentRepositoryConsole() {
  const [records, setRecords] = useState<PublishedLessonRecord[]>([]);
  const [message, setMessage] = useState("Đang đọc Content Repository...");

  function refresh() {
    const next = listContentRecords();
    setRecords(next);
    setMessage(
      next.length > 0
        ? `Repository đang có ${next.length} phiên bản nội dung.`
        : "Repository chưa có bài nào được publish.",
    );
  }

  useEffect(() => {
    refresh();
  }, []);

  const publishedCount = useMemo(
    () => records.filter((record) => record.status === "PUBLISHED").length,
    [records],
  );
  const archivedCount = records.length - publishedCount;

  function activate(record: PublishedLessonRecord) {
    activateContentVersion(record.repositoryId);
    refresh();
    setMessage(`Đã kích hoạt ${record.lesson.title} v${record.version}.`);
  }

  function archive(record: PublishedLessonRecord) {
    archivePublishedLesson(record.lessonId);
    refresh();
    setMessage(`Đã archive bản đang publish của ${record.lesson.title}.`);
  }

  function clearAll() {
    const confirmed = window.confirm(
      "Xoá toàn bộ Content Repository trên trình duyệt này? Hành động này không xoá source code.",
    );
    if (!confirmed) return;
    clearContentRepository();
    refresh();
    setMessage("Đã xoá Content Repository trên trình duyệt.");
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-indigo-700">
                  Beta 1.4
                </span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-emerald-700">
                  Content Repository
                </span>
              </div>
              <h1 className="mt-3 text-3xl font-black tracking-tight">
                Publish, version và rollback nội dung bài học
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Bài học từ Authoring Studio chỉ đi vào Demo sau khi được publish.
                Mỗi lần publish tạo một phiên bản mới để có thể quay lại bản cũ.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/"
                className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold hover:bg-slate-50"
              >
                ← Thư viện bài học
              </Link>
              <Link
                href="/authoring"
                className="rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white"
              >
                ✍️ Authoring Studio
              </Link>
              <button
                onClick={clearAll}
                className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-700"
              >
                Xoá repository
              </button>
            </div>
          </div>
        </header>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Metric label="Tổng phiên bản" value={records.length} />
          <Metric label="Đang publish" value={publishedCount} />
          <Metric label="Archived" value={archivedCount} />
        </div>

        <p className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-600 shadow-sm">
          {message}
        </p>

        <section className="mt-5 space-y-4">
          {records.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <div className="text-4xl">📭</div>
              <h2 className="mt-4 text-xl font-black">Chưa có nội dung đã publish</h2>
              <p className="mt-2 text-sm text-slate-600">
                Vào Authoring Studio, chỉnh bài rồi bấm Publish để tạo phiên bản đầu tiên.
              </p>
            </div>
          ) : (
            records.map((record) => (
              <article
                key={record.repositoryId}
                className={`rounded-3xl border bg-white p-5 shadow-sm ${
                  record.status === "PUBLISHED"
                    ? "border-emerald-300"
                    : "border-slate-200"
                }`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          record.status === "PUBLISHED"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {record.status}
                      </span>
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-700">
                        v{record.version}
                      </span>
                    </div>
                    <h2 className="mt-3 text-xl font-black">{record.lesson.title}</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Khối {record.lesson.grade} · Chương {record.lesson.chapter} · Bài {record.lesson.lessonNumber}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Publish: {new Date(record.publishedAt).toLocaleString("vi-VN")}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center sm:min-w-[330px]">
                    <SmallStat label="Steps" value={record.lesson.steps.length} />
                    <SmallStat
                      label="Questions"
                      value={record.lesson.steps.filter((step) => step.action === "QUESTION").length}
                    />
                    <SmallStat label="Minutes" value={record.lesson.estimatedMinutes} />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                  {record.status === "ARCHIVED" ? (
                    <button
                      onClick={() => activate(record)}
                      className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white"
                    >
                      ↩ Kích hoạt bản này
                    </button>
                  ) : (
                    <button
                      onClick={() => archive(record)}
                      className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700"
                    >
                      Archive bản đang dùng
                    </button>
                  )}
                </div>
              </article>
            ))
          )}
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
    <div className="rounded-2xl bg-slate-50 p-3">
      <div className="text-lg font-black">{value}</div>
      <div className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">
        {label}
      </div>
    </div>
  );
}
