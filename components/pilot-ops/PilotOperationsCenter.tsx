"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { teacherListCloudStudents } from "@/services/cloud/cloud-sync-client";
import { buildPilotOperationsSnapshot } from "@/services/pilot-ops/pilot-operations";
import {
  exportPilotJson,
  exportPilotSummaryCsv,
} from "@/services/pilot-ops/pilot-export";
import {
  loadPilotChecklist,
  resetPilotChecklist,
  savePilotChecklist,
} from "@/services/pilot-ops/pilot-checklist-storage";
import type { CloudPilotStudent } from "@/types/cloud-pilot";
import type { PilotChecklistItem } from "@/types/pilot-operations";

export function PilotOperationsCenter() {
  const [classCode, setClassCode] = useState("7A-PILOT");
  const [teacherKey, setTeacherKey] = useState("");
  const [cloud, setCloud] = useState<CloudPilotStudent[]>([]);
  const [checklist, setChecklist] = useState<PilotChecklistItem[]>([]);
  const [message, setMessage] = useState("Chưa tải dữ liệu Pilot.");
  const [busy, setBusy] = useState(false);

  useEffect(() => setChecklist(loadPilotChecklist()), []);

  const snapshot = useMemo(
    () => buildPilotOperationsSnapshot(classCode, cloud),
    [classCode, cloud],
  );

  async function refresh() {
    setBusy(true);
    try {
      const rows = await teacherListCloudStudents(
        classCode.trim().toUpperCase(),
        teacherKey,
      );
      setCloud(rows);
      setMessage(`✓ Đã tải ${rows.length} học sinh từ Cloud.`);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Không thể tải Pilot.",
      );
    } finally {
      setBusy(false);
    }
  }

  function toggleChecklist(id: string) {
    const next = checklist.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item,
    );
    setChecklist(next);
    savePilotChecklist(next);
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-amber-200">
            Beta 2.7 · Real 10-Student Pilot Operations
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="text-4xl font-black">Teacher Pilot Control Center</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                Một màn hình để theo dõi 10 học sinh, kiểm tra tín hiệu cần chú ý,
                xuất backup và vận hành buổi Pilot.
              </p>
            </div>
            <Link
              href="/teacher-cloud"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950"
            >
              Quản lý mã Cloud →
            </Link>
          </div>
        </header>

        <section className="mt-5 grid gap-3 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[1fr_1fr_auto]">
          <input
            value={classCode}
            onChange={(e) => setClassCode(e.target.value.toUpperCase())}
            placeholder="Mã lớp"
            className="rounded-2xl border border-slate-300 px-4 py-3 uppercase outline-none focus:border-indigo-500"
          />
          <input
            type="password"
            value={teacherKey}
            onChange={(e) => setTeacherKey(e.target.value)}
            placeholder="Teacher Key"
            className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
          />
          <button
            onClick={refresh}
            disabled={busy || !teacherKey || !classCode}
            className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white disabled:opacity-40"
          >
            ↻ Tải Pilot
          </button>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700 sm:col-span-3">
            {message}
          </div>
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <Metric label="Học sinh" value={`${snapshot.totalStudents}/10`} />
          <Metric label="Có sync hôm nay" value={snapshot.activeToday} />
          <Metric label="Quá 24h" value={snapshot.staleStudents} />
          <Metric label="Cần chú ý" value={snapshot.attentionStudents} />
          <Metric label="Mastery TB" value={`${snapshot.averageMastery}/100`} />
          <Metric label="Accuracy TB" value={`${snapshot.averageAccuracy}%`} />
        </section>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_0.56fr]">
          <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <h2 className="text-2xl font-black">Cloud Student Monitor</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Tín hiệu được tính từ Student Brain và thời điểm sync.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  disabled={!cloud.length}
                  onClick={() => exportPilotSummaryCsv(classCode, cloud)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-black disabled:opacity-40"
                >
                  Export CSV
                </button>
                <button
                  disabled={!cloud.length}
                  onClick={() => exportPilotJson(classCode, cloud)}
                  className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-black text-white disabled:opacity-40"
                >
                  Backup JSON
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="p-4">Học sinh</th>
                    <th>Sessions</th>
                    <th>Mastery</th>
                    <th>Accuracy</th>
                    <th>Mistakes</th>
                    <th>Sync</th>
                    <th>Tín hiệu</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshot.students.map((row) => (
                    <tr key={row.studentId} className="border-t border-slate-100">
                      <td className="p-4 font-black">{row.displayName}</td>
                      <td>{row.sessions}</td>
                      <td>{row.mastery}/100</td>
                      <td>{row.accuracy}%</td>
                      <td>{row.openMistakes}</td>
                      <td>
                        <Freshness value={row.freshness} />
                      </td>
                      <td>
                        {row.needsAttention ? (
                          <div>
                            <span className="font-black text-rose-600">Cần chú ý</span>
                            <p className="mt-1 max-w-xs text-xs text-slate-500">
                              {row.reasons.join(" · ")}
                            </p>
                          </div>
                        ) : (
                          <span className="font-black text-emerald-600">Ổn</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.1em] text-amber-600">
                  Pilot Checklist
                </p>
                <h2 className="mt-2 text-2xl font-black">Trước · Trong · Sau</h2>
              </div>
              <button
                onClick={() => setChecklist(resetPilotChecklist())}
                className="text-xs font-black text-slate-400"
              >
                Reset
              </button>
            </div>

            {(["BEFORE", "DURING", "AFTER"] as const).map((phase) => (
              <div key={phase} className="mt-5">
                <p className="text-xs font-black uppercase tracking-[0.08em] text-slate-400">
                  {phase === "BEFORE" ? "Trước buổi" : phase === "DURING" ? "Trong buổi" : "Sau buổi"}
                </p>
                <div className="mt-2 space-y-2">
                  {checklist.filter((item) => item.phase === phase).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleChecklist(item.id)}
                      className={`w-full rounded-2xl border p-3 text-left text-sm font-bold ${
                        item.done
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                          : "border-slate-200 bg-slate-50 text-slate-700"
                      }`}
                    >
                      {item.done ? "✓ " : "○ "}
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-2xl font-black">{value}</div>
      <div className="mt-1 text-[10px] font-black uppercase tracking-[0.08em] text-slate-500">
        {label}
      </div>
    </div>
  );
}

function Freshness({
  value,
}: {
  value: "FRESH" | "TODAY" | "STALE";
}) {
  const meta = {
    FRESH: ["Mới sync", "bg-emerald-50 text-emerald-700"],
    TODAY: ["Hôm nay", "bg-sky-50 text-sky-700"],
    STALE: [">24h", "bg-amber-50 text-amber-700"],
  }[value];

  return (
    <span className={`rounded-full px-3 py-1 text-[10px] font-black ${meta[1]}`}>
      {meta[0]}
    </span>
  );
}
