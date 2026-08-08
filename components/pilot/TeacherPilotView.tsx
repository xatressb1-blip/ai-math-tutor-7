"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getDemoStudentBrain } from "@/services/student/student-brain-service";
import { loadStudentBrainFromStorage } from "@/services/student/student-brain-storage";
import { loadPilotActivity, loadPilotFeedback, loadSessionReflections } from "@/services/pilot/pilot-experience-storage";
import { calculateLearningStreak } from "@/services/pilot/learning-streak";
import type { StudentBrainSnapshot } from "@/types/student";
import type { PilotFeedbackRecord, SessionReflection } from "@/types/pilot-experience";

export function TeacherPilotView() {
  const [brain, setBrain] = useState<StudentBrainSnapshot>(getDemoStudentBrain());
  const [activity, setActivity] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<PilotFeedbackRecord[]>([]);
  const [reflections, setReflections] = useState<SessionReflection[]>([]);
  useEffect(() => {
    const saved = loadStudentBrainFromStorage();
    if (saved) setBrain(saved);
    setActivity(loadPilotActivity());
    setFeedback(loadPilotFeedback());
    setReflections(loadSessionReflections());
  }, []);
  const streak = useMemo(() => calculateLearningStreak(activity), [activity]);
  const weakest = [...brain.skills].sort((a, b) => a.masteryScore - b.masteryScore).slice(0, 5);
  const unsureCount = reflections.filter((item) => item.feeling === "UNSURE").length;
  const hardCount = feedback.filter((item) => item.value === "HARD_TO_UNDERSTAND").length;
  const improveCount = feedback.filter((item) => item.value === "NEEDS_IMPROVEMENT").length;

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-xs font-black uppercase tracking-[0.12em] text-amber-200">Teacher Pilot View</p>
              <h1 className="mt-3 text-4xl font-black">Tín hiệu trải nghiệm học sinh</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">Bản Pilot localStorage: xem dữ liệu trên chính trình duyệt này.</p>
            </div>
            <Link href="/teacher" className="rounded-2xl bg-white px-4 py-2.5 text-sm font-black text-slate-950">Teacher Dashboard →</Link>
          </div>
        </header>
        <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Active days" value={streak.activeDays} />
          <Metric label="Current streak" value={`${streak.currentStreak} ngày`} />
          <Metric label="Reflections" value={reflections.length} />
          <Metric label="Pilot feedback" value={feedback.length} />
        </section>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6">
            <p className="text-xs font-black uppercase tracking-[0.1em] text-rose-600">Cần chú ý</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Signal label="Chưa chắc" value={unsureCount} /><Signal label="Khó hiểu" value={hardCount} /><Signal label="Cần cải thiện" value={improveCount} />
            </div>
            <h2 className="mt-6 text-xl font-black">Kỹ năng yếu hiện tại</h2>
            <div className="mt-3 space-y-2">
              {weakest.map((skill) => (
                <div key={skill.id} className="rounded-2xl bg-rose-50 p-4">
                  <div className="font-black text-rose-950">{skill.skillName}</div>
                  <div className="mt-1 text-xs font-bold text-rose-700">Mastery {skill.masteryScore}/100 · Confidence {skill.confidence}/100</div>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6">
            <p className="text-xs font-black uppercase tracking-[0.1em] text-sky-600">Phản hồi gần đây</p>
            <div className="mt-4 space-y-3">
              {[...feedback].reverse().slice(0, 6).map((item) => (
                <article key={item.id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs font-black text-sky-700">{labelFeedback(item.value)}</div>
                  <p className="mt-1 text-sm text-slate-700">{item.note || "Không có ghi chú."}</p>
                </article>
              ))}
              {feedback.length === 0 && <p className="text-sm text-slate-500">Chưa có phản hồi Pilot.</p>}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
function labelFeedback(value: PilotFeedbackRecord["value"]) {
  return { EASY_TO_UNDERSTAND: "Dễ hiểu", HARD_TO_UNDERSTAND: "Khó hiểu", AI_HELPFUL: "AI giúp ích", NEEDS_IMPROVEMENT: "Cần cải thiện" }[value];
}
function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="text-3xl font-black">{value}</div><div className="mt-1 text-xs font-black uppercase tracking-[0.08em] text-slate-500">{label}</div></div>;
}
function Signal({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl bg-rose-50 p-4 text-center"><div className="text-2xl font-black text-rose-950">{value}</div><div className="text-[10px] font-black uppercase tracking-[0.08em] text-rose-600">{label}</div></div>;
}
