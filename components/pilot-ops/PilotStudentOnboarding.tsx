"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  listAvailableStudentClasses,
  pullCloudStudent,
  saveCloudIdentity,
  saveLastCloudSync,
} from "@/services/cloud/cloud-sync-client";
import {
  loadMultiStudentWorkspace,
  saveMultiStudentWorkspace,
  setActivePilotStudent,
  upsertStudentBrain,
} from "@/services/multi-student/multi-student-storage";
import { loadTeacherClassRegistry } from "@/services/teacher/teacher-class-storage";
import { saveStudentBrainToStorage } from "@/services/student/student-brain-storage";

const LAST_CLASS_KEY = "math-mentor-ai:last-class-code:v1";

function normalizeClass(value: string) {
  return value.trim().toUpperCase();
}

export function PilotStudentOnboarding() {
  const [classCode, setClassCode] = useState("");
  const [classes, setClasses] = useState<string[]>([]);
  const [accessCode, setAccessCode] = useState("");
  const [studentName, setStudentName] = useState("");
  const [message, setMessage] = useState("Chọn lớp và nhập mã học sinh do giáo viên cung cấp.");
  const [busy, setBusy] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadClasses() {
      const params = new URLSearchParams(window.location.search);
      const fromLink = normalizeClass(params.get("class") || "");
      const remembered = normalizeClass(window.localStorage.getItem(LAST_CLASS_KEY) || "");
      const local = loadTeacherClassRegistry().map((item) => normalizeClass(item.classCode));
      let remote: string[] = [];
      try {
        remote = (await listAvailableStudentClasses()).map(normalizeClass);
      } catch {
        // Local list is still useful when teacher and student test on the same device.
      }
      if (cancelled) return;
      const merged = [...new Set([...local, ...remote, fromLink, remembered].filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, "vi"));
      setClasses(merged);
      const initial = fromLink || remembered || merged[0] || "";
      setClassCode(initial);
      if (initial) window.localStorage.setItem(LAST_CLASS_KEY, initial);
      setLoadingClasses(false);
    }
    loadClasses();
    return () => { cancelled = true; };
  }, []);

  const canStart = useMemo(
    () => Boolean(classCode) && /^HS[0-9]$/.test(accessCode.trim().toUpperCase()),
    [classCode, accessCode],
  );

  async function start() {
    if (!canStart) return;
    setBusy(true);
    try {
      const identity = {
        classCode: normalizeClass(classCode),
        accessCode: accessCode.trim().toUpperCase(),
      };
      const receipt = await pullCloudStudent(identity);
      const remote = receipt.student;
      saveCloudIdentity(identity);
      saveLastCloudSync(receipt.serverUpdatedAt);
      saveStudentBrainToStorage(remote.brain);
      window.localStorage.setItem(LAST_CLASS_KEY, identity.classCode);

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
              classCode: identity.classCode,
              accessCode: identity.accessCode,
              cloudEnabled: true,
            },
          ],
        };
      }
      workspace = setActivePilotStudent(workspace, remote.brain.profile.id);
      saveMultiStudentWorkspace(workspace);

      setStudentName(remote.displayName);
      setMessage(`✓ Xin chào ${remote.displayName}. Em đã vào đúng lớp ${identity.classCode}.`);
    } catch (error) {
      setStudentName("");
      setMessage(error instanceof Error ? error.message : "Không thể mở hồ sơ học sinh.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-5 text-slate-950 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-2xl">
        <header className="rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-cyan-200">AI MATH TUTOR 7 · BẮT ĐẦU HỌC</p>
          <h1 className="mt-3 text-4xl font-black">Chọn lớp, nhập mã và vào học</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Em chỉ cần chọn đúng lớp đang học và nhập mã HS0–HS9 do giáo viên cấp.
          </p>
        </header>

        <section className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="rounded-2xl bg-indigo-50 p-4 text-sm leading-6 text-indigo-950">
            <b>1.</b> Chọn lớp. &nbsp; <b>2.</b> Nhập mã học sinh. &nbsp; <b>3.</b> Bấm “Vào học”.
          </div>

          <label className="mt-5 block text-sm font-black">Lớp của em</label>
          <select
            value={classCode}
            onChange={(e) => {
              const value = normalizeClass(e.target.value);
              setClassCode(value);
              if (value) window.localStorage.setItem(LAST_CLASS_KEY, value);
            }}
            disabled={loadingClasses}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 font-bold outline-none focus:border-indigo-500 disabled:opacity-50"
          >
            <option value="">{loadingClasses ? "Đang tải danh sách lớp…" : "Chọn lớp"}</option>
            {classes.map((item) => <option key={item} value={item}>Lớp {item}</option>)}
          </select>
          {!loadingClasses && classes.length === 0 && (
            <p className="mt-2 text-xs font-bold text-amber-700">Chưa có lớp nào sẵn sàng đăng nhập. Hãy liên hệ giáo viên.</p>
          )}

          <label className="mt-5 block text-sm font-black">Mã học sinh</label>
          <input
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3))}
            placeholder="Ví dụ: HS3"
            maxLength={3}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-xl font-black uppercase tracking-[0.25em] outline-none focus:border-indigo-500"
          />

          <button
            type="button"
            onClick={start}
            disabled={busy || !canStart}
            className="mt-5 w-full rounded-2xl bg-indigo-600 px-5 py-4 text-sm font-black text-white disabled:opacity-40"
          >
            {busy ? "Đang mở hồ sơ…" : "Vào học →"}
          </button>

          <div className={`mt-5 rounded-2xl p-4 text-sm font-bold ${studentName ? "bg-emerald-50 text-emerald-800" : "bg-slate-50 text-slate-700"}`}>
            {message}
          </div>

          {studentName && (
            <Link href="/student" className="mt-4 block rounded-2xl bg-emerald-600 px-5 py-4 text-center text-sm font-black text-white">
              Tiếp tục vào trang học →
            </Link>
          )}
        </section>
      </div>
    </main>
  );
}
