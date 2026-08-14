import Link from "next/link";
import { runMasteryIntegrityQa } from "@/services/student/mastery-integrity-qa";

export function MasteryIntegrityDashboard() {
  const checks = runMasteryIntegrityQa();
  const passed = checks.filter((item) => item.pass).length;
  const allPass = passed === checks.length;

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-cyan-200">
            v2.8.2-beta.3 · Wave 3
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="text-4xl font-black">Kiểm tra độ tin cậy của mức thành thạo</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Kiểm tra false mastery: Diagnostic, MCQ, Adaptive và Reasoning phải tạo đủ bằng chứng trước khi Student Brain ghi MASTERED.
              </p>
            </div>
            <div className={`rounded-[1.5rem] px-6 py-4 text-center ${allPass ? "bg-emerald-500/20" : "bg-rose-500/20"}`}>
              <div className="text-4xl font-black">{passed}/{checks.length}</div>
              <div className="text-xs font-black uppercase tracking-[0.1em] text-slate-200">
                {allPass ? "PASS" : "CHECK"}
              </div>
            </div>
          </div>
        </header>

        <section className="mt-5 space-y-3">
          {checks.map((check) => (
            <article key={check.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-black">{check.title}</h2>
                  <p className="mt-2 text-sm text-slate-600">Kỳ vọng: {check.expected}</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">Thực tế: {check.actual}</p>
                </div>
                <span className={`rounded-full px-3 py-1.5 text-xs font-black ${check.pass ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                  {check.pass ? "PASS" : "FAIL"}
                </span>
              </div>
            </article>
          ))}
        </section>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/knowledge-qa" className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white">
            Knowledge QA
          </Link>
          <Link href="/mastery" className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-black">
            Student Mastery
          </Link>
          <Link href="/cloud-activation" className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-black">
            Cloud Activation
          </Link>
        </div>
      </div>
    </main>
  );
}
