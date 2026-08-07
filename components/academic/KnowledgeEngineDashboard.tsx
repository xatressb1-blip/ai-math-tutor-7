import Link from "next/link";
import {
  getAcademicChapters,
  getAcademicEngineStats,
  getAcademicLessons,
  getAcademicSources,
} from "@/services/academic/academic-repository";
import { validateAcademicLesson } from "@/services/academic/academic-validator";

export function KnowledgeEngineDashboard() {
  const chapters = getAcademicChapters();
  const lessons = getAcademicLessons();
  const sources = getAcademicSources();
  const stats = getAcademicEngineStats();

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-slate-950 sm:px-8 sm:py-9">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-indigo-200">
                  Beta 2.3.3
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-emerald-200">
                  Knowledge Engine · Chapters II–III
                </span>
              </div>
              <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                Academic Schema v1.0
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                Tầng dữ liệu học thuật chuẩn hóa để Lesson Player, AI Tutor,
                Reasoning, Adaptive Practice, Student Brain và Teacher
                Analytics cùng đọc một nguồn sự thật.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/" className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950">
                ← Thư viện
              </Link>
              <Link href="/teacher" className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-black text-white">
                Teacher Dashboard
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
          <Metric label="Schema" value={stats.schemaVersion} />
          <Metric label="Chương" value={stats.chapters} />
          <Metric label="Bài nền" value={stats.lessons} />
          <Metric label="Concepts" value={stats.concepts} />
          <Metric label="Objectives" value={stats.objectives} />
          <Metric label="Mistakes" value={stats.misconceptions} />
          <Metric label="Reasoning" value={stats.reasoningTemplates} />
          <Metric label="Nguồn" value={stats.sources} />
        </section>

        <section className="mt-6 rounded-[2rem] border border-emerald-100 bg-emerald-50 p-5 sm:p-6">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-emerald-700">Academic Governance</p>
          <h2 className="mt-2 text-2xl font-black text-emerald-950">SGK là nguồn chuẩn chính</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-emerald-900">
            Schema bắt buộc mỗi Academic Lesson có nguồn PRIMARY. SBT dùng cho
            luyện tập; tài liệu học tập dùng để hệ thống hóa; chuyên đề nâng cao
            chỉ được mở khi học sinh đã đạt nền tảng.
          </p>
        </section>

        {chapters.map((chapter) => (
          <section key={chapter.id} className="mt-7">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-indigo-600">Chương {chapter.number}</p>
                <h2 className="mt-2 text-3xl font-black">{chapter.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{chapter.summary}</p>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-black text-indigo-700">
                {chapter.qualityStatus}
              </span>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {lessons.filter((lesson) => lesson.chapterId === chapter.id).map((lesson) => {
                const validation = validateAcademicLesson(lesson);
                return (
                  <article key={lesson.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.1em] text-indigo-600">Bài {lesson.lessonNumber}</p>
                        <h3 className="mt-2 text-xl font-black leading-tight">{lesson.title}</h3>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${validation.valid ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                        {validation.valid ? "SCHEMA OK" : "INVALID"}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{lesson.summary}</p>
                    <div className="mt-5 grid grid-cols-3 gap-2">
                      <Mini label="Concept" value={lesson.concepts.length} />
                      <Mini label="Mistake" value={lesson.misconceptions.length} />
                      <Mini label="Hints" value={lesson.hintLadders.length} />
                    </div>
                    <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">Academic coverage</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-700">
                        <Pill text="Objectives" />
                        <Pill text="Concepts" />
                        <Pill text="Teaching Script" />
                        <Pill text="Examples" />
                        <Pill text="Mistakes" />
                        <Pill text="Hint Ladder" />
                        <Pill text="Reasoning" />
                        <Pill text="Assessment" />
                        <Pill text="Student Brain" />
                        <Pill text="Teacher Tags" />
                      </div>
                    </div>
                    <p className="mt-4 text-xs font-bold text-slate-400">{lesson.sourceRefs[0]?.locator}</p>
                  </article>
                );
              })}
            </div>
          </section>
        ))}

        <section className="mt-7 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-fuchsia-600">Source Registry</p>
          <h2 className="mt-2 text-2xl font-black">Nguồn học thuật được phân vai rõ ràng</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {sources.map((source) => (
              <div key={source.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black">{source.title}</p>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-600">{source.sourceType}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{source.note}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-2xl font-black">{value}</div>
      <div className="mt-1 text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">{label}</div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 text-center">
      <div className="text-lg font-black">{value}</div>
      <div className="text-[9px] font-black uppercase tracking-[0.08em] text-slate-400">{label}</div>
    </div>
  );
}

function Pill({ text }: { text: string }) {
  return <span className="rounded-full bg-white px-2.5 py-1 shadow-sm">{text}</span>;
}
