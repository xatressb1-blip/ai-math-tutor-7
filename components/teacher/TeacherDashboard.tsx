"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { demoClassStudents } from "@/data/teacher/demo-class";
import { getDemoStudentBrain } from "@/services/student/student-brain-service";
import { loadStudentBrainFromStorage } from "@/services/student/student-brain-storage";
import { buildClassAnalytics } from "@/services/teacher/class-analytics-service";
import { downloadClassAnalyticsCsv } from "@/services/teacher/teacher-export-service";
import type { StudentBrainSnapshot } from "@/types/student";
import type {
  StudentAnalytics,
  TeacherStudentRecord,
} from "@/types/teacher";

type Tab = "OVERVIEW" | "STUDENTS" | "SKILLS" | "MISTAKES";

const supportMeta = {
  ON_TRACK: {
    label: "Đúng tiến độ",
    className: "bg-emerald-50 text-emerald-700",
  },
  WATCH: {
    label: "Theo dõi",
    className: "bg-amber-50 text-amber-700",
  },
  NEEDS_SUPPORT: {
    label: "Cần hỗ trợ",
    className: "bg-rose-50 text-rose-700",
  },
} as const;

export function TeacherDashboard() {
  const [liveBrain, setLiveBrain] =
    useState<StudentBrainSnapshot>(getDemoStudentBrain());
  const [tab, setTab] = useState<Tab>("OVERVIEW");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = loadStudentBrainFromStorage();
    if (saved) setLiveBrain(saved);
  }, []);

  const students = useMemo<TeacherStudentRecord[]>(() => {
    const live: TeacherStudentRecord = {
      id: liveBrain.profile.id,
      displayName: liveBrain.profile.displayName,
      className: liveBrain.profile.className ?? "7A",
      source: "LIVE",
      brain: liveBrain,
    };

    return [live, ...demoClassStudents];
  }, [liveBrain]);

  const analytics = useMemo(
    () => buildClassAnalytics(students, "7A"),
    [students],
  );

  const selectedStudent =
    analytics.students.find((student) => student.studentId === selectedId) ??
    null;

  function openStudent(student: StudentAnalytics) {
    setSelectedId(student.studentId);
  }

  return (
    <main className="min-h-screen bg-[#f4f6fb] px-4 py-5 text-slate-950 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-[1500px]">
        <header className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-indigo-200">
                  Beta 2.2
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-emerald-200">
                  Teacher Dashboard
                </span>
              </div>
              <p className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                Lớp {analytics.className}
              </p>
              <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                Class Analytics
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                Theo dõi Mastery, Confidence, Reasoning, Mistake Memory và mức
                độ cần hỗ trợ của từng học sinh trên cùng một màn hình.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/"
                className="rounded-2xl bg-white px-4 py-2.5 text-sm font-black text-slate-950"
              >
                ← Về thư viện
              </Link>
              <button
                type="button"
                onClick={() => downloadClassAnalyticsCsv(analytics)}
                className="rounded-2xl bg-indigo-500 px-4 py-2.5 text-sm font-black text-white"
              >
                Xuất CSV
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-2xl border border-white/15 px-4 py-2.5 text-sm font-black text-white"
              >
                In / Lưu PDF
              </button>
            </div>
          </div>
        </header>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <Metric value={analytics.studentCount} label="Học sinh" />
          <Metric value={`${analytics.averageMastery}/100`} label="Mastery" />
          <Metric
            value={`${analytics.averageConfidence}/100`}
            label="Confidence"
          />
          <Metric value={`${analytics.averageAccuracy}%`} label="Accuracy" />
          <Metric
            value={
              analytics.averageReasoning === null
                ? "—"
                : `${analytics.averageReasoning}/100`
            }
            label="Reasoning"
          />
          <Metric
            value={analytics.studentsNeedingSupport}
            label="Cần hỗ trợ"
            danger={analytics.studentsNeedingSupport > 0}
          />
        </section>

        <nav className="mt-5 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          {(
            [
              ["OVERVIEW", "Tổng quan"],
              ["STUDENTS", "Học sinh"],
              ["SKILLS", "Kỹ năng"],
              ["MISTAKES", "Lỗi phổ biến"],
            ] as Array<[Tab, string]>
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={`rounded-xl px-4 py-2.5 text-sm font-black ${
                tab === value
                  ? "bg-slate-950 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {tab === "OVERVIEW" && (
          <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-indigo-600">
                    Priority Students
                  </p>
                  <h2 className="mt-2 text-2xl font-black">
                    Ai cần giáo viên chú ý trước?
                  </h2>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600">
                  {analytics.studentsNeedingSupport} cần hỗ trợ ·{" "}
                  {analytics.studentsOnTrack} đúng tiến độ
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {analytics.students.map((student) => (
                  <StudentRow
                    key={student.studentId}
                    student={student}
                    onOpen={() => openStudent(student)}
                  />
                ))}
              </div>
            </section>

            <div className="space-y-5">
              <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-fuchsia-600">
                  Skill Heatmap
                </p>
                <h2 className="mt-2 text-2xl font-black">
                  Kỹ năng nào cả lớp đang yếu?
                </h2>
                <div className="mt-5 space-y-4">
                  {analytics.skills.slice(0, 6).map((skill) => (
                    <SkillBar
                      key={skill.skillName}
                      label={skill.skillName}
                      value={skill.masteryAverage}
                      note={`${skill.strugglingCount}/${skill.studentCount} em dưới 60`}
                    />
                  ))}
                </div>
              </section>

              <section className="rounded-[2rem] border border-rose-100 bg-rose-50 p-5 shadow-sm sm:p-6">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-rose-600">
                  Class Mistake Memory
                </p>
                <h2 className="mt-2 text-2xl font-black text-rose-950">
                  Lỗi lặp lại của cả lớp
                </h2>
                <div className="mt-4 space-y-3">
                  {analytics.commonMistakes.slice(0, 4).map((mistake) => (
                    <div
                      key={mistake.description}
                      className="rounded-2xl bg-white/75 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-sm font-bold leading-6 text-rose-950">
                          {mistake.description}
                        </p>
                        <span className="shrink-0 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-black text-rose-700">
                          {mistake.count} lần
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {tab === "STUDENTS" && (
          <section className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-2xl font-black">Danh sách học sinh</h2>
            <p className="mt-2 text-sm text-slate-500">
              Dòng có nhãn LIVE lấy trực tiếp Student Brain trên trình duyệt
              hiện tại; các dòng còn lại là dữ liệu lớp Demo để kiểm thử giao
              diện giáo viên trước khi có database nhiều người dùng.
            </p>

            <div className="mt-5 overflow-x-auto">
              <table className="min-w-[1050px] w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.08em] text-slate-500">
                    <th className="px-3 py-3">Học sinh</th>
                    <th className="px-3 py-3">Mastery</th>
                    <th className="px-3 py-3">Confidence</th>
                    <th className="px-3 py-3">Accuracy</th>
                    <th className="px-3 py-3">Reasoning</th>
                    <th className="px-3 py-3">Hint dep.</th>
                    <th className="px-3 py-3">Phút học</th>
                    <th className="px-3 py-3">Lỗi</th>
                    <th className="px-3 py-3">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.students.map((student) => (
                    <tr
                      key={student.studentId}
                      onClick={() => openStudent(student)}
                      className="cursor-pointer border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-3 py-4 font-black">
                        {student.displayName}
                        {student.source === "LIVE" && (
                          <span className="ml-2 rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-black text-indigo-700">
                            LIVE
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-4">{student.masteryAverage}</td>
                      <td className="px-3 py-4">{student.confidenceAverage}</td>
                      <td className="px-3 py-4">{student.accuracyAverage}%</td>
                      <td className="px-3 py-4">
                        {student.reasoningScore ?? "—"}
                      </td>
                      <td className="px-3 py-4">
                        {student.hintDependency === null
                          ? "—"
                          : `${student.hintDependency}%`}
                      </td>
                      <td className="px-3 py-4">
                        {student.totalStudyMinutes}
                      </td>
                      <td className="px-3 py-4">{student.activeMistakes}</td>
                      <td className="px-3 py-4">
                        <SupportBadge level={student.supportLevel} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === "SKILLS" && (
          <section className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-2xl font-black">Class Skill Analytics</h2>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {analytics.skills.map((skill) => (
                <article
                  key={skill.skillName}
                  className="rounded-2xl border border-slate-200 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black">{skill.skillName}</h3>
                      <p className="mt-1 text-xs font-bold text-slate-500">
                        {skill.strugglingCount}/{skill.studentCount} học sinh
                        cần củng cố
                      </p>
                    </div>
                    <span className="text-xl font-black">
                      {skill.masteryAverage}/100
                    </span>
                  </div>
                  <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-950"
                      style={{ width: `${skill.masteryAverage}%` }}
                    />
                  </div>
                  <div className="mt-3 text-xs font-bold text-slate-500">
                    Confidence trung bình: {skill.confidenceAverage}/100
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {tab === "MISTAKES" && (
          <section className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-2xl font-black">Class Mistake Memory</h2>
            <p className="mt-2 text-sm text-slate-500">
              Xếp theo tổng số lần lỗi đang xuất hiện trong lớp.
            </p>
            <div className="mt-5 space-y-3">
              {analytics.commonMistakes.map((mistake, index) => (
                <article
                  key={mistake.description}
                  className="grid gap-4 rounded-2xl border border-slate-200 p-4 sm:grid-cols-[48px_1fr_auto] sm:items-center"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-sm font-black text-rose-700">
                    {index + 1}
                  </div>
                  <p className="text-sm font-bold leading-6">
                    {mistake.description}
                  </p>
                  <span className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-black text-rose-700">
                    {mistake.count} lần
                  </span>
                </article>
              ))}
            </div>
          </section>
        )}

        {selectedStudent && (
          <StudentDrawer
            student={selectedStudent}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>
    </main>
  );
}

function StudentRow({
  student,
  onOpen,
}: {
  student: StudentAnalytics;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="grid w-full gap-4 rounded-2xl border border-slate-200 p-4 text-left hover:bg-slate-50 sm:grid-cols-[1fr_110px_110px_110px_auto] sm:items-center"
    >
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-black">{student.displayName}</p>
          {student.source === "LIVE" && (
            <span className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-black text-indigo-700">
              LIVE
            </span>
          )}
        </div>
        <p className="mt-1 text-xs font-bold text-slate-500">
          Yếu nhất: {student.weakestSkill ?? "—"}
        </p>
      </div>
      <MiniValue label="Mastery" value={student.masteryAverage} />
      <MiniValue label="Accuracy" value={student.accuracyAverage} suffix="%" />
      <MiniValue
        label="Reasoning"
        value={student.reasoningScore}
      />
      <SupportBadge level={student.supportLevel} />
    </button>
  );
}

function StudentDrawer({
  student,
  onClose,
}: {
  student: StudentAnalytics;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-slate-950/35 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Đóng"
        onClick={onClose}
        className="absolute inset-0"
      />
      <aside className="relative h-full w-full max-w-xl overflow-y-auto bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-indigo-600">
              Student Profile
            </p>
            <h2 className="mt-2 text-3xl font-black">
              {student.displayName}
            </h2>
            <p className="mt-1 text-sm font-bold text-slate-500">
              Lớp {student.className}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-lg font-black"
          >
            ×
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Metric value={`${student.masteryAverage}/100`} label="Mastery" />
          <Metric
            value={`${student.confidenceAverage}/100`}
            label="Confidence"
          />
          <Metric value={`${student.accuracyAverage}%`} label="Accuracy" />
          <Metric
            value={
              student.reasoningScore === null
                ? "—"
                : `${student.reasoningScore}/100`
            }
            label="Reasoning"
          />
        </div>

        <div className="mt-6 rounded-2xl bg-slate-950 p-5 text-white">
          <p className="text-xs font-black uppercase tracking-[0.1em] text-indigo-200">
            AI Recommendation
          </p>
          <p className="mt-2 text-sm font-bold leading-6">
            {student.recommendation}
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Info label="Buổi học" value={student.sessionCount} />
          <Info label="Tổng phút học" value={student.totalStudyMinutes} />
          <Info label="Lỗi đang mở" value={student.activeMistakes} />
          <Info
            label="Hint dependency"
            value={
              student.hintDependency === null
                ? "—"
                : `${student.hintDependency}%`
            }
          />
        </div>

        <div className="mt-6 space-y-3">
          <Info
            label="Kỹ năng mạnh"
            value={student.strongestSkill ?? "Chưa đủ dữ liệu"}
          />
          <Info
            label="Kỹ năng yếu"
            value={student.weakestSkill ?? "Chưa đủ dữ liệu"}
          />
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-xs font-black uppercase tracking-[0.1em] text-slate-500">
              Mức hỗ trợ
            </p>
            <div className="mt-2">
              <SupportBadge level={student.supportLevel} />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Metric({
  value,
  label,
  danger = false,
}: {
  value: string | number;
  label: string;
  danger?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm ${
        danger
          ? "border-rose-100 bg-rose-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="text-2xl font-black">{value}</div>
      <div className="mt-1 text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">
        {label}
      </div>
    </div>
  );
}

function MiniValue({
  label,
  value,
  suffix = "",
}: {
  label: string;
  value: number | null;
  suffix?: string;
}) {
  return (
    <div>
      <div className="text-lg font-black">
        {value === null ? "—" : `${value}${suffix}`}
      </div>
      <div className="text-[10px] font-black uppercase tracking-[0.08em] text-slate-400">
        {label}
      </div>
    </div>
  );
}

function SupportBadge({
  level,
}: {
  level: StudentAnalytics["supportLevel"];
}) {
  const meta = supportMeta[level];
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-black ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}

function SkillBar({
  label,
  value,
  note,
}: {
  label: string;
  value: number;
  note: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-black">{label}</p>
        <span className="text-sm font-black">{value}/100</span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-slate-950"
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="mt-1 text-[11px] font-bold text-slate-400">{note}</p>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <p className="text-xs font-black uppercase tracking-[0.1em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-base font-black">{value}</p>
    </div>
  );
}
