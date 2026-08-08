"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getDemoStudentBrain } from "@/services/student/student-brain-service";
import { loadStudentBrainFromStorage } from "@/services/student/student-brain-storage";
import { buildDailyMission } from "@/services/pilot/daily-mission-engine";
import { getLocalDateKey, loadPilotActivity, markPilotActivity } from "@/services/pilot/pilot-experience-storage";
import { calculateLearningStreak } from "@/services/pilot/learning-streak";
import type { StudentBrainSnapshot } from "@/types/student";

export function StudentHome() {
  const [brain, setBrain] = useState<StudentBrainSnapshot>(getDemoStudentBrain());
  const [activity, setActivity] = useState<string[]>([]);
  useEffect(() => {
    const saved = loadStudentBrainFromStorage();
    if (saved) setBrain(saved);
    setActivity(loadPilotActivity());
  }, []);
  const mission = useMemo(() => buildDailyMission(brain), [brain]);
  const streak = useMemo(() => calculateLearningStreak(activity), [activity]);
  const completedToday = activity.includes(getLocalDateKey());

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-5 text-slate-950 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-cyan-200">Beta 2.5 · Pilot Student Experience</p>
              <h1 className="mt-3 text-4xl font-black sm:text-5xl">Hôm nay em nên học gì?</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                AI dùng Student Brain để chọn một nhiệm vụ vừa sức, ngắn gọn và có mục tiêu rõ ràng.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <MiniStat label="Streak" value={`${streak.currentStreak} ngày`} />
              <MiniStat label="Đã học" value={`${streak.activeDays} ngày`} />
            </div>
          </div>
        </header>

        <section className="mt-5 rounded-[2rem] border border-indigo-100 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.12em] text-indigo-600">Daily Mission · {mission.totalMinutes} phút</p>
              <h2 className="mt-2 text-2xl font-black">{mission.focusSkill}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{mission.readinessMessage}</p>
            </div>
            <span className={`rounded-full px-4 py-2 text-xs font-black ${completedToday ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
              {completedToday ? "✓ Đã ghi nhận hôm nay" : "Đang chờ hoàn thành"}
            </span>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {mission.items.map((item, index) => (
              <Link key={item.id} href={item.href} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 hover:bg-white hover:shadow-md">
                <p className="text-xs font-black uppercase tracking-[0.1em] text-slate-400">Bước {index + 1} · {item.estimatedMinutes} phút</p>
                <h3 className="mt-2 font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                <p className="mt-3 text-xs font-bold text-indigo-600">{item.reason}</p>
              </Link>
            ))}
          </div>

          <button type="button" onClick={() => setActivity(markPilotActivity())} className="mt-5 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white">
            ✓ Ghi nhận hoàn thành phiên hôm nay
          </button>
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <QuickLink href="/" title="Thư viện bài học" text="Học theo chương và bài." />
          <QuickLink href="/mastery" title="AI Revision Coach" text="Xem kỹ năng yếu và readiness." />
          <QuickLink href="/pilot-feedback" title="Phản hồi Pilot" text="Cho biết điều gì dễ hiểu hoặc cần cải thiện." />
        </div>

        <section className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.1em] text-emerald-600">End-of-session</p>
              <h2 className="mt-2 text-xl font-black">Em cảm thấy thế nào sau phiên học?</h2>
            </div>
            <Link href="/reflection" className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white">Ghi phản hồi nhanh →</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
function MiniStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-white/10 px-4 py-3 text-center"><div className="text-xl font-black">{value}</div><div className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-300">{label}</div></div>;
}
function QuickLink({ href, title, text }: { href: string; title: string; text: string }) {
  return <Link href={href} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></Link>;
}
