"use client";

import { useState } from "react";
import Link from "next/link";
import { saveSessionReflection } from "@/services/pilot/pilot-experience-storage";
import type { ReflectionFeeling } from "@/types/pilot-experience";

const feelings: Array<{ value: ReflectionFeeling; label: string; text: string }> = [
  { value: "CONFIDENT", label: "😄 Em khá chắc", text: "Em có thể tự giải thích lại." },
  { value: "OK", label: "🙂 Em hiểu phần lớn", text: "Em vẫn muốn luyện thêm một chút." },
  { value: "UNSURE", label: "🤔 Em chưa chắc", text: "Em cần được giải thích hoặc học lại." },
];

export function SessionReflectionPanel() {
  const [feeling, setFeeling] = useState<ReflectionFeeling | null>(null);
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  function submit() {
    if (!feeling) return;
    saveSessionReflection({ feeling, note: note.trim() });
    setDone(true);
  }
  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-emerald-600">End-of-session Reflection</p>
          <h1 className="mt-3 text-3xl font-black">Em tự đánh giá mức hiểu của mình</h1>
          {done ? (
            <div className="mt-6 rounded-2xl bg-emerald-50 p-6">
              <h2 className="text-xl font-black text-emerald-950">Đã ghi nhận ✓</h2>
              <p className="mt-2 text-sm text-emerald-900">Phản hồi giúp Pilot so sánh cảm nhận của em với kết quả học thực tế.</p>
              <Link href="/student" className="mt-5 inline-flex rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white">Về Student Home</Link>
            </div>
          ) : (
            <>
              <div className="mt-6 space-y-3">
                {feelings.map((item) => (
                  <button key={item.value} type="button" onClick={() => setFeeling(item.value)}
                    className={`w-full rounded-2xl border p-5 text-left ${feeling === item.value ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}>
                    <div className="font-black">{item.label}</div><div className="mt-1 text-sm text-slate-600">{item.text}</div>
                  </button>
                ))}
              </div>
              <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3}
                className="mt-5 w-full rounded-2xl border border-slate-300 p-4 text-sm outline-none focus:border-emerald-500"
                placeholder="Điều em còn băn khoăn..." />
              <button type="button" disabled={!feeling} onClick={submit}
                className="mt-5 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-black text-white disabled:opacity-40">Lưu phản hồi cuối phiên</button>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
