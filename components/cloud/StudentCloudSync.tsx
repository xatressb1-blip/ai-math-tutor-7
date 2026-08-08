"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  clearCloudIdentity,
  loadCloudIdentity,
  pullCloudStudent,
  pushCloudStudent,
  saveCloudIdentity,
} from "@/services/cloud/cloud-sync-client";
import { loadStudentBrainFromStorage, saveStudentBrainToStorage } from "@/services/student/student-brain-storage";
import {
  loadMultiStudentWorkspace,
  saveMultiStudentWorkspace,
  setActivePilotStudent,
  upsertStudentBrain,
} from "@/services/multi-student/multi-student-storage";

export function StudentCloudSync() {
  const existing = typeof window === "undefined" ? null : loadCloudIdentity();
  const [classCode, setClassCode] = useState(existing?.classCode ?? "");
  const [accessCode, setAccessCode] = useState(existing?.accessCode ?? "");
  const [message, setMessage] = useState("Chưa đồng bộ.");
  const [busy, setBusy] = useState(false);
  const [configured, setConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/pilot-cloud")
      .then((response) => response.json())
      .then((data) => setConfigured(Boolean(data.configured)))
      .catch(() => setConfigured(false));
  }, []);

  function identity() {
    return {
      classCode: classCode.trim().toUpperCase(),
      accessCode: accessCode.trim().toUpperCase(),
    };
  }

  async function pull() {
    setBusy(true);
    try {
      const id = identity();
      const remote = await pullCloudStudent(id);
      saveCloudIdentity(id);
      saveStudentBrainToStorage(remote.brain);
      let workspace = loadMultiStudentWorkspace();
      workspace = upsertStudentBrain(workspace, remote.brain);
      if (!workspace.students.some((item) => item.profile.id === remote.brain.profile.id)) {
        workspace = {
          ...workspace,
          students: [...workspace.students, {
            profile: remote.brain.profile,
            status: "ACTIVE",
            joinedAt: remote.brain.profile.createdAt,
            lastActiveAt: new Date().toISOString(),
          }],
        };
      }
      workspace = setActivePilotStudent(workspace, remote.brain.profile.id);
      saveMultiStudentWorkspace(workspace);
      setMessage(`✓ Đã tải Student Brain của ${remote.displayName} từ Cloud.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không thể tải Cloud.");
    } finally {
      setBusy(false);
    }
  }

  async function push() {
    setBusy(true);
    try {
      const brain = loadStudentBrainFromStorage();
      if (!brain) throw new Error("Thiết bị chưa có Student Brain để gửi.");
      const id = identity();
      const remote = await pushCloudStudent(id, brain);
      saveCloudIdentity(id);
      setMessage(`✓ Đã gửi tiến độ của ${remote.displayName} lên Cloud.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không thể gửi Cloud.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-cyan-200">Beta 2.6.1 · Student Identity</p>
          <h1 className="mt-3 text-4xl font-black">Cloud Student Sync</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Học sinh dùng Mã lớp + Mã học sinh do giáo viên cung cấp để nhận đúng hồ sơ trên nhiều thiết bị.
          </p>
        </header>

        <section className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className={`rounded-2xl p-4 text-sm font-bold ${configured ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>
            {configured === null ? "Đang kiểm tra Cloud…" : configured ? "✓ Cloud API đã được cấu hình." : "Cloud chưa cấu hình trên server. Local mode vẫn hoạt động bình thường."}
          </div>

          <label className="mt-5 block text-sm font-black">Mã lớp</label>
          <input value={classCode} onChange={(e) => setClassCode(e.target.value.toUpperCase())} placeholder="Ví dụ: 7A-PILOT"
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 uppercase outline-none focus:border-indigo-500" />

          <label className="mt-5 block text-sm font-black">Mã học sinh</label>
          <input value={accessCode} onChange={(e) => setAccessCode(e.target.value.toUpperCase())} placeholder="Ví dụ: H7K2Q9"
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 uppercase outline-none focus:border-indigo-500" />

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button disabled={busy || !classCode.trim() || !accessCode.trim()} onClick={pull}
              className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white disabled:opacity-40">
              ↓ Tải hồ sơ từ Cloud
            </button>
            <button disabled={busy || !classCode.trim() || !accessCode.trim()} onClick={push}
              className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white disabled:opacity-40">
              ↑ Gửi tiến độ lên Cloud
            </button>
          </div>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">{message}</div>
          <button onClick={() => { clearCloudIdentity(); setClassCode(""); setAccessCode(""); setMessage("Đã xóa mã Cloud trên thiết bị."); }}
            className="mt-4 text-xs font-black text-rose-600">Xóa liên kết Cloud trên thiết bị</button>
        </section>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/student" className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white">← Student Home</Link>
          <Link href="/" className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black">Thư viện</Link>
        </div>
      </div>
    </main>
  );
}
