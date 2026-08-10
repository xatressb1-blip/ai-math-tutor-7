import Link from "next/link";
import {
  getAcademicActivities,
  getAcademicChapters,
  getAcademicEngineStats,
  getAcademicLessons,
  getAcademicSources,
} from "@/services/academic/academic-repository";
import { validateAcademicLesson } from "@/services/academic/academic-validator";

export function KnowledgeEngineDashboard() {
  const chapters = getAcademicChapters();
  const lessons = getAcademicLessons();
  const activities = getAcademicActivities();
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
                  Full Semester KB
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-emerald-200">
                  Toán 7 Tập 1 · KNTT
                </span>
              </div>
              <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                Knowledge Base Học kỳ I
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                Đồng bộ đủ 5 chương, 19 bài và 2 hoạt động thực hành trải nghiệm.
                SGK là nguồn chuẩn; SBT và tài liệu học tập dùng để củng cố/vận dụng;
                chuyên đề nâng cao chỉ mở sau khi học sinh đạt mastery nền tảng.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/" className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950">
                ← Học Toán 7
              </Link>
              <Link href="/pilot-ops" className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-black text-white">
                Pilot Control
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-10">
          <Metric label="Schema" value={stats.schemaVersion} />
          <Metric label="Chương" value={stats.chapters} />
          <Metric label="Bài" value={stats.lessons} />
          <Metric label="Trải nghiệm" value={stats.activities} />
          <Metric label="Concepts" value={stats.concepts} />
          <Metric label="Objectives" value={stats.objectives} />
          <Metric label="Mistakes" value={stats.misconceptions} />
          <Metric label="Reasoning" value={stats.reasoningTemplates} />
          <Metric label="Enrichment" value={stats.enrichmentItems} />
          <Metric label="Nguồn" value={stats.sources} />
        </section>

        <section className="mt-6 rounded-[2rem] border border-emerald-100 bg-emerald-50 p-5 sm:p-6">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-emerald-700">
            Academic Governance
          </p>
          <h2 className="mt-2 text-2xl font-black text-emerald-950">
            SGK quyết định chuẩn kiến thức
          </h2>
          <p className="mt-2 max-w-5xl text-sm leading-6 text-emerald-900">
            Mỗi bài bắt buộc có nguồn PRIMARY từ SGK. SBT = PRACTICE; tài liệu học tập =
            ENRICHMENT; chuyên đề nâng cao = ADVANCED_ONLY và chỉ được mở AFTER_MASTERY.
            Vì vậy nội dung bổ trợ không thể làm thay đổi trình tự hoặc yêu cầu nền của SGK.
          </p>
        </section>

        {chapters.map((chapter) => (
          <section key={chapter.id} className="mt-7">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-indigo-600">
                  Chương {chapter.number}
                </p>
                <h2 className="mt-2 text-3xl font-black">{chapter.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  {chapter.summary}
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
                {chapter.qualityStatus}
              </span>
            </div>

            <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {lessons
                .filter((lesson) => lesson.chapterId === chapter.id)
                .map((lesson) => {
                  const validation = validateAcademicLesson(lesson);
                  return (
                    <article
                      key={lesson.id}
                      className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.1em] text-indigo-600">
                            Bài {lesson.lessonNumber}
                          </p>
                          <h3 className="mt-2 text-xl font-black leading-tight">
                            {lesson.title}
                          </h3>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
                            validation.valid
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {validation.valid ? "ACADEMIC OK" : "INVALID"}
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {lesson.summary}
                      </p>

                      <div className="mt-5 grid grid-cols-4 gap-2">
                        <Mini label="Concept" value={lesson.concepts.length} />
                        <Mini label="Mistake" value={lesson.misconceptions.length} />
                        <Mini label="Hints" value={lesson.hintLadders.length} />
                        <Mini label="Mở rộng" value={lesson.enrichment?.length ?? 0} />
                      </div>

                      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">
                          Tầng kiến thức
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                          <Pill text="SGK · Chuẩn" tone="green" />
                          <Pill text="SBT · Củng cố" tone="blue" />
                          <Pill text="Vận dụng" tone="amber" />
                          {lesson.enrichment?.some((item) => item.level === "ADVANCED") && (
                            <Pill text="Nâng cao · Sau mastery" tone="violet" />
                          )}
                        </div>
                      </div>

                      <p className="mt-4 text-xs font-bold text-slate-400">
                        {lesson.sourceRefs[0]?.locator}
                      </p>
                    </article>
                  );
                })}
            </div>
          </section>
        ))}

        <section className="mt-8 rounded-[2rem] border border-sky-100 bg-sky-50 p-5 sm:p-6">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-sky-700">
            Hoạt động thực hành trải nghiệm
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {activities.map((activity) => (
              <article key={activity.id} className="rounded-2xl bg-white p-5 shadow-sm">
                <h3 className="text-xl font-black">{activity.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{activity.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activity.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-xs font-bold text-slate-400">
                  {activity.sourceRefs[0]?.locator}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-7 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-fuchsia-600">
            Source Registry
          </p>
          <h2 className="mt-2 text-2xl font-black">Phân vai nguồn học thuật</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {sources.map((source) => (
              <div key={source.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black">{source.title}</p>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-600">
                    {source.sourceType}
                  </span>
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
      <div className="mt-1 text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">
        {label}
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 text-center">
      <div className="text-lg font-black">{value}</div>
      <div className="text-[9px] font-black uppercase tracking-[0.08em] text-slate-400">
        {label}
      </div>
    </div>
  );
}

function Pill({
  text,
  tone,
}: {
  text: string;
  tone: "green" | "blue" | "amber" | "violet";
}) {
  const cls = {
    green: "bg-emerald-50 text-emerald-700",
    blue: "bg-sky-50 text-sky-700",
    amber: "bg-amber-50 text-amber-700",
    violet: "bg-violet-50 text-violet-700",
  }[tone];
  return <span className={`rounded-full px-2.5 py-1 ${cls}`}>{text}</span>;
}
