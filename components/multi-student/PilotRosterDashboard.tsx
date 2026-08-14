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
    return (
      <main className="min-h-screen bg-[#f5f7fb] p-8 font-bold">
        Đang tải danh sách học sinh…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-cyan-200">
            KHU VỰC GIÁO VIÊN · QUẢN LÝ HỌC SINH
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black">Danh sách học sinh</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Tạo và chọn hồ sơ học sinh trước khi giao máy cho các em học.
                Mỗi học sinh có hồ sơ học tập AI, phiên học, kỹ năng và lỗi cần khắc phục riêng.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/teacher-cloud"
                className="rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-black text-slate-950"
              >
                Quản lý dữ liệu trực tuyến
              </Link>
              <Link
                href="/teacher-multi"
                className="rounded-2xl bg-white px-4 py-2.5 text-sm font-black text-slate-950"
              >
                Tổng quan nhiều học sinh →
              </Link>
              <Link
                href="/teacher"
                className="rounded-2xl border border-white/20 px-4 py-2.5 text-sm font-black text-white"
              >
                Bảng điều khiển giáo viên
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-5 rounded-[2rem] border border-amber-200 bg-amber-50 p-5">
          <p className="text-xs font-black uppercase tracking-[0.1em] text-amber-700">
            QUY TẮC QUAN TRỌNG
          </p>
          <p className="mt-2 text-sm font-bold leading-6 text-amber-950">
            Trước mỗi phiên học, hãy kiểm tra đúng học sinh đang được chọn. Khi chuyển từ học sinh A sang học sinh B,
            hãy bấm “Chọn học sinh này” trước khi mở bài học.
          </p>
        </section>

        <form
          onSubmit={addStudent}
          className="mt-5 grid gap-3 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[1fr_160px_auto]"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Họ và tên học sinh"
            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
          />
          <input
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Lớp"
            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
          />
          <button
            disabled={!name.trim() || workspace.students.length >= 10}
            className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white disabled:opacity-40"
          >
            + Thêm học sinh
          </button>
        </form>

        <section className="mt-5 grid gap-3">
          {rows.map((row) => {
            const active = row.studentId === workspace.activeStudentId;
            return (
              <article
                key={row.studentId}
                className={`rounded-[1.5rem] border bg-white p-5 shadow-sm ${
                  active ? "border-indigo-500 ring-2 ring-indigo-100" : "border-slate-200"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-black">{row.displayName}</h2>
                      {active && (
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black text-indigo-700">
                          ĐANG HỌC
                        </span>
                      )}
                      {row.needsAttention && (
                        <span className="rounded-full bg-rose-50 px-3 py-1 text-[10px] font-black text-rose-700">
                          CẦN GIÁO VIÊN HỖ TRỢ
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{row.className}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
                    <Mini label="Thành thạo" value={row.mastery} />
                    <Mini label="Chính xác" value={`${row.accuracy}%`} />
                    <Mini label="Phiên học" value={row.sessions} />
                    <Mini label="Lỗi chưa xử lý" value={row.openMistakes} />
                  </div>
                </div>

                {active ? (
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className="text-xs font-black text-indigo-700">
                      ✓ Hồ sơ này đang được dùng cho các hoạt động học tập
                    </span>
                    <Link href="/student" className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-black text-white">
                      Mở trang học sinh →
                    </Link>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => persist(setActivePilotStudent(workspace, row.studentId))}
                    className="mt-4 rounded-xl bg-slate-950 px-4 py-2 text-xs font-black text-white"
                  >
                    Chọn học sinh này
                  </button>
                )}
              </article>
            );
          })}
        </section>

        <p className="mt-4 text-xs font-bold text-slate-400">
          Đang quản lý: {workspace.students.length}/10 học sinh · Dữ liệu cục bộ · Phiên bản dữ liệu {workspace.schemaVersion}
        </p>
      </div>
    </main>
  );
}

function Mini({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="min-w-16 rounded-xl bg-slate-50 p-2">
      <div className="font-black">{value}</div>
      <div className="text-[9px] font-black uppercase text-slate-400">{label}</div>
    </div>
  );
}
