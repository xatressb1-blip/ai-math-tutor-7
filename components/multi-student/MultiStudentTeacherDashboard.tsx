"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadMultiStudentWorkspace } from "@/services/multi-student/multi-student-storage";
import { buildMultiStudentClassSummary } from "@/services/multi-student/class-summary";
import type { MultiStudentWorkspace } from "@/types/multi-student";

export function MultiStudentTeacherDashboard() {
  const [workspace, setWorkspace] = useState<MultiStudentWorkspace | null>(null);
  useEffect(() => setWorkspace(loadMultiStudentWorkspace()), []);
  const rows = useMemo(
    () => (workspace ? buildMultiStudentClassSummary(workspace) : []),
    [workspace],
  );

  const classMastery = rows.length
    ? Math.round(rows.reduce((sum, row) => sum + row.mastery, 0) / rows.length)
    : 0;
  const classAccuracy = rows.length
    ? Math.round(rows.reduce((sum, row) => sum + row.accuracy, 0) / rows.length)
    : 0;
  const attention = rows.filter((row) => row.needsAttention).length;

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-amber-200">
            KHU VỰC GIÁO VIÊN · NHIỀU HỌC SINH
          </p>
          <h1 className="mt-3 text-4xl font-black">Tổng quan lớp học</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            So sánh nhanh mức độ thành thạo, độ chính xác, số phiên học và lỗi chưa xử lý
            để biết học sinh nào cần giáo viên ưu tiên hỗ trợ.
          </p>
        </header>

        <section className="mt-5 grid gap-3 sm:grid-cols-4">
          <Metric label="Học sinh" value={rows.length} />
          <Metric label="Thành thạo trung bình" value={`${classMastery}/100`} />
          <Metric label="Độ chính xác trung bình" value={`${classAccuracy}%`} />
          <Metric label="Cần hỗ trợ" value={attention} />
        </section>

        <section className="mt-5 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <h2 className="text-xl font-black">Theo dõi nhanh từng học sinh</h2>
            <p className="mt-1 text-sm text-slate-500">
              Ưu tiên các em có nhãn “Cần hỗ trợ”, sau đó mở hồ sơ để xem kỹ năng và lỗi cụ thể.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="p-4">Học sinh</th>
                  <th>Thành thạo</th>
                  <th>Chính xác</th>
                  <th>Phiên học</th>
                  <th>Lỗi chưa xử lý</th>
                  <th>Tín hiệu</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.studentId} className="border-t border-slate-100">
                    <td className="p-4">
                      <div className="font-black">{row.displayName}</div>
                      <div className="text-xs text-slate-400">{row.className}</div>
                    </td>
                    <td className="font-bold">{row.mastery}/100</td>
                    <td className="font-bold">{row.accuracy}%</td>
                    <td>{row.sessions}</td>
                    <td>{row.openMistakes}</td>
                    <td>
                      {row.needsAttention ? (
                        <span className="font-black text-rose-600">Cần hỗ trợ</span>
                      ) : (
                        <span className="font-black text-emerald-600">Đang ổn</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/pilot-roster" className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white">
            Quản lý danh sách học sinh
          </Link>
          <Link href="/teacher" className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black">
            Bảng điều khiển giáo viên
          </Link>
          <Link href="/" className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black">
            Về trang chính
          </Link>
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-3xl font-black">{value}</div>
      <div className="mt-1 text-xs font-black uppercase tracking-[0.08em] text-slate-500">
        {label}
      </div>
    </div>
  );
}
