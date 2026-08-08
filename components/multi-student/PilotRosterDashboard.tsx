"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  createPilotStudent,
  loadMultiStudentWorkspace,
  saveMultiStudentWorkspace,
  setActivePilotStudent,
} from "@/services/multi-student/multi-student-storage";
import { buildMultiStudentClassSummary } from "@/services/multi-student/class-summary";
import type { MultiStudentWorkspace } from "@/types/multi-student";

export function PilotRosterDashboard() {
  const [workspace, setWorkspace] = useState<MultiStudentWorkspace | null>(null);
  const [name, setName] = useState("");
  const [className, setClassName] = useState("7A");

  useEffect(() => setWorkspace(loadMultiStudentWorkspace()), []);

  const rows = useMemo(
    () => (workspace ? buildMultiStudentClassSummary(workspace) : []),
    [workspace],
  );

  function persist(next: MultiStudentWorkspace) {
    saveMultiStudentWorkspace(next);
    setWorkspace(next);
  }

  function addStudent(event: FormEvent) {
    event.preventDefault();
    if (!workspace || !name.trim()) return;
    persist(createPilotStudent(workspace, { displayName: name, className }));
    setName("");
  }

  if (!workspace) {
    return <main className="min-h-screen bg-[#f5f7fb] p-8 font-bold">Đang tải Pilot Workspace…</main>;
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-cyan-200">
            Beta 2.6 · Multi-Student Pilot Foundation
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black">Pilot Student Roster</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Quản lý tối đa khoảng 10 học sinh thử nghiệm trên một workspace.
                Schema đã tách theo studentId để sẵn sàng chuyển sang database/cloud.
              </p>
            </div>
            <Link href="/teacher-multi" className="rounded-2xl bg-white px-4 py-2.5 text-sm font-black text-slate-950">
              Class Analytics →
            </Link>
          </div>
        </header>

        <form onSubmit={addStudent} className="mt-5 grid gap-3 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[1fr_160px_auto]">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên học sinh"
            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500" />
          <input value={className} onChange={(e) => setClassName(e.target.value)} placeholder="Lớp"
            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500" />
          <button disabled={!name.trim() || workspace.students.length >= 10}
            className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white disabled:opacity-40">
            + Thêm học sinh
          </button>
        </form>

        <section className="mt-5 grid gap-3">
          {rows.map((row) => {
            const active = row.studentId === workspace.activeStudentId;
            return (
              <article key={row.studentId} className={`rounded-[1.5rem] border bg-white p-5 shadow-sm ${active ? "border-indigo-500" : "border-slate-200"}`}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-black">{row.displayName}</h2>
                      {active && <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black text-indigo-700">ĐANG CHỌN</span>}
                      {row.needsAttention && <span className="rounded-full bg-rose-50 px-3 py-1 text-[10px] font-black text-rose-700">CẦN CHÚ Ý</span>}
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{row.className}</p>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <Mini label="Mastery" value={row.mastery} />
                    <Mini label="Accuracy" value={`${row.accuracy}%`} />
                    <Mini label="Sessions" value={row.sessions} />
                    <Mini label="Mistakes" value={row.openMistakes} />
                  </div>
                </div>
                {!active && (
                  <button type="button" onClick={() => persist(setActivePilotStudent(workspace, row.studentId))}
                    className="mt-4 rounded-xl bg-slate-950 px-4 py-2 text-xs font-black text-white">
                    Chọn hồ sơ này
                  </button>
                )}
              </article>
            );
          })}
        </section>

        <p className="mt-4 text-xs font-bold text-slate-400">
          Pilot limit: {workspace.students.length}/10 · Local provider · Schema v{workspace.schemaVersion}
        </p>
      </div>
    </main>
  );
}

function Mini({ label, value }: { label: string; value: string | number }) {
  return <div className="min-w-16 rounded-xl bg-slate-50 p-2"><div className="font-black">{value}</div><div className="text-[9px] font-black uppercase text-slate-400">{label}</div></div>;
}
