"use client";

import Link from "next/link";
import { runAdvancedQualityAudit } from "@/services/advanced/advanced-quality-qa";

export function AdvancedQualityDashboard() {
  const report = runAdvancedQualityAudit();

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-amber-300">
            Kiểm định Toán nâng cao
          </p>
          <h1 className="mt-3 text-4xl font-black">Advanced Math Quality Gate</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Kiểm tra các câu trả lời cố tình đánh lừa bộ đánh giá, tính toàn vẹn suy luận và mức độ đa dạng sư phạm trước khi mở rộng Bài 5–19.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className={`rounded-full px-4 py-2 text-sm font-black ${report.passed ? "bg-emerald-400 text-slate-950" : "bg-rose-400 text-slate-950"}`}>
              {report.passed ? "PASS" : "FAIL"} · {report.passedCount}/{report.totalCount}
            </span>
            <Link href="/teacher" className="rounded-2xl border border-white/20 px-4 py-2 text-sm font-black text-white">
              ← Bảng điều khiển giáo viên
            </Link>
          </div>
        </header>

        <section className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black">Adversarial QA</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            PASS chỉ khi evaluator chấp nhận đúng câu cần PASS và từ chối đúng câu cố tình chứa từ khóa, substring hoặc đáp số không có lập luận.
          </p>
          <div className="mt-5 grid gap-3">
            {report.results.map((item) => (
              <article key={item.id} className={`rounded-2xl border p-4 ${item.passed ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-black">{item.purpose}</h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${item.passed ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}`}>
                    {item.passed ? "PASS" : "FAIL"} · mong đợi {item.expected} / thực tế {item.actual}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-700"><strong>Câu thử:</strong> {item.input}</p>
                <p className="mt-2 text-xs text-slate-500"><strong>Phản hồi:</strong> {item.feedback}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black">Ma trận đa dạng suy luận</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {report.diversity.map((item) => (
              <article key={item.lesson} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-indigo-600">Bài {item.lesson}</p>
                <h3 className="mt-1 font-black">{item.lessonTitle}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.primaryModes.join(" · ")}</p>
                {item.warning ? <p className="mt-3 rounded-xl bg-amber-100 p-3 text-xs font-bold text-amber-900">{item.warning}</p> : null}
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
