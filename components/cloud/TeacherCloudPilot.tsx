"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  teacherDeleteCloudStudent,
  teacherListCloudStudents,
  teacherRotateCloudAccess,
  teacherUpsertCloudStudent,
} from "@/services/cloud/cloud-sync-client";
import { loadMultiStudentWorkspace } from "@/services/multi-student/multi-student-storage";
import { loadTeacherClassSettings } from "@/services/teacher/teacher-class-storage";
import type { CloudPilotStudent } from "@/types/cloud-pilot";
import type { MultiStudentWorkspace } from "@/types/multi-student";

function nextLocalAccessCode(existing: string[]): string | null {
  const used = new Set(existing);
  for (let index = 0; index <= 9; index += 1) {
    const code = `HS${index}`;
    if (!used.has(code)) return code;
  }
  return null;
}

export function TeacherCloudPilot() {
  const [workspace, setWorkspace] = useState<MultiStudentWorkspace | null>(null);
  const [classCode, setClassCode] = useState("");
  const [codes, setCodes] = useState<Record<string, string>>({});
  const [remoteStudents, setRemoteStudents] = useState<CloudPilotStudent[]>([]);
  const [message, setMessage] = useState("Bấm “Tải danh sách” để kiểm tra học sinh đã được cấp mã.");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setWorkspace(loadMultiStudentWorkspace());
    setClassCode(loadTeacherClassSettings()?.classCode ?? "");
  }, []);

  const localStudents = useMemo(() => workspace?.students ?? [], [workspace]);

  async function refresh() {
    if (!classCode.trim()) return;
    setBusy(true);
    try {
      const rows = await teacherListCloudStudents(classCode.trim().toUpperCase());
      setRemoteStudents(rows);
      setMessage(`✓ Đã tải ${rows.length} học sinh đã được cấp mã.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không thể tải dữ liệu học sinh.");
    } finally {
      setBusy(false);
    }
  }

  async function provision(studentId: string) {
    if (!workspace || !classCode.trim()) return;
    const brain = workspace.brains[studentId];
    if (!brain) return;
    const localCodes = workspace.students.map((item) => item.accessCode).filter((value): value is string => Boolean(value));
    const accessCode = nextLocalAccessCode(localCodes);
    if (!accessCode) {
      setMessage("Đã dùng đủ mã HS0 đến HS9.");
      return;
    }
    setBusy(true);
    try {
      await teacherUpsertCloudStudent({ classCode: classCode.trim().toUpperCase(), accessCode, brain });
      setCodes((current) => ({ ...current, [studentId]: accessCode }));
      setMessage(`✓ Mã học sinh của ${brain.profile.displayName}: ${accessCode}`);
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không thể cấp mã học sinh.");
    } finally {
      setBusy(false);
    }
  }

  async function rotate(student: CloudPilotStudent) {
    if (!window.confirm(`Đặt lại mã của ${student.displayName}? Mã cũ sẽ ngừng hoạt động.`)) return;
    setBusy(true);
    try {
      const result = await teacherRotateCloudAccess({ classCode: classCode.trim().toUpperCase(), studentId: student.studentId });
      setCodes((current) => ({ ...current, [student.studentId]: result.accessCode }));
      setMessage(`✓ Mã mới của ${student.displayName}: ${result.accessCode}`);
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không thể đặt lại mã.");
    } finally {
      setBusy(false);
    }
  }

  async function revoke(student: CloudPilotStudent) {
    if (!window.confirm(`Thu hồi mã đăng nhập của ${student.displayName}?`)) return;
    setBusy(true);
    try {
      await teacherDeleteCloudStudent({ classCode: classCode.trim().toUpperCase(), studentId: student.studentId });
      setMessage(`✓ Đã thu hồi mã của ${student.displayName}.`);
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không thể thu hồi mã.");
    } finally {
      setBusy(false);
    }
  }

  async function copyCode(studentId: string) {
    const code = codes[studentId];
    if (!code) {
      setMessage("Mã học sinh chỉ gồm HS0–HS9. Nếu cần thay mã, hãy dùng “Đặt lại mã”.");
      return;
    }
    await navigator.clipboard.writeText(`Mã lớp: ${classCode}\nMã học sinh: ${code}`);
    setMessage("✓ Đã sao chép thông tin đăng nhập.");
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-cyan-200">KHU VỰC GIÁO VIÊN · QUẢN LÝ MÃ ĐĂNG NHẬP</p>
          <h1 className="mt-3 text-4xl font-black">Lớp và mã học sinh</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">Dùng trang này khi cần kiểm tra học sinh đã được cấp mã, đặt lại mã hoặc thu hồi quyền đăng nhập.</p>
          <div className="mt-5 flex gap-2"><Link href="/pilot-roster" className="rounded-2xl bg-white px-4 py-2.5 text-sm font-black text-slate-950">← Quản lý học sinh</Link></div>
        </header>

        <section className="mt-5 rounded-[2rem] border border-indigo-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.1em] text-indigo-600">CÁCH DÙNG</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">① Kiểm tra đúng mã lớp → ② Tải danh sách → ③ Dùng “Đặt lại mã” nếu học sinh quên mã → ④ Dùng “Thu hồi mã” khi học sinh không còn được phép đăng nhập.</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input value={classCode} onChange={(e) => setClassCode(e.target.value.toUpperCase())} placeholder="Mã lớp" className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 uppercase outline-none" />
            <button type="button" onClick={refresh} disabled={busy || !classCode.trim()} className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white disabled:opacity-40">Tải danh sách</button>
          </div>
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">{message}</div>
        </section>

        <section className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">Học sinh trên thiết bị này</h2>
          <p className="mt-2 text-sm text-slate-500">Nếu một học sinh chưa có dữ liệu trực tuyến, có thể cấp mã tại đây. Luồng thông thường nên thực hiện ngay ở trang “Quản lý học sinh”.</p>
          <div className="mt-4 space-y-3">
            {localStudents.map((student) => (
              <div key={student.profile.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4">
                <div><b>{student.profile.displayName}</b><div className="text-xs text-slate-500">{student.profile.className}</div></div>
                <div className="flex gap-2"><button type="button" disabled={busy || !classCode.trim()} onClick={() => provision(student.profile.id)} className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700">Cấp mã</button>{codes[student.profile.id] && <button type="button" onClick={() => copyCode(student.profile.id)} className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-black">Sao chép mã</button>}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-5 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="p-5"><h2 className="text-2xl font-black">Học sinh đã được cấp mã</h2><p className="mt-1 text-sm text-slate-500">{remoteStudents.length} học sinh trong mã lớp hiện tại.</p></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">Học sinh</th><th>Mã hiện có</th><th>Cập nhật gần nhất</th><th>Thao tác</th></tr></thead><tbody>{remoteStudents.map((student) => <tr key={student.studentId} className="border-t border-slate-100"><td className="p-3 font-black">{student.displayName}</td><td>{student.accessCodeMasked || "••••"}</td><td>{new Date(student.updatedAt).toLocaleString("vi-VN")}</td><td><div className="flex gap-2"><button type="button" disabled={busy} onClick={() => rotate(student)} className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-black text-amber-700">Đặt lại mã</button><button type="button" disabled={busy} onClick={() => revoke(student)} className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-black text-rose-700">Thu hồi mã</button></div></td></tr>)}</tbody></table></div>
        </section>
      </div>
    </main>
  );
}
