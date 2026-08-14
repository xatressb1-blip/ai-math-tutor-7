"use client";

import { runPilotReadinessQa } from "@/services/student/pilot-readiness-qa";

export default function PilotReadinessDashboard() {
  const checks = runPilotReadinessQa();
  const passed = checks.filter((item) => item.passed).length;
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-black text-slate-900">Kiểm tra mức sẵn sàng triển khai</h1>
      <p className="mt-2 text-slate-600">
        Kiểm tra định danh kỹ năng, tiến độ và dữ liệu nhiều học sinh
      </p>
      <div className="mt-6 rounded-3xl border bg-white p-6 shadow-sm">
        <div className="text-4xl font-black">{passed}/{checks.length} PASS</div>
        <div className="mt-5 grid gap-3">
          {checks.map((item) => (
            <div key={item.id} className="rounded-2xl border p-4">
              <div className="font-bold">
                {item.passed ? "PASS" : "FAIL"} · {item.label}
              </div>
              <div className="mt-1 text-sm text-slate-600">{item.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
