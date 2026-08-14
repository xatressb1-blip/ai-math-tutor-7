"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getDemoStudentBrain } from "@/services/student/student-brain-service";
import { loadStudentBrainFromStorage } from "@/services/student/student-brain-storage";
import { loadMockTestResults } from "@/services/revision/mock-test-storage";
import { buildPilotAnalytics } from "@/services/revision/pilot-analytics";
import type { StudentBrainSnapshot } from "@/types/student";
import type { MockTestResult } from "@/types/revision";

export function PilotAnalyticsDashboard() {
  const [brain, setBrain] = useState<StudentBrainSnapshot>(getDemoStudentBrain());
  const [tests, setTests] = useState<MockTestResult[]>([]);

  useEffect(() => {
    const saved = loadStudentBrainFromStorage();
    if (saved) setBrain(saved);
    setTests(loadMockTestResults());
  }, []);

  const data = useMemo(
    () => buildPilotAnalytics({ brain, mockTests: tests }),
    [brain, tests],
  );

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.12em] text-emerald-200">
                Phân tích dữ liệu học tập
              </p>
              <h1 className="mt-3 text-4xl font-black">Bảng phân tích trải nghiệm học tập</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Tổng hợp dữ liệu học trên trình duyệt hiện tại. Bản này phục vụ
                Dữ liệu đang lấy từ trình duyệt hiện tại; chưa phải báo cáo tập trung toàn lớp.
              </p>
            </div>
            <Link href="/" className="rounded-2xl bg-white px-4 py-2.5 text-sm font-black text-slate-950">
              ← Thư viện
            </Link>
          </div>
        </header>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Phiên học" value={data.sessionCount} />
          <Metric label="Phút học" value={data.totalStudyMinutes} />
          <Metric label="Độ chính xác" value={`${data.accuracy}%`} />
          <Metric label="Lỗi đang mở" value={data.activeMistakes} />
          <Metric label="Thành thạo TB" value={`${data.averageMastery}/100`} />
          <Metric label="Tự tin TB" value={`${data.averageConfidence}/100`} />
          <Metric label="Bài kiểm tra thửs" value={data.mockTestsCompleted} />
          <Metric label="Best Test" value={data.bestMockTestScore === null ? "—" : `${data.bestMockTestScore}%`} />
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6">
            <p className="text-xs font-black uppercase tracking-[0.1em] text-rose-600">Kỹ năng cần ưu tiên</p>
            <div className="mt-4 space-y-3">
              {data.topWeakSkills.map((skill, index) => (
                <div key={skill} className="rounded-2xl bg-rose-50 p-4 text-sm font-black text-rose-950">
                  {index + 1}. {skill}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6">
            <p className="text-xs font-black uppercase tracking-[0.1em] text-indigo-600">Ghi chú vận hành</p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <p>• Chỉ số này lấy từ Hồ sơ học tập AI và Bài kiểm tra thử trên đúng thiết bị đang mở.</p>
              <p>• Khi học sinh đổi thiết bị hoặc xóa dữ liệu trình duyệt, localStorage không đồng bộ.</p>
              <p>• Đây là bước tiền đề để xác định schema Analytics trước dữ liệu nhiều học sinh trực tuyến.</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/mastery" className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-black text-white">
                Revision Coach
              </Link>
              <Link href="/mock-test" className="rounded-2xl border border-slate-300 px-4 py-2.5 text-xs font-black">
                Bài kiểm tra thử
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-3xl font-black">{value}</div>
      <div className="mt-1 text-xs font-black uppercase tracking-[0.08em] text-slate-500">{label}</div>
    </div>
  );
}
