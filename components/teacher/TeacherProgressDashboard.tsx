"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadMultiStudentWorkspace } from "@/services/multi-student/multi-student-storage";
import type { MultiStudentWorkspace } from "@/types/multi-student";

export function TeacherProgressDashboard() {
  const [workspace, setWorkspace] = useState<MultiStudentWorkspace | null>(null);
  const [studentId, setStudentId] = useState("");

  useEffect(() => {
    const next = loadMultiStudentWorkspace();
    setWorkspace(next);
    const requested = new URLSearchParams(window.location.search).get("student");
    setStudentId(requested && next.brains[requested] ? requested : next.students[0]?.profile.id ?? "");
  }, []);

  const brain = workspace?.brains[studentId] ?? null;
  const metrics = useMemo(() => {
    if (!brain) return { mastery: 0, accuracy: 0, minutes: 0, unresolved: 0 };
    const mastery = brain.skills.length ? Math.round(brain.skills.reduce((s, x) => s + x.masteryScore, 0) / brain.skills.length) : 0;
    const attempts = brain.sessions.reduce((s, x) => s + x.questionsAttempted, 0);
    const correct = brain.sessions.reduce((s, x) => s + x.questionsCorrect, 0);
    return {
      mastery,
      accuracy: attempts ? Math.round((correct / attempts) * 100) : 0,
      minutes: brain.sessions.reduce((s, x) => s + x.durationMinutes, 0),
      unresolved: brain.mistakes.filter((x) => !x.resolved).reduce((s, x) => s + x.count, 0),
    };
  }, [brain]);

  const weakSkills = useMemo(
    () => [...(brain?.skills ?? [])].sort((a, b) => a.masteryScore - b.masteryScore).slice(0, 5),
    [brain],
  );
  const mistakes = useMemo(
    () => [...(brain?.mistakes ?? [])].filter((x) => !x.resolved).sort((a, b) => b.count - a.count).slice(0, 5),
    [brain],
  );
  const sessions = useMemo(
    () => [...(brain?.sessions ?? [])].sort((a, b) => b.startedAt.localeCompare(a.startedAt)).slice(0, 8),
    [brain],
  );

  if (!workspace) return <main className="min-h-screen bg-[#f5f7fb] p-8 font-bold">Đang tải tiến độ…</main>;

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-emerald-200">KHU VỰC GIÁO VIÊN · BƯỚC 4</p>
          <h1 className="mt-3 text-4xl font-black">Kiểm tra tiến bộ học sinh</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">Chọn một học sinh để xem kết quả thực tế sau các phiên học: mức thành thạo, độ chính xác, kỹ năng cần củng cố và lỗi đang lặp lại.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/teacher" className="rounded-2xl bg-white px-4 py-2.5 text-sm font-black text-slate-950">← Bảng điều khiển</Link>
            <Link href="/pilot-roster" className="rounded-2xl border border-white/20 px-4 py-2.5 text-sm font-black">Quản lý học sinh</Link>
          </div>
        </header>

        <section className="mt-5 rounded-[2rem] border border-indigo-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.1em] text-indigo-600">BẠN LÀM GÌ Ở TRANG NÀY?</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">① Chọn học sinh → ② Xem 4 chỉ số chính → ③ Xem kỹ năng yếu và lỗi lặp lại → ④ Dựa vào đó chọn hoạt động phù hợp cho lần học tiếp theo.</p>
          <label className="mt-5 block text-sm font-black">Chọn học sinh</label>
          <select value={studentId} onChange={(e) => setStudentId(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none sm:max-w-md">
            {workspace.students.map((item) => <option key={item.profile.id} value={item.profile.id}>{item.profile.displayName} · {item.profile.className}</option>)}
          </select>
        </section>

        {!brain ? (
          <section className="mt-5 rounded-[2rem] bg-white p-8 text-center text-slate-500">Chưa có học sinh để xem tiến độ.</section>
        ) : (
          <>
            <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Metric label="Mức thành thạo" value={`${metrics.mastery}/100`} />
              <Metric label="Độ chính xác" value={`${metrics.accuracy}%`} />
              <Metric label="Thời gian học" value={`${metrics.minutes} phút`} />
              <Metric label="Lỗi cần khắc phục" value={metrics.unresolved} danger={metrics.unresolved > 0} />
            </section>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.1em] text-indigo-600">KỸ NĂNG CẦN CỦNG CỐ</p>
                <h2 className="mt-2 text-2xl font-black">Em đang yếu ở đâu?</h2>
                <div className="mt-5 space-y-3">
                  {weakSkills.length ? weakSkills.map((skill) => (
                    <div key={skill.id} className="rounded-2xl bg-slate-50 p-4">
                      <div className="flex justify-between gap-3"><b>{skill.skillName}</b><b>{skill.masteryScore}/100</b></div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-slate-950" style={{ width: `${skill.masteryScore}%` }} /></div>
                    </div>
                  )) : <p className="text-sm text-slate-500">Chưa có đủ dữ liệu kỹ năng.</p>}
                </div>
                <Link href="/library" className="mt-5 inline-flex rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-black text-white">Mở thư viện để chọn hoạt động →</Link>
              </section>

              <section className="rounded-[2rem] border border-rose-100 bg-rose-50 p-6 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.1em] text-rose-600">LỖI CẦN KHẮC PHỤC</p>
                <h2 className="mt-2 text-2xl font-black">Lỗi nào đang lặp lại?</h2>
                <div className="mt-5 space-y-3">
                  {mistakes.length ? mistakes.map((item) => <div key={item.id} className="rounded-2xl bg-white/80 p-4 text-sm font-bold"><div className="flex justify-between gap-3"><span>{item.description}</span><span className="text-rose-700">{item.count} lần</span></div></div>) : <p className="text-sm text-rose-800">Không có lỗi chưa xử lý được ghi nhận.</p>}
                </div>
              </section>
            </div>

            <section className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.1em] text-emerald-600">LỊCH SỬ HỌC GẦN ĐÂY</p>
              <h2 className="mt-2 text-2xl font-black">Học sinh đã làm gì?</h2>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">Thời gian</th><th>Hoạt động</th><th>Số câu</th><th>Đúng</th><th>Thời lượng</th></tr></thead><tbody>{sessions.map((session) => <tr key={session.id} className="border-t border-slate-100"><td className="p-3">{new Date(session.startedAt).toLocaleString("vi-VN")}</td><td>{sourceLabel(session.source)}</td><td>{session.questionsAttempted}</td><td>{session.questionsCorrect}</td><td>{session.durationMinutes} phút</td></tr>)}</tbody></table>
              </div>
              {!sessions.length && <p className="mt-4 text-sm text-slate-500">Chưa có phiên học nào.</p>}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function sourceLabel(source?: string) {
  if (source === "LESSON") return "Bài học";
  if (source === "ADAPTIVE") return "Luyện tập thích ứng";
  if (source === "REASONING") return "Luyện suy luận";
  if (source === "DIAGNOSTIC") return "Đánh giá đầu vào";
  if (source === "MOCK_TEST") return "Bài kiểm tra thử";
  return "Hoạt động học";
}

function Metric({ label, value, danger = false }: { label: string; value: string | number; danger?: boolean }) {
  return <div className={`rounded-2xl border p-5 shadow-sm ${danger ? "border-rose-100 bg-rose-50" : "border-slate-200 bg-white"}`}><div className="text-3xl font-black">{value}</div><div className="mt-1 text-xs font-black uppercase tracking-[0.08em] text-slate-500">{label}</div></div>;
}
