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

const studentTools = [
  {
    href: "/",
    icon: "📚",
    title: "Thư viện bài học",
    description: "11 bài học từ Chương I đến Chương III",
  },
  {
    href: "/geometry-lab",
    icon: "📐",
    title: "Phòng học Hình học",
    description: "Khám phá góc và đường thẳng bằng hình trực quan",
  },
  {
    href: "/reasoning-lab/lesson-player-08",
    icon: "🧠",
    title: "Luyện tư duy",
    description: "Giải thích từng bước và luyện cách suy luận",
  },
  {
    href: "/mock-test",
    icon: "📝",
    title: "Thi thử",
    description: "Luyện đề và kiểm tra kiến thức học kỳ I",
  },
  {
    href: "/pilot",
    icon: "📊",
    title: "Kết quả học tập",
    description: "Xem kết quả và phản hồi học tập",
  },
  {
    href: "/mastery",
    icon: "🎯",
    title: "Mức độ thành thạo",
    description: "Theo dõi mức độ thành thạo từng kỹ năng",
  },
];

const teacherTools = [
  {
    href: "/cloud-activation",
    icon: "☁️",
    title: "Kích hoạt hệ thống",
    description: "Kiểm tra kết nối Cloud",
  },
  {
    href: "/teacher-cloud",
    icon: "🔐",
    title: "Quản lý Cloud",
    description: "Quản lý mã và dữ liệu học sinh",
  },
  {
    href: "/pilot-ops",
    icon: "🎛️",
    title: "Điều hành Pilot",
    description: "Theo dõi buổi thử nghiệm",
  },
  {
    href: "/pilot-roster",
    icon: "👥",
    title: "Quản lý học sinh",
    description: "Quản lý danh sách học sinh",
  },
  {
    href: "/teacher",
    icon: "👨‍🏫",
    title: "Bảng điều khiển giáo viên",
    description: "Thống kê và báo cáo",
  },
  {
    href: "/content",
    icon: "🗂️",
    title: "Kho nội dung",
    description: "Quản lý nội dung bài học",
  },
  {
    href: "/knowledge-qa",
    icon: "✅",
    title: "Kiểm định kiến thức",
    description: "Audit ánh xạ 19 bài vào các engine",
  },
];

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
    <main className="min-h-screen bg-[#f6f8fc] px-4 py-5 text-slate-950 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-600 text-3xl font-black text-white shadow-sm">
              π
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                Học Toán 7
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Học vui – Học hiểu – Học tiến bộ
              </p>
            </div>
          </div>

          <Link
            href="/student"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            👤 Trang học của em
          </Link>
        </header>

        <section className="mt-5 overflow-hidden rounded-[2rem] border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/40 to-sky-50 p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold text-slate-600">
            Chào mừng em đến với
          </p>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">
            Học Toán 7
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Chọn bài học hoặc tiếp tục hành trình học của em.
          </p>

          <div className="mt-6 grid gap-3 lg:grid-cols-3">
            <HeroAction
              href="/student"
              icon="🏠"
              title="Trang học của em"
              description="Vào trang học cá nhân"
              tone="blue"
            />
            <HeroAction
              href="/student"
              icon="▶️"
              title="Tiếp tục học"
              description="Tiếp tục nhiệm vụ học hôm nay"
              tone="green"
            />
            <HeroAction
              href="/progress"
              icon="🗺️"
              title="Tiến độ học tập"
              description="Xem tiến độ của em"
              tone="amber"
            />
          </div>
        </section>

        <section className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeading icon="📖" title="HỌC TẬP" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {studentTools.map((tool) => (
              <ToolCard key={tool.title} {...tool} />
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-[2rem] border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeading icon="☁️" title="TÀI KHOẢN HỌC TẬP" />
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <AccountCard
              href="/pilot-onboarding"
              icon="🚀"
              title="Bắt đầu học"
              description="Nhập mã lớp và mã học sinh để mở hồ sơ của em"
            />
            <AccountCard
              href="/cloud-sync"
              icon="☁️"
              title="Đồng bộ bài học"
              description="Đồng bộ dữ liệu học tập giữa các thiết bị"
            />
          </div>
        </section>

        <details className="mt-5 overflow-hidden rounded-[2rem] border border-violet-200 bg-white shadow-sm">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="text-xl">🔒</span>
              <div>
                <h2 className="text-base font-extrabold tracking-wide text-violet-800 sm:text-lg">
                  CÔNG CỤ GIÁO VIÊN
                </h2>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Chỉ dành cho giáo viên và người quản lý
                </p>
              </div>
            </div>
            <span className="text-sm font-bold text-violet-700">
              Mở rộng ▾
            </span>
          </summary>

          <div className="border-t border-violet-100 p-5 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {teacherTools.map((tool) => (
                <TeacherToolCard key={tool.title} {...tool} />
              ))}
            </div>
          </div>
        </details>

        <section className="mt-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-indigo-600">
                Thư viện bài học
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                11 bài học Toán 7
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Nội dung từ Chương I đến Chương III, có luyện tập thích ứng và hỗ trợ AI.
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-extrabold text-emerald-700">
              Đã có Chương I–III
            </span>
          </div>

          {chapters.map((chapter) => (
            <section key={chapter.number} className="mt-8">
              <div className="mb-4">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-indigo-600">
                  Chương {chapter.number}
                </p>
                <h3 className="mt-1 text-2xl font-extrabold">{chapter.title}</h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {chapter.cards.map((card) => {
                  const activeLesson = card.published?.lesson ?? card.lesson;
                  return (
                    <article
                      key={card.lesson.id}
                      className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-extrabold text-indigo-700">
                            Bài {activeLesson.lessonNumber}
                          </span>
                          <h4 className="mt-3 text-xl font-extrabold leading-tight">
                            {activeLesson.title}
                          </h4>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {activeLesson.subtitle}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-slate-950 px-3 py-2 text-center text-white">
                          <div className="text-lg font-extrabold">
                            {activeLesson.estimatedMinutes}
                          </div>
                          <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                            phút
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500">
                          Em sẽ học
                        </p>
                        <ul className="mt-2 space-y-1.5 text-sm leading-6 text-slate-700">
                          {activeLesson.objectives.slice(0, 3).map((objective) => (
                            <li key={objective}>• {objective}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link
                          href={`/learn/${card.lesson.id}`}
                          className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-extrabold text-white"
                        >
                          ▶ Học bài này
                        </Link>
                        <Link
                          href={`/tutor/${card.lesson.id}`}
                          className="rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-extrabold text-indigo-700"
                        >
                          💬 Hỏi AI
                        </Link>
                        {hasAdaptiveExerciseBank(card.lesson.id) && (
                          <Link
                            href={`/reasoning-lab/${card.lesson.id}`}
                            className="rounded-2xl border border-violet-200 bg-violet-50 px-5 py-3 text-sm font-extrabold text-violet-700"
                          >
                            🧠 Luyện tư duy
                          </Link>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </section>

        <footer className="mt-10 border-t border-slate-200 py-6 text-center text-sm font-medium text-slate-500">
          ❤️ Học mỗi ngày – Tiến bộ mỗi ngày!
          <span className="ml-3 text-xs text-slate-400">
            AI Math Tutor v2.7.1-beta.1
          </span>
        </footer>
      </div>
    </main>
  );
}

function HeroAction({
  href,
  icon,
  title,
  description,
  tone,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
  tone: "blue" | "green" | "amber";
}) {
  const toneClass = {
    blue: "bg-blue-600",
    green: "bg-emerald-600",
    amber: "bg-amber-500",
  }[tone];

  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-xl text-white ${toneClass}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-base font-extrabold text-slate-950">{title}</div>
        <div className="mt-1 text-sm font-medium text-slate-500">{description}</div>
      </div>
      <span className="ml-auto text-xl font-bold text-slate-400 group-hover:text-slate-700">
        ›
      </span>
    </Link>
  );
}

function SectionHeading({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xl">{icon}</span>
      <h2 className="text-lg font-extrabold tracking-wide text-emerald-700">
        {title}
      </h2>
    </div>
  );
}

function ToolCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-[1.5rem] border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
    >
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-xl">
        {icon}
      </div>
      <h3 className="mt-3 text-sm font-extrabold leading-5 text-slate-950">
        {title}
      </h3>
      <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
        {description}
      </p>
    </Link>
  );
}

function AccountCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50/40 p-4 transition hover:bg-blue-50"
    >
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-xl shadow-sm">
        {icon}
      </div>
      <div>
        <h3 className="font-extrabold text-blue-700">{title}</h3>
        <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
          {description}
        </p>
      </div>
      <span className="ml-auto text-xl font-bold text-blue-500 group-hover:text-blue-700">
        ›
      </span>
    </Link>
  );
}

function TeacherToolCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-violet-50/40 p-4 transition hover:bg-violet-50"
    >
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-lg shadow-sm">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-extrabold text-slate-900">{title}</h3>
        <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </Link>
  );
}
