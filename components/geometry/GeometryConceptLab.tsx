"use client";

import { useState } from "react";
import Link from "next/link";

type Mode = "VERTICAL" | "BISECTOR" | "PARALLEL" | "EUCLID";

const modes: Array<{ id: Mode; label: string; lesson: string }> = [
  { id: "VERTICAL", label: "Góc đối đỉnh", lesson: "Bài 8" },
  { id: "BISECTOR", label: "Tia phân giác", lesson: "Bài 8" },
  { id: "PARALLEL", label: "Góc với hai đường song song", lesson: "Bài 9–10" },
  { id: "EUCLID", label: "Tiên đề Euclid", lesson: "Bài 10" },
];

export function GeometryConceptLab() {
  const [mode, setMode] = useState<Mode>("VERTICAL");
  const [angle, setAngle] = useState(60);

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-indigo-200">
                Beta 2.3.3 · Visual Geometry
              </p>
              <h1 className="mt-3 text-4xl font-black">Geometry Concept Lab</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Quan sát trực quan các quan hệ góc và đường thẳng trong Chương III.
                Hình minh họa dùng để khám phá; kết luận vẫn phải dựa vào định nghĩa
                và tính chất.
              </p>
            </div>
            <Link href="/" className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950">
              ← Thư viện
            </Link>
          </div>
        </header>

        <div className="mt-5 grid gap-5 lg:grid-cols-[0.42fr_1fr]">
          <aside className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Khái niệm</p>
            <div className="mt-4 space-y-2">
              {modes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMode(item.id)}
                  className={`w-full rounded-2xl p-4 text-left ${
                    mode === item.id ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-800"
                  }`}
                >
                  <p className="text-xs font-black uppercase tracking-[0.08em] opacity-70">{item.lesson}</p>
                  <p className="mt-1 font-black">{item.label}</p>
                </button>
              ))}
            </div>

            {(mode === "VERTICAL" || mode === "BISECTOR") && (
              <div className="mt-6">
                <label className="text-xs font-black uppercase tracking-[0.1em] text-slate-500">
                  Góc mẫu: {angle}°
                </label>
                <input
                  type="range"
                  min="20"
                  max="160"
                  value={angle}
                  onChange={(event) => setAngle(Number(event.target.value))}
                  className="mt-3 w-full"
                />
              </div>
            )}
          </aside>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="rounded-[1.75rem] bg-slate-50 p-3 sm:p-6">
              <GeometrySvg mode={mode} angle={angle} />
            </div>
            <ConceptExplanation mode={mode} angle={angle} />
          </section>
        </div>
      </div>
    </main>
  );
}

function GeometrySvg({ mode, angle }: { mode: Mode; angle: number }) {
  if (mode === "PARALLEL") {
    return (
      <svg viewBox="0 0 700 380" className="w-full">
        <line x1="80" y1="110" x2="620" y2="110" stroke="currentColor" strokeWidth="4" />
        <line x1="80" y1="270" x2="620" y2="270" stroke="currentColor" strokeWidth="4" />
        <line x1="230" y1="40" x2="470" y2="340" stroke="currentColor" strokeWidth="4" />
        <text x="92" y="92" fontSize="24">a</text>
        <text x="92" y="252" fontSize="24">b</text>
        <text x="462" y="62" fontSize="24">c</text>
        <text x="305" y="96" fontSize="22">1</text>
        <text x="417" y="257" fontSize="22">2</text>
        <text x="245" y="150" fontSize="18">so le trong</text>
        <text x="420" y="95" fontSize="18">đồng vị</text>
      </svg>
    );
  }

  if (mode === "EUCLID") {
    return (
      <svg viewBox="0 0 700 380" className="w-full">
        <line x1="80" y1="260" x2="620" y2="260" stroke="currentColor" strokeWidth="4" />
        <circle cx="350" cy="100" r="7" fill="currentColor" />
        <text x="367" y="105" fontSize="22">M</text>
        <text x="95" y="245" fontSize="22">a</text>
        <line x1="90" y1="100" x2="610" y2="100" stroke="currentColor" strokeWidth="4" strokeDasharray="10 8" />
        <text x="110" y="84" fontSize="18">đường duy nhất qua M song song với a</text>
      </svg>
    );
  }

  if (mode === "BISECTOR") {
    const rad = (angle * Math.PI) / 180;
    const half = rad / 2;
    const cx = 180, cy = 300, len = 380;
    const x1 = cx + len;
    const y1 = cy;
    const x2 = cx + len * Math.cos(rad);
    const y2 = cy - len * Math.sin(rad);
    const xm = cx + len * Math.cos(half);
    const ym = cy - len * Math.sin(half);
    return (
      <svg viewBox="0 0 700 380" className="w-full">
        <line x1={cx} y1={cy} x2={x1} y2={y1} stroke="currentColor" strokeWidth="4" />
        <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="currentColor" strokeWidth="4" />
        <line x1={cx} y1={cy} x2={xm} y2={ym} stroke="currentColor" strokeWidth="4" strokeDasharray="10 7" />
        <circle cx={cx} cy={cy} r="6" fill="currentColor" />
        <text x={cx-25} y={cy+28} fontSize="22">O</text>
        <text x={xm+8} y={ym} fontSize="22">m</text>
        <text x={cx+110} y={cy-18} fontSize="20">{Math.round(angle/2)}°</text>
        <text x={cx+80} y={cy-90} fontSize="20">{Math.round(angle/2)}°</text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 700 380" className="w-full">
      <line x1="100" y1="70" x2="600" y2="310" stroke="currentColor" strokeWidth="4" />
      <line x1="120" y1="320" x2="580" y2="60" stroke="currentColor" strokeWidth="4" />
      <circle cx="350" cy="190" r="6" fill="currentColor" />
      <text x="365" y="185" fontSize="22">O</text>
      <text x="390" y="145" fontSize="22">{angle}°</text>
      <text x="245" y="245" fontSize="22">{angle}°</text>
      <text x="190" y="130" fontSize="18">đối đỉnh</text>
    </svg>
  );
}

function ConceptExplanation({ mode, angle }: { mode: Mode; angle: number }) {
  const content: Record<Mode, { title: string; text: string }> = {
    VERTICAL: {
      title: "Hai góc đối đỉnh thì bằng nhau",
      text: `Nếu một góc có số đo ${angle}° thì góc đối đỉnh với nó cũng có số đo ${angle}°. Điều quan trọng là mỗi cạnh của góc này phải là tia đối của một cạnh của góc kia.`,
    },
    BISECTOR: {
      title: "Tia phân giác chia góc thành hai phần bằng nhau",
      text: `Với góc mẫu ${angle}°, tia phân giác tạo hai góc bằng nhau, mỗi góc ${Math.round(angle / 2)}°.`,
    },
    PARALLEL: {
      title: "Đúng vị trí góc trước khi dùng tính chất",
      text: "Khi một đường cắt hai đường, cần nhận đúng cặp góc so le trong hoặc đồng vị. Đây là cơ sở cho dấu hiệu nhận biết và tính chất hai đường thẳng song song.",
    },
    EUCLID: {
      title: "Qua một điểm ngoài đường thẳng chỉ có một đường song song",
      text: "Hình nét đứt minh họa đường thẳng duy nhất đi qua M và song song với a. Đây là nội dung cốt lõi của tiên đề Euclid ở mức Toán 7.",
    },
  };
  const item = content[mode];
  return (
    <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
      <p className="text-xs font-black uppercase tracking-[0.1em] text-indigo-600">AI Visual Note</p>
      <h2 className="mt-2 text-xl font-black text-indigo-950">{item.title}</h2>
      <p className="mt-2 text-sm leading-6 text-indigo-900">{item.text}</p>
    </div>
  );
}
