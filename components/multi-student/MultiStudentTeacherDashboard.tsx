"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadMultiStudentWorkspace } from "@/services/multi-student/multi-student-storage";
import { buildMultiStudentClassSummary } from "@/services/multi-student/class-summary";
import type { MultiStudentWorkspace } from "@/types/multi-student";

export function MultiStudentTeacherDashboard() {
  const [workspace, setWorkspace] = useState<MultiStudentWorkspace | null>(null);
  useEffect(() => setWorkspace(loadMultiStudentWorkspace()), []);
  const rows = useMemo(() => (workspace ? buildMultiStudentClassSummary(workspace) : []), [workspace]);

  const classMastery = rows.length ? Math.round(rows.reduce((sum, row) => sum + row.mastery, 0) / rows.length) : 0;
  const classAccuracy = rows.length ? Math.round(rows.reduce((sum, row) => sum + row.accuracy, 0) / rows.length) : 0;
  const attention = rows.filter((row) => row.needsAttention).length;

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-amber-200">KHU VỰC GIÁO VIÊN · BƯỚC 2</p>
          <h1 className="mt-3 text-4xl font-black">Theo dõi học sinh</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">So sánh nhanh kết quả để biết học sinh nào cần hỗ trợ trước. Sau đó bấm “Xem tiến độ” để mở hồ sơ chi tiết.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/teacher" className="rounded-2xl bg-white px-4 py-2.5 text-sm font-black text-slate-950">← Bảng điều khiển</Link>
            <Link href="/pilot-roster" className="rounded-2xl border border-white/20 px-4 py-2.5 text-sm font-black">Bước 1 · Quản lý học sinh</Link>
            <Link href="/teacher-progress" className="rounded-2xl border border-white/20 px-4 py-2.5 text-sm font-black">Bước 4 · Kiểm tra tiến bộ</Link>
          </div>
        </header>

        <section className="mt-5 rounded-[2rem] border border-indigo-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.1em] text-indigo-600">BẠN LÀM GÌ Ở TRANG NÀY?</p>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <Help title="1. Nhìn nhãn trạng thái" text="“Cần hỗ trợ” nghĩa là giáo viên nên xem em đó trước." />
            <Help title="2. So sánh 4 chỉ số" text="Xem thành thạo, chính xác, số phiên học và số lỗi chưa xử lý." />
            <Help title="3. Mở tiến độ chi tiết" text="Bấm nút ở cuối dòng để xem kỹ năng yếu, lỗi và lịch sử học." />
          </div>
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-4">
          <Metric label="Học sinh" value={rows.length} />
          <Metric label="Thành thạo trung bình" value={`${classMastery}/100`} />
          <Metric label="Độ chính xác trung bình" value={`${classAccuracy}%`} />
          <Metric label="Cần hỗ trợ" value={attention} />
        </section>

        <section className="mt-5 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <h2 className="text-xl font-black">Danh sách theo mức ưu tiên</h2>
            <p className="mt-1 text-sm text-slate-500">Ưu tiên học sinh có nhãn “Cần hỗ trợ”. Học sinh chưa có dữ liệu nên được hướng dẫn làm đánh giá đầu vào và bắt đầu bài học.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-4">Học sinh</th><th>Thành thạo</th><th>Chính xác</th><th>Phiên học</th><th>Lỗi cần sửa</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.studentId} className="border-t border-slate-100">
                    <td className="p-4"><div className="font-black">{row.displayName}</div><div className="text-xs text-slate-400">{row.className}</div></td>
                    <td className="font-bold">{row.mastery}/100</td><td className="font-bold">{row.accuracy}%</td><td>{row.sessions}</td><td>{row.openMistakes}</td>
                    <td>{row.needsAttention ? <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-rose-600">Cần hỗ trợ</span> : <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-600">Đang ổn</span>}</td>
                    <td><Link href={`/teacher-progress?student=${encodeURIComponent(row.studentId)}`} className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-black text-white">Xem tiến độ</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!rows.length && <p className="p-6 text-sm text-slate-500">Chưa có học sinh. Hãy quay lại Bước 1 để tạo lớp và thêm học sinh.</p>}
        </section>
      </div>
    </main>
  );
}

function Help({ title, text }: { title: string; text: string }) { return <div className="rounded-2xl bg-slate-50 p-4"><h3 className="font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>; }
function Metric({ label, value }: { label: string; value: string | number }) { return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="text-3xl font-black">{value}</div><div className="mt-1 text-xs font-black uppercase tracking-[0.08em] text-slate-500">{label}</div></div>; }
