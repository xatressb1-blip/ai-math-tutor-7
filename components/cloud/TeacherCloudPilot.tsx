"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { teacherListCloudStudents, teacherUpsertCloudStudent } from "@/services/cloud/cloud-sync-client";
import { loadMultiStudentWorkspace } from "@/services/multi-student/multi-student-storage";
import type { CloudPilotStudent } from "@/types/cloud-pilot";
import type { MultiStudentWorkspace } from "@/types/multi-student";

function makeAccessCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (value) => alphabet[value % alphabet.length]).join("");
}

export function TeacherCloudPilot() {
  const [workspace, setWorkspace] = useState<MultiStudentWorkspace | null>(null);
  const [classCode, setClassCode] = useState("7A-PILOT");
  const [teacherKey, setTeacherKey] = useState("");
  const [codes, setCodes] = useState<Record<string, string>>({});
  const [cloud, setCloud] = useState<CloudPilotStudent[]>([]);
  const [message, setMessage] = useState("Chưa đồng bộ Cloud.");
  const [busy, setBusy] = useState(false);

  useEffect(() => setWorkspace(loadMultiStudentWorkspace()), []);
  const localStudents = useMemo(() => workspace?.students ?? [], [workspace]);

  async function uploadStudent(studentId: string) {
    if (!workspace) return;
    const brain = workspace.brains[studentId];
    if (!brain) return;
    const accessCode = codes[studentId] || makeAccessCode();
    setCodes((current) => ({ ...current, [studentId]: accessCode }));
    setBusy(true);
    try {
      await teacherUpsertCloudStudent({
        classCode: classCode.trim().toUpperCase(),
        accessCode,
        teacherKey,
        brain,
      });
      setMessage(`✓ Đã đưa ${brain.profile.displayName} lên Cloud. Mã học sinh: ${accessCode}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không thể cập nhật Cloud.");
    } finally {
      setBusy(false);
    }
  }

  async function refreshCloud() {
    setBusy(true);
    try {
      const rows = await teacherListCloudStudents(classCode.trim().toUpperCase(), teacherKey);
      setCloud(rows);
      setCodes((current) => Object.fromEntries(rows.map((row) => [row.studentId, row.accessCode]).concat(Object.entries(current))));
      setMessage(`✓ Đã tải ${rows.length} hồ sơ từ Cloud.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không thể đọc Cloud.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-amber-200">Beta 2.6.1 · Teacher Cloud Pilot</p>
          <h1 className="mt-3 text-4xl font-black">Cloud Pilot Setup</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Giáo viên đưa từng hồ sơ Pilot lên Cloud, nhận mã học sinh riêng và xem tiến độ từ nhiều thiết bị.
          </p>
        </header>

        <section className="mt-5 grid gap-3 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2">
          <div><label className="text-sm font-black">Mã lớp Pilot</label><input value={classCode} onChange={(e) => setClassCode(e.target.value.toUpperCase())}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 uppercase outline-none focus:border-indigo-500" /></div>
          <div><label className="text-sm font-black">Teacher Key</label><input type="password" value={teacherKey} onChange={(e) => setTeacherKey(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500" placeholder="PILOT_TEACHER_KEY" /></div>
          <div className="sm:col-span-2 flex flex-wrap gap-2">
            <button disabled={busy || !teacherKey || !classCode} onClick={refreshCloud} className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white disabled:opacity-40">↻ Tải danh sách Cloud</button>
            <Link href="/pilot-roster" className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-black">Pilot Roster local</Link>
          </div>
          <div className="sm:col-span-2 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">{message}</div>
        </section>

        <section className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black">Hồ sơ local → Cloud</h2>
          <div className="mt-4 space-y-3">
            {localStudents.map((student) => (
              <article key={student.profile.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div><div className="font-black">{student.profile.displayName}</div><div className="text-xs text-slate-500">{student.profile.className || "Chưa xếp lớp"}</div></div>
                  <div className="flex flex-wrap items-center gap-2">
                    <code className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-black">{codes[student.profile.id] || "Chưa có mã"}</code>
                    <button disabled={busy || !teacherKey || !classCode} onClick={() => uploadStudent(student.profile.id)}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white disabled:opacity-40">Đưa lên Cloud</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black">Hồ sơ đang có trên Cloud</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">Học sinh</th><th>Mã HS</th><th>Sessions</th><th>Skills</th><th>Cập nhật</th></tr></thead>
              <tbody>{cloud.map((row) => <tr key={row.studentId} className="border-t border-slate-100"><td className="p-3 font-black">{row.displayName}</td><td><code className="font-black">{row.accessCode}</code></td><td>{row.brain.sessions.length}</td><td>{row.brain.skills.length}</td><td>{new Date(row.updatedAt).toLocaleString("vi-VN")}</td></tr>)}</tbody></table>
          </div>
        </section>
      </div>
    </main>
  );
}
