"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CloudRequestError,
  clearCloudIdentity,
  loadCloudIdentity,
  pullCloudStudent,
  pushCloudStudent,
  saveCloudIdentity,
  saveLastCloudSync,
  loadLastCloudSync,
} from "@/services/cloud/cloud-sync-client";
import {
  loadStudentBrainFromStorage,
  saveStudentBrainToStorage,
} from "@/services/student/student-brain-storage";
import {
  loadMultiStudentWorkspace,
  saveMultiStudentWorkspace,
  setActivePilotStudent,
  upsertStudentBrain,
} from "@/services/multi-student/multi-student-storage";

export function StudentCloudSync() {
  const existing =
    typeof window === "undefined" ? null : loadCloudIdentity();

  const [classCode, setClassCode] = useState(existing?.classCode ?? "");
  const [accessCode, setAccessCode] = useState(existing?.accessCode ?? "");
  const [message, setMessage] = useState("Chưa đồng bộ.");
  const [busy, setBusy] = useState(false);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(
    typeof window === "undefined" ? null : loadLastCloudSync(),
  );

  useEffect(() => {
    fetch("/api/pilot-cloud")
      .then((response) => response.json())
      .then((data) => setConfigured(Boolean(data.configured && data.schemaReady)))
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
      const receipt = await pullCloudStudent(id);
      const remote = receipt.student;

      saveCloudIdentity(id);
      saveStudentBrainToStorage(remote.brain);

      let workspace = loadMultiStudentWorkspace();
      workspace = upsertStudentBrain(workspace, remote.brain);

      if (
        !workspace.students.some(
          (item) => item.profile.id === remote.brain.profile.id,
        )
      ) {
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

      workspace = setActivePilotStudent(
        workspace,
        remote.brain.profile.id,
      );
      saveMultiStudentWorkspace(workspace);

      saveLastCloudSync(receipt.serverUpdatedAt);
      setLastSync(receipt.serverUpdatedAt);
      setMessage(
        `✓ Đã tải Hồ sơ học tập AI của ${remote.displayName} từ Cloud. Thiết bị hiện an toàn để Push tiến độ.`,
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Không thể tải dữ liệu trực tuyến.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function push() {
    setBusy(true);
    try {
      const brain = loadStudentBrainFromStorage();
      if (!brain) {
        throw new Error("Thiết bị chưa có Hồ sơ học tập AI để gửi.");
      }
      if (!lastSync) {
        throw new Error(
          "Để tránh ghi đè dữ liệu, hãy tải hồ sơ từ hệ thống trực tuyến trước khi gửi tiến độ lần đầu trên thiết bị này.",
        );
      }

      const id = identity();
      const receipt = await pushCloudStudent(
        id,
        brain,
        lastSync,
      );

      saveCloudIdentity(id);
      saveLastCloudSync(receipt.serverUpdatedAt);
      setLastSync(receipt.serverUpdatedAt);
      setMessage(
        `✓ Đã gửi tiến độ của ${receipt.student.displayName} lên Cloud. Không phát hiện xung đột dữ liệu.`,
      );
    } catch (error) {
      if (
        error instanceof CloudRequestError &&
        error.code === "CLOUD_CONFLICT"
      ) {
        setMessage(
          "⚠ Dữ liệu trực tuyến mới hơn dữ liệu trên thiết bị. Hãy tải hồ sơ mới nhất trước rồi tiếp tục học.",
        );
      } else if (
        error instanceof CloudRequestError &&
        error.code === "PULL_REQUIRED"
      ) {
        setMessage(
          "⚠ Hệ thống yêu cầu tải hồ sơ mới nhất trước khi gửi tiến độ.",
        );
      } else {
        setMessage(
          error instanceof Error
            ? error.message
            : "Không thể gửi dữ liệu trực tuyến.",
        );
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-cyan-200">
            Beta 2.7.0 · Safe Đồng bộ dữ liệu
          </p>
          <h1 className="mt-3 text-4xl font-black">Đồng bộ dữ liệu học sinh</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Pull trước, học sau, Push cuối phiên. Hệ thống chặn ghi đè nếu Cloud
            đã có dữ liệu mới hơn từ thiết bị khác.
          </p>
        </header>

        <section className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div
            className={`rounded-2xl p-4 text-sm font-bold ${
              configured
                ? "bg-emerald-50 text-emerald-800"
                : "bg-amber-50 text-amber-800"
            }`}
          >
            {configured === null
              ? "Đang kiểm tra kết nối…"
              : configured
                ? "✓ Kết nối và cấu trúc dữ liệu đã sẵn sàng."
                : "Kết nối trực tuyến chưa sẵn sàng. Chế độ trên thiết bị vẫn hoạt động."}
          </div>

          <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-sm leading-6 text-indigo-950">
            <b>Quy trình an toàn:</b> ① Tải hồ sơ từ Cloud → ② Học bình thường →
            ③ Gửi tiến độ lên Cloud.
          </div>

          <label className="mt-5 block text-sm font-black">Mã lớp</label>
          <input
            value={classCode}
            onChange={(e) => setClassCode(e.target.value.toUpperCase())}
            placeholder="Ví dụ: 7A-PILOT"
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 uppercase outline-none focus:border-indigo-500"
          />

          <label className="mt-5 block text-sm font-black">Mã học sinh</label>
          <input
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
            placeholder="Ví dụ: H7K2Q9"
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 uppercase outline-none focus:border-indigo-500"
          />

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              disabled={
                busy ||
                !configured ||
                !classCode.trim() ||
                !accessCode.trim()
              }
              onClick={pull}
              className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white disabled:opacity-40"
            >
              ↓ 1. Tải hồ sơ từ Cloud
            </button>
            <button
              disabled={
                busy ||
                !configured ||
                !lastSync ||
                !classCode.trim() ||
                !accessCode.trim()
              }
              onClick={push}
              className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white disabled:opacity-40"
            >
              ↑ 2. Gửi tiến độ an toàn
            </button>
          </div>

          {!lastSync && (
            <p className="mt-3 text-xs font-bold text-amber-700">
              Push đang khóa cho đến khi thiết bị Pull thành công ít nhất một lần.
            </p>
          )}

          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">
            {message}
          </div>

          <div className="mt-3 text-xs font-bold text-slate-400">
            Mốc Cloud gần nhất:{" "}
            {lastSync
              ? new Date(lastSync).toLocaleString("vi-VN")
              : "Chưa có"}
          </div>

          <button
            onClick={() => {
              clearCloudIdentity();
              setClassCode("");
              setAccessCode("");
              setLastSync(null);
              setMessage("Đã xóa mã đồng bộ trên thiết bị.");
            }}
            className="mt-4 text-xs font-black text-rose-600"
          >
            Xóa liên kết Cloud trên thiết bị
          </button>
        </section>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/student"
            className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white"
          >
            ← Student Home
          </Link>
          <Link
            href="/"
            className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black"
          >
            Thư viện
          </Link>
        </div>
      </div>
    </main>
  );
}
