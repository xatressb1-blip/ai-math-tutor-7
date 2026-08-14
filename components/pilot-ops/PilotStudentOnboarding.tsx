"use client";

import { useState } from "react";
import Link from "next/link";
import {
  pullCloudStudent,
  saveCloudIdentity,
  saveLastCloudSync,
} from "@/services/cloud/cloud-sync-client";
import { saveStudentBrainToStorage } from "@/services/student/student-brain-storage";
import {
  loadMultiStudentWorkspace,
  saveMultiStudentWorkspace,
  setActivePilotStudent,
  upsertStudentBrain,
} from "@/services/multi-student/multi-student-storage";

export function PilotStudentOnboarding() {
  const [classCode, setClassCode] = useState("7A-PILOT");
  const [accessCode, setAccessCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [message, setMessage] = useState(
    "Nhập Mã lớp và Mã HS do giáo viên cung cấp.",
  );

  async function start() {
    setBusy(true);
    try {
      const identity = {
        classCode: classCode.trim().toUpperCase(),
        accessCode: accessCode.trim().toUpperCase(),
      };
      const receipt = await pullCloudStudent(identity);
      const remote = receipt.student;

      saveCloudIdentity(identity);
      saveLastCloudSync(receipt.serverUpdatedAt);
      saveStudentBrainToStorage(remote.brain);

      let workspace = loadMultiStudentWorkspace();
      workspace = upsertStudentBrain(workspace, remote.brain);
      if (!workspace.students.some((item) => item.profile.id === remote.brain.profile.id)) {
        workspace = {
          ...workspace,
          students: [
            ...workspace.students,
            {
              profile: remote.brain.profile,
              status: "ACTIVE",
              joinedAt: remote.brain.profile.createdAt,
              lastActiveAt: new Date().toISOString(),
            },
          ],
        };
      }
      workspace = setActivePilotStudent(workspace, remote.brain.profile.id);
      saveMultiStudentWorkspace(workspace);

      setStudentName(remote.displayName);
      setMessage(
        `✓ Xin chào ${remote.displayName}. Hồ sơ đã được tải từ Cloud. Em có thể bắt đầu học.`,
      );
    } catch (error) {
      setStudentName("");
      setMessage(
        error instanceof Error ? error.message : "Không thể mở hồ sơ học sinh.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-5 text-slate-950 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-2xl">
        <header className="rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-cyan-200">
            AI Math Tutor 7 · Bắt đầu học
          </p>
          <h1 className="mt-3 text-4xl font-black">Bắt đầu trong 1 phút</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Em chỉ cần mã lớp và mã học sinh. Hệ thống sẽ tải đúng hồ sơ học tập AI trước
            khi em học.
          </p>
        </header>

        <section className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-3 rounded-2xl bg-indigo-50 p-4 text-sm leading-6 text-indigo-950">
            <p><b>1.</b> Nhập Mã lớp.</p>
            <p><b>2.</b> Nhập Mã HS.</p>
            <p><b>3.</b> Bấm “Mở hồ sơ của em”.</p>
          </div>

          <label className="mt-5 block text-sm font-black">Mã lớp</label>
          <input
            value={classCode}
            onChange={(e) => setClassCode(e.target.value.toUpperCase())}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 uppercase outline-none focus:border-indigo-500"
          />

          <label className="mt-5 block text-sm font-black">Mã HS</label>
          <input
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
            placeholder="Ví dụ: A7K9Q2PX"
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 uppercase outline-none focus:border-indigo-500"
          />

          <button
            type="button"
            onClick={start}
            disabled={busy || !classCode.trim() || !accessCode.trim()}
            className="mt-5 w-full rounded-2xl bg-indigo-600 px-5 py-4 text-sm font-black text-white disabled:opacity-40"
          >
            {busy ? "Đang tải hồ sơ…" : "Mở hồ sơ của em →"}
          </button>

          <div className={`mt-5 rounded-2xl p-4 text-sm font-bold ${
            studentName ? "bg-emerald-50 text-emerald-800" : "bg-slate-50 text-slate-700"
          }`}>
            {message}
          </div>

          {studentName && (
            <Link
              href="/student"
              className="mt-4 block rounded-2xl bg-emerald-600 px-5 py-4 text-center text-sm font-black text-white"
            >
              Vào Student Home của {studentName} →
            </Link>
          )}
        </section>
      </div>
    </main>
  );
}
