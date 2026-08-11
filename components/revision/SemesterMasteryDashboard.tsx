"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getDemoStudentBrain } from "@/services/student/student-brain-service";
import { loadStudentBrainFromStorage } from "@/services/student/student-brain-storage";
import { buildSemesterRevisionPlan } from "@/services/revision/semester-revision-engine";
import { hasSufficientMasteryEvidence } from "@/services/student/mastery-integrity-policy";
import type { StudentBrainSnapshot } from "@/types/student";

export function SemesterMasteryDashboard() {
  const [brain, setBrain] = useState<StudentBrainSnapshot>(getDemoStudentBrain());

  useEffect(() => {
    const saved = loadStudentBrainFromStorage();
    if (saved) setBrain(saved);
  }, []);

  const plan = useMemo(() => buildSemesterRevisionPlan(brain), [brain]);
  const evidenceTrackedSkills = brain.skills.filter((skill) => Boolean(skill.evidence)).length;
  const verifiedMasteredSkills = brain.skills.filter(
    (skill) =>
      skill.status === "MASTERED" &&
      Boolean(skill.evidence) &&
      hasSufficientMasteryEvidence(skill.evidence!),
  ).length;

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-indigo-200">
            Beta 2.4 · Semester I Mastery
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="text-4xl font-black">Ôn tập học kỳ I cá nhân hóa</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Student Brain tự chọn kỹ năng yếu, đề xuất thứ tự ôn và cho biết
                mức sẵn sàng trước khi làm đề mô phỏng.
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-white/10 px-6 py-4 text-center">
              <div className="text-4xl font-black">{plan.readinessScore}</div>
              <div className="mt-3 space-y-1 text-xs text-slate-600">
                <div>Phủ chương trình: {plan.curriculumCoverage}%</div>
                <div>Mastery đã xác minh: {plan.verifiedMasteryCoverage}%</div>
                {plan.unresolvedMisconceptionPenalty > 0 ? (
                  <div>Khấu trừ misconception: -{plan.unresolvedMisconceptionPenalty}</div>
                ) : null}
              </div>
              <div className="text-xs font-black uppercase tracking-[0.1em] text-slate-300">
                Readiness
              </div>
            </div>
          </div>
        </header>

        <section className="mt-5 grid gap-3 sm:grid-cols-5">
          <Metric label="Mastery TB" value={`${plan.masteryAverage}/100`} />
          <Metric label="Confidence TB" value={`${plan.confidenceAverage}/100`} />
          <Metric label="Accuracy" value={`${plan.accuracyAverage}%`} />
          <Metric label="Skill có Evidence" value={`${evidenceTrackedSkills}`} />
          <Metric label="Mastery đã xác minh" value={`${verifiedMasteredSkills}`} />
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.72fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-indigo-600">
              AI Revision Coach
            </p>
            <h2 className="mt-2 text-2xl font-black">Kế hoạch ôn hôm nay</h2>
            <div className="mt-5 space-y-3">
              {plan.tasks.map((task, index) => (
                <article key={task.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.08em] text-slate-400">
                        Việc {index + 1} · {task.estimatedMinutes} phút
                      </p>
                      <h3 className="mt-1 font-black">{task.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {task.description}
                      </p>
                      <p className="mt-2 text-xs font-bold text-slate-400">{task.reason}</p>
                    </div>
                    <Priority value={task.priority} />
                  </div>
                  <Link
                    href={task.href}
                    className="mt-4 inline-flex rounded-xl bg-slate-950 px-4 py-2 text-xs font-black text-white"
                  >
                    Bắt đầu
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-[2rem] border border-rose-100 bg-rose-50 p-6">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-rose-600">
                Cần ưu tiên
              </p>
              <div className="mt-4 space-y-2">
                {plan.weakestSkills.map((skill, index) => (
                  <div key={skill} className="rounded-2xl bg-white/80 p-3 text-sm font-black text-rose-950">
                    {index + 1}. {skill}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-6">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-emerald-600">
                Điểm mạnh
              </p>
              <div className="mt-4 space-y-2">
                {plan.strongestSkills.map((skill) => (
                  <div key={skill} className="rounded-2xl bg-white/80 p-3 text-sm font-black text-emerald-950">
                    ✓ {skill}
                  </div>
                ))}
              </div>
            </section>

            <Link
              href="/mock-test"
              className="block rounded-[2rem] bg-indigo-600 p-6 text-white shadow-lg"
            >
              <p className="text-xs font-black uppercase tracking-[0.12em] text-indigo-200">
                Mock Test
              </p>
              <h3 className="mt-2 text-2xl font-black">Làm đề mô phỏng HKI →</h3>
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-3xl font-black">{value}</div>
      <div className="mt-1 text-xs font-black uppercase tracking-[0.1em] text-slate-500">{label}</div>
    </div>
  );
}

function Priority({ value }: { value: "HIGH" | "MEDIUM" | "LOW" }) {
  const meta = {
    HIGH: "bg-rose-50 text-rose-700",
    MEDIUM: "bg-amber-50 text-amber-700",
    LOW: "bg-emerald-50 text-emerald-700",
  }[value];
  const label = { HIGH: "Ưu tiên cao", MEDIUM: "Ưu tiên vừa", LOW: "Ôn nhẹ" }[value];
  return <span className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-black ${meta}`}>{label}</span>;
}
