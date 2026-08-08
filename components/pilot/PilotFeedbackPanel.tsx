"use client";

import { useState } from "react";
import Link from "next/link";
import { savePilotFeedback } from "@/services/pilot/pilot-experience-storage";
import type { PilotFeedbackValue } from "@/types/pilot-experience";

const options: Array<{ value: PilotFeedbackValue; label: string; detail: string }> = [
  { value: "EASY_TO_UNDERSTAND", label: "🙂 Dễ hiểu", detail: "Nội dung và cách giải thích rõ ràng." },
  { value: "HARD_TO_UNDERSTAND", label: "🤔 Khó hiểu", detail: "Có phần em chưa theo kịp." },
  { value: "AI_HELPFUL", label: "✨ AI giúp ích", detail: "Gợi ý hoặc giải thích của AI hữu ích." },
  { value: "NEEDS_IMPROVEMENT", label: "🛠️ Cần cải thiện", detail: "Có điểm em muốn hệ thống làm tốt hơn." },
];

export function PilotFeedbackPanel() {
  const [selected, setSelected] = useState<PilotFeedbackValue | null>(null);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  function submit() {
    if (!selected) return;
    savePilotFeedback({ value: selected, note: note.trim() });
    setSaved(true);
  }
  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-sky-600">Pilot Feedback</p>
          <h1 className="mt-3 text-3xl font-black">Trải nghiệm hôm nay thế nào?</h1>
          {saved ? (
            <div className="mt-6 rounded-2xl bg-emerald-50 p-6 text-emerald-950">
              <h2 className="text-xl font-black">Cảm ơn em! ✓</h2>
              <p className="mt-2 text-sm">Phản hồi đã được lưu trên thiết bị Pilot này.</p>
              <Link href="/student" className="mt-5 inline-flex rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white">Về Student Home</Link>
            </div>
          ) : (
            <>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {options.map((option) => (
                  <button key={option.value} type="button" onClick={() => setSelected(option.value)}
                    className={`rounded-2xl border p-5 text-left ${selected === option.value ? "border-sky-500 bg-sky-50" : "border-slate-200 bg-slate-50"}`}>
                    <div className="font-black">{option.label}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-600">{option.detail}</div>
                  </button>
                ))}
              </div>
              <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4}
                className="mt-5 w-full rounded-2xl border border-slate-300 p-4 text-sm outline-none focus:border-sky-500"
                placeholder="Ví dụ: Em muốn hình minh họa lớn hơn..." />
              <button type="button" disabled={!selected} onClick={submit}
                className="mt-5 rounded-2xl bg-sky-600 px-6 py-3 text-sm font-black text-white disabled:opacity-40">Gửi phản hồi</button>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
