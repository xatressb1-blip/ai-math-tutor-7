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
import type { CloudPilotStudent } from "@/types/cloud-pilot";
import type { MultiStudentWorkspace } from "@/types/multi-student";

function makeAccessCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(
    bytes,
    (value) => alphabet[value % alphabet.length],
  ).join("");
}

function freshness(updatedAt: string) {
  const ageMinutes = (Date.now() - new Date(updatedAt).getTime()) / 60_000;
  if (ageMinutes <= 30)
    return { label: "Mới đồng bộ", className: "bg-emerald-50 text-emerald-700" };
  if (ageMinutes <= 24 * 60)
    return { label: "Trong hôm nay", className: "bg-sky-50 text-sky-700" };
  return { label: "Cần kiểm tra", className: "bg-amber-50 text-amber-700" };
}

export function TeacherCloudPilot() {
  const [workspace, setWorkspace] =
    useState<MultiStudentWorkspace | null>(null);
  const [classCode, setClassCode] = useState("7A-PILOT");
  const [teacherKey, setTeacherKey] = useState("");
  const [codes, setCodes] = useState<Record<string, string>>({});
  const [cloud, setCloud] = useState<CloudPilotStudent[]>([]);
  const [message, setMessage] = useState("Chưa đồng bộ Cloud.");
  const [busy, setBusy] = useState(false);
  const [uploadingAll, setUploadingAll] = useState(false);

  useEffect(() => setWorkspace(loadMultiStudentWorkspace()), []);
  const localStudents = useMemo(
    () => workspace?.students ?? [],
    [workspace],
  );

  async function refreshCloud() {
    setBusy(true);
    try {
      const rows = await teacherListCloudStudents(
        classCode.trim().toUpperCase(),
        teacherKey,
      );
      setCloud(rows);
      setMessage(`✓ Đã tải ${rows.length} hồ sơ từ Cloud.`);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Không thể đọc Cloud.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function uploadStudent(studentId: string) {
    if (!workspace) return;
    const brain = workspace.brains[studentId];
    if (!brain) return;

    const accessCode = codes[studentId] || makeAccessCode();
    setBusy(true);
    try {
      await teacherUpsertCloudStudent({
        classCode: classCode.trim().toUpperCase(),
        accessCode,
        teacherKey,
        brain,
      });
      setCodes((current) => ({
        ...current,
        [studentId]: accessCode,
      }));
      setMessage(
        `✓ Đã đưa ${brain.profile.displayName} lên Cloud. Hãy lưu Mã HS ngay: ${accessCode}`,
      );
      await refreshCloud();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Không thể cập nhật Cloud.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function uploadAll() {
    if (!workspace) return;
    if (workspace.students.length > 10) {
      setMessage("Pilot Production hiện giới hạn tối đa 10 học sinh.");
      return;
    }

    setUploadingAll(true);
    try {
      for (const student of workspace.students) {
        const brain = workspace.brains[student.profile.id];
        if (!brain) continue;
        const accessCode =
          codes[student.profile.id] || makeAccessCode();
        await teacherUpsertCloudStudent({
          classCode: classCode.trim().toUpperCase(),
          accessCode,
          teacherKey,
          brain,
        });
        setCodes((current) => ({
          ...current,
          [student.profile.id]: accessCode,
        }));
      }
      setMessage(
        `✓ Đã kích hoạt ${workspace.students.length} hồ sơ Pilot. Hãy lưu các mã mới đang hiển thị.`,
      );
      await refreshCloud();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Không thể upload toàn bộ.",
      );
    } finally {
      setUploadingAll(false);
    }
  }

  async function rotateAccess(student: CloudPilotStudent) {
    if (
      !window.confirm(
        `Cấp mã mới cho ${student.displayName}? Mã cũ sẽ ngừng hoạt động ngay.`,
      )
    ) {
      return;
    }

    setBusy(true);
    try {
      const result = await teacherRotateCloudAccess({
        classCode: classCode.trim().toUpperCase(),
        studentId: student.studentId,
        teacherKey,
      });
      setCodes((current) => ({
        ...current,
        [student.studentId]: result.accessCode,
      }));
      setMessage(
        `✓ Đã cấp mã mới cho ${student.displayName}. Hãy ghi lại ngay: ${result.accessCode}`,
      );
      await refreshCloud();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Không thể cấp mã mới.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function revokeStudent(student: CloudPilotStudent) {
    if (
      !window.confirm(
        `Thu hồi Cloud của ${student.displayName}? Học sinh sẽ không Pull/Push được bằng mã hiện tại.`,
      )
    ) {
      return;
    }

    setBusy(true);
    try {
      await teacherDeleteCloudStudent({
        classCode: classCode.trim().toUpperCase(),
        studentId: student.studentId,
        teacherKey,
      });
      setCodes((current) => {
        const next = { ...current };
        delete next[student.studentId];
        return next;
      });
      setMessage(`✓ Đã thu hồi Cloud của ${student.displayName}.`);
      await refreshCloud();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Không thể thu hồi.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function copyCode(studentId: string) {
    const value = codes[studentId];
    if (!value) {
      setMessage(
        "Mã đầy đủ không được lưu lại sau refresh. Hãy dùng “Cấp mã mới” nếu cần cấp lại.",
      );
      return;
    }
    await navigator.clipboard.writeText(value);
    setMessage("✓ Đã copy Mã HS vào clipboard.");
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-amber-200">
            Beta 2.6.3 · Production Hardening
          </p>
          <h1 className="mt-3 text-4xl font-black">
            10-Student Cloud Pilot
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Kích hoạt, cấp lại mã, theo dõi lần đồng bộ và thu hồi quyền Cloud
            cho tối đa 10 học sinh Pilot.
          </p>
        </header>

        <section className="mt-5 grid gap-3 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2">
          <div>
            <label className="text-sm font-black">Mã lớp Pilot</label>
            <input
              value={classCode}
              onChange={(e) =>
                setClassCode(e.target.value.toUpperCase())
              }
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 uppercase outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-sm font-black">Teacher Key</label>
            <input
              type="password"
              value={teacherKey}
              onChange={(e) => setTeacherKey(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
              placeholder="PILOT_TEACHER_KEY"
            />
          </div>

          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <button
              disabled={busy || uploadingAll || !teacherKey || !classCode}
              onClick={refreshCloud}
              className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white disabled:opacity-40"
            >
              ↻ Tải danh sách Cloud
            </button>
            <button
              disabled={
                busy ||
                uploadingAll ||
                !teacherKey ||
                !classCode ||
                localStudents.length > 10
              }
              onClick={uploadAll}
              className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white disabled:opacity-40"
            >
              ☁ Kích hoạt Pilot ({localStudents.length}/10)
            </button>
            <Link
              href="/pilot-roster"
              className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-black"
            >
              Pilot Roster local
            </Link>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700 sm:col-span-2">
            {message}
          </div>
        </section>

        <section className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black">Hồ sơ local → Cloud</h2>
          <p className="mt-2 text-sm text-slate-500">
            Mã đầy đủ chỉ tồn tại trong phiên trình duyệt hiện tại. Sau refresh,
            hệ thống chỉ còn 4 ký tự cuối trên Cloud.
          </p>

          <div className="mt-4 space-y-3">
            {localStudents.map((student) => (
              <article
                key={student.profile.id}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="font-black">
                      {student.profile.displayName}
                    </div>
                    <div className="text-xs text-slate-500">
                      {student.profile.className || "Chưa xếp lớp"}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <code className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-black">
                      {codes[student.profile.id] || "Chưa có mã mới"}
                    </code>
                    {codes[student.profile.id] && (
                      <button
                        onClick={() => copyCode(student.profile.id)}
                        className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-black"
                      >
                        Copy
                      </button>
                    )}
                    <button
                      disabled={busy || !teacherKey || !classCode}
                      onClick={() => uploadStudent(student.profile.id)}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white disabled:opacity-40"
                    >
                      Đưa lên Cloud
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black">Cloud Roster</h2>
              <p className="mt-1 text-sm text-slate-500">
                {cloud.length}/10 học sinh đang kích hoạt.
              </p>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="p-3">Học sinh</th>
                  <th>Mã HS</th>
                  <th>Sessions</th>
                  <th>Skills</th>
                  <th>Trạng thái</th>
                  <th>Cập nhật</th>
                  <th>Quản lý</th>
                </tr>
              </thead>
              <tbody>
                {cloud.map((row) => {
                  const state = freshness(row.updatedAt);
                  return (
                    <tr
                      key={row.studentId}
                      className="border-t border-slate-100"
                    >
                      <td className="p-3 font-black">
                        {row.displayName}
                      </td>
                      <td>
                        <code className="font-black">
                          {row.accessCodeMasked || "••••"}
                        </code>
                      </td>
                      <td>{row.brain.sessions.length}</td>
                      <td>{row.brain.skills.length}</td>
                      <td>
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-black ${state.className}`}
                        >
                          {state.label}
                        </span>
                      </td>
                      <td>
                        {new Date(row.updatedAt).toLocaleString("vi-VN")}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            disabled={busy}
                            onClick={() => rotateAccess(row)}
                            className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-black text-amber-700 disabled:opacity-40"
                          >
                            Cấp mã mới
                          </button>
                          <button
                            disabled={busy}
                            onClick={() => revokeStudent(row)}
                            className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-black text-rose-700 disabled:opacity-40"
                          >
                            Thu hồi
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
