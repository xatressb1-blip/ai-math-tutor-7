"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getDemoStudentBrain } from "@/services/student/student-brain-service";
import { loadStudentBrainFromStorage } from "@/services/student/student-brain-storage";
import { buildDailyMission } from "@/services/pilot/daily-mission-engine";
import {
  getLocalDateKey,
  loadPilotActivity,
  markPilotActivity,
} from "@/services/pilot/pilot-experience-storage";
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
  const hasDiagnostic = (brain.diagnostics?.length ?? 0) > 0;
  const hasLearningData = brain.sessions.length > 0 || brain.skills.length > 0;

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-5 text-slate-950 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-black text-cyan-200">
                  AI Math Tutor 7
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-slate-200">
                  Hồ sơ: {brain.profile.displayName}
                </span>
              </div>
              <h1 className="mt-4 text-4xl font-black sm:text-5xl">
                Hôm nay em nên học gì?
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                AI dựa trên hồ sơ học tập của em để chọn nhiệm vụ phù hợp, ưu tiên
                đúng kỹ năng còn yếu và theo dõi tiến bộ qua từng phiên học.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <MiniStat label="Chuỗi học" value={`${streak.currentStreak} ngày`} />
              <MiniStat label="Ngày đã học" value={`${streak.activeDays} ngày`} />
            </div>
          </div>
        </header>

        <section className="mt-5 rounded-[2rem] border border-sky-100 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.12em] text-sky-700">
                BẮT ĐẦU TỪ ĐÂY
              </p>
              <h2 className="mt-2 text-2xl font-black">Lộ trình sử dụng dành cho học sinh</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Hãy đi theo thứ tự dưới đây. Em không cần tự đoán nên mở công cụ nào trước.
              </p>
            </div>
            <Link
              href="/library"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-black text-slate-700"
            >
              Xem đủ 19 bài
            </Link>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <GuideStep
              number="1"
              title="Kiểm tra đúng hồ sơ"
              text={`Hồ sơ đang dùng: ${brain.profile.displayName}. Nếu không đúng tên, hãy nhờ giáo viên đổi hồ sơ trước khi học.`}
              href="/pilot-onboarding"
              action="Mở / đổi hồ sơ"
              done={true}
            />
            <GuideStep
              number="2"
              title="Đánh giá đầu vào"
              text="Làm bài chẩn đoán để AI biết em đã vững phần nào và đang cần hỗ trợ kỹ năng nào."
              href="/diagnostic"
              action={hasDiagnostic ? "Xem / làm lại đánh giá" : "Làm đánh giá đầu vào"}
              done={hasDiagnostic}
            />
            <GuideStep
              number="3"
              title="Học và luyện đúng thứ tự"
              text="Học bài chính trước, sau đó luyện tập thích ứng và luyện suy luận để củng cố hiểu biết."
              href={mission.focusLessonId ? `/learn/${mission.focusLessonId}` : "/"}
              action={hasLearningData ? "Tiếp tục học" : "Bắt đầu bài học"}
              done={hasLearningData}
            />
            <GuideStep
              number="4"
              title="Xem tiến độ"
              text="Kiểm tra mức độ thành thạo, phần chương trình đã học và kỹ năng cần ôn tiếp."
              href="/mastery"
              action="Xem kết quả của em"
              done={brain.skills.length > 0}
            />
          </div>
        </section>

        <section className="mt-5 rounded-[2rem] border border-indigo-100 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.12em] text-indigo-600">
                NHIỆM VỤ HÔM NAY · {mission.totalMinutes} PHÚT
              </p>
              <h2 className="mt-2 text-2xl font-black">{mission.focusSkill}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{mission.readinessMessage}</p>
            </div>
            <span
              className={`rounded-full px-4 py-2 text-xs font-black ${
                completedToday
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {completedToday ? "✓ Đã ghi nhận hôm nay" : "Đang chờ hoàn thành"}
            </span>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {mission.items.map((item, index) => (
              <Link
                key={item.id}
                href={item.href}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 transition hover:bg-white hover:shadow-md"
              >
                <p className="text-xs font-black uppercase tracking-[0.1em] text-slate-400">
                  Bước {index + 1} · {item.estimatedMinutes} phút
                </p>
                <h3 className="mt-2 font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                <p className="mt-3 text-xs font-bold text-indigo-600">{item.reason}</p>
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setActivity(markPilotActivity())}
            className="mt-5 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white"
          >
            ✓ Ghi nhận đã hoàn thành phiên học hôm nay
          </button>
        </section>

        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <QuickLink href="/library" title="Thư viện 19 bài học" text="Chọn bài theo chương và nội dung." />
          <QuickLink href="/mastery" title="Ôn tập cá nhân hóa" text="Xem kỹ năng yếu và mức độ sẵn sàng." />
          <QuickLink href="/pilot-feedback" title="Góp ý trải nghiệm" text="Cho biết phần nào dễ hiểu hoặc cần cải thiện." />
          <QuickLink href="/cloud-sync" title="Đồng bộ dữ liệu" text="Tiếp tục học trên thiết bị khác bằng mã học sinh." />
        </div>

        <section className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.1em] text-emerald-600">
                CUỐI PHIÊN HỌC
              </p>
              <h2 className="mt-2 text-xl font-black">Em cảm thấy thế nào sau phiên học?</h2>
            </div>
            <Link
              href="/reflection"
              className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white"
            >
              Ghi phản hồi nhanh →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function GuideStep({
  number,
  title,
  text,
  href,
  action,
  done,
}: {
  number: string;
  title: string;
  text: string;
  href: string;
  action: string;
  done: boolean;
}) {
  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-sm font-black text-white">
          {number}
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
            done ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
          }`}
        >
          {done ? "ĐÃ CÓ DỮ LIỆU" : "NÊN THỰC HIỆN"}
        </span>
      </div>
      <h3 className="mt-4 font-black">{title}</h3>
      <p className="mt-2 min-h-20 text-sm leading-6 text-slate-600">{text}</p>
      <Link href={href} className="mt-4 inline-flex text-sm font-black text-indigo-700">
        {action} →
      </Link>
    </article>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 px-4 py-3 text-center">
      <div className="text-xl font-black">{value}</div>
      <div className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-300">
        {label}
      </div>
    </div>
  );
}

function QuickLink({ href, title, text }: { href: string; title: string; text: string }) {
  return (
    <Link href={href} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </Link>
  );
}
