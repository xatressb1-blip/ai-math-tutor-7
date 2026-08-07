"use client";

import { useState } from "react";

const STORAGE_KEY = "math-mentor-ai:demo-feedback:v1";

type Clarity = "EASY" | "OK" | "HARD";
type ContinueIntent = "YES" | "MAYBE" | "NO";

export function DemoFeedbackCard() {
  const [clarity, setClarity] = useState<Clarity | null>(null);
  const [continueIntent, setContinueIntent] = useState<ContinueIntent | null>(null);
  const [saved, setSaved] = useState(false);

  function saveFeedback() {
    if (!clarity || !continueIntent) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ clarity, continueIntent, savedAt: new Date().toISOString() }),
    );
    setSaved(true);
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-black uppercase tracking-[0.15em] text-indigo-600">
        Phản hồi Demo · 20 giây
      </p>
      <h3 className="mt-2 text-xl font-black">Em thấy buổi học hôm nay thế nào?</h3>

      <p className="mt-5 text-sm font-bold text-slate-700">1. Cách giải thích có dễ hiểu không?</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <ChoiceButton active={clarity === "EASY"} onClick={() => setClarity("EASY")}>
          😊 Dễ hiểu
        </ChoiceButton>
        <ChoiceButton active={clarity === "OK"} onClick={() => setClarity("OK")}>
          🙂 Bình thường
        </ChoiceButton>
        <ChoiceButton active={clarity === "HARD"} onClick={() => setClarity("HARD")}>
          😕 Hơi khó
        </ChoiceButton>
      </div>

      <p className="mt-5 text-sm font-bold text-slate-700">2. Em có muốn học tiếp Bài 2 không?</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <ChoiceButton active={continueIntent === "YES"} onClick={() => setContinueIntent("YES")}>
          🚀 Có
        </ChoiceButton>
        <ChoiceButton active={continueIntent === "MAYBE"} onClick={() => setContinueIntent("MAYBE")}>
          🤔 Chưa chắc
        </ChoiceButton>
        <ChoiceButton active={continueIntent === "NO"} onClick={() => setContinueIntent("NO")}>
          ⏸ Chưa muốn
        </ChoiceButton>
      </div>

      <button
        type="button"
        onClick={saveFeedback}
        disabled={!clarity || !continueIntent || saved}
        className="mt-5 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {saved ? "✓ Đã lưu phản hồi" : "Gửi phản hồi"}
      </button>
    </section>
  );
}

function ChoiceButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-2.5 text-sm font-bold transition ${
        active
          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
      }`}
    >
      {children}
    </button>
  );
}
