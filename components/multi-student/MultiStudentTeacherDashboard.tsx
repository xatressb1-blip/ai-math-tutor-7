"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadMultiStudentWorkspace } from "@/services/multi-student/multi-student-storage";
import { buildMultiStudentClassSummary } from "@/services/multi-student/class-summary";
import type { MultiStudentWorkspace } from "@/types/multi-student";

export function MultiStudentTeacherDashboard() {
  const [workspace, setWorkspace] = useState<MultiStudentWorkspace | null>(null);
  useEffect(() => setWorkspace(loadMultiStudentWorkspace()), []);
  const rows = useMemo(() => workspace ? buildMultiStudentClassSummary(workspace) : [], [workspace]);

  const classMastery = rows.length ? Math.round(rows.reduce((s, r) => s + r.mastery, 0) / rows.length) : 0;
  const classAccuracy = rows.length ? Math.round(rows.reduce((s, r) => s + r.accuracy, 0) / rows.length) : 0;
  const attention = rows.filter((r) => r.needsAttention).length;

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-amber-200">Teacher · Multi-Student Pilot</p>
          <h1 className="mt-3 text-4xl font-black">Class Analytics Foundation</h1>
          <p className="mt-3 text-sm text-slate-300">So sánh nhanh các hồ sơ Pilot theo cùng một schema Student Brain.</p>
        </header>

        <section className="mt-5 grid gap-3 sm:grid-cols-4">
          <Metric label="Học sinh" value={rows.length} />
          <Metric label="Mastery lớp" value={`${classMastery}/100`} />
          <Metric label="Accuracy lớp" value={`${classAccuracy}%`} />
          <Metric label="Cần chú ý" value={attention} />
        </section>

        <section className="mt-5 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr><th className="p-4">Học sinh</th><th>Mastery</th><th>Accuracy</th><th>Sessions</th><th>Mistakes</th><th>Tín hiệu</th></tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.studentId} className="border-t border-slate-100">
                    <td className="p-4"><div className="font-black">{row.displayName}</div><div className="text-xs text-slate-400">{row.className}</div></td>
                    <td className="font-bold">{row.mastery}/100</td>
                    <td className="font-bold">{row.accuracy}%</td>
                    <td>{row.sessions}</td><td>{row.openMistakes}</td>
                    <td>{row.needsAttention ? <span className="font-black text-rose-600">Cần chú ý</span> : <span className="font-black text-emerald-600">Ổn</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/pilot-roster" className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white">Quản lý Pilot Roster</Link>
          <Link href="/teacher" className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black">Teacher Dashboard cũ</Link>
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="text-3xl font-black">{value}</div><div className="mt-1 text-xs font-black uppercase tracking-[0.08em] text-slate-500">{label}</div></div>;
}
