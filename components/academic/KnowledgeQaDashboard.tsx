import Link from "next/link";
import { buildKnowledgeQaReport } from "@/services/academic/knowledge-qa-service";

export function KnowledgeQaDashboard() {
  const report = buildKnowledgeQaReport();

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-cyan-200">
            v2.8.2-beta.3 · Knowledge QA + Mastery Integrity
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="text-4xl font-black">
                Audit ánh xạ toàn bộ 19 bài
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                Kiểm tra mỗi bài từ Academic Knowledge Base đã thực sự đi vào
                Lesson Player, Adaptive Practice, AI Tutor, Reasoning Lab và
                Student Brain hay chưa.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/mastery-integrity"
                className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950"
              >
                Mastery Integrity →
              </Link>
              <Link
                href="/knowledge-engine"
                className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950"
              >
                Knowledge Engine →
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-5 grid gap-3 sm:grid-cols-5">
          <Metric label="Tổng bài" value={report.totalLessons} />
          <Metric label="PASS" value={report.passed} />
          <Metric label="WARN" value={report.warned} />
          <Metric label="FAIL" value={report.failed} />
          <Metric label="Coverage" value={`${report.coveragePercent}%`} />
        </section>

        <section className="mt-5 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1120px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="p-4">Bài</th>
                  <th>Lesson Player</th>
                  <th>Adaptive</th>
                  <th>AI Tutor</th>
                  <th>Reasoning</th>
                  <th>Student Brain</th>
                  <th>Core Q</th>
                  <th>Adaptive Q</th>
                  <th>Reasoning Q</th>
                  <th>QA</th>
                </tr>
              </thead>
              <tbody>
                {report.lessons.map((row) => (
                  <tr key={row.lessonId} className="border-t border-slate-100">
                    <td className="p-4">
                      <div className="font-black">
                        Bài {row.lessonNumber}. {row.title}
                      </div>
                      <div className="mt-1 text-xs text-slate-400">
                        Chương {row.chapter} · {row.lessonId}
                      </div>
                      {row.notes.length > 0 && (
                        <div className="mt-2 text-xs font-bold text-amber-700">
                          {row.notes.join(" · ")}
                        </div>
                      )}
                    </td>
                    <td><Flag ok={row.lessonPlayerMapped} /></td>
                    <td><Flag ok={row.adaptivePracticeMapped} /></td>
                    <td><Flag ok={row.tutorMapped} /></td>
                    <td><Flag ok={row.reasoningLabMapped} /></td>
                    <td><Flag ok={row.studentBrainMapped} /></td>
                    <td>{row.coreQuestionCount}</td>
                    <td>{row.adaptiveQuestionCount}</td>
                    <td>{row.reasoningProblemCount}</td>
                    <td>
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-black ${
                          row.status === "PASS"
                            ? "bg-emerald-50 text-emerald-700"
                            : row.status === "WARN"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-5 rounded-[2rem] border border-emerald-100 bg-emerald-50 p-5">
          <h2 className="text-xl font-black text-emerald-950">
            Tiêu chuẩn PASS
          </h2>
          <p className="mt-2 text-sm leading-6 text-emerald-900">
            Một bài chỉ PASS khi có đủ Lesson Player, Adaptive Exercise Bank,
            AI Tutor context, ít nhất một Reasoning Problem và checkpoint để
            Teaching Session ghi skill/mistake/session vào Student Brain.
          </p>
        </section>
      </div>
    </main>
  );
}

function Flag({ ok }: { ok: boolean }) {
  return (
    <span
      className={`font-black ${
        ok ? "text-emerald-600" : "text-rose-600"
      }`}
    >
      {ok ? "✓" : "✕"}
    </span>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-2xl font-black">{value}</div>
      <div className="mt-1 text-[10px] font-black uppercase tracking-[0.08em] text-slate-500">
        {label}
      </div>
    </div>
  );
}
