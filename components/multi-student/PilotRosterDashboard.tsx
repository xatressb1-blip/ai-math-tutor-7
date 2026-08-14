"use client";

import { FormEvent, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  createPilotStudent,
  loadMultiStudentWorkspace,
  removePilotClassStudents,
  removePilotStudent,
  saveMultiStudentWorkspace,
  setActivePilotStudent,
  updatePilotStudentAccess,
} from "@/services/multi-student/multi-student-storage";
import { buildMultiStudentClassSummary } from "@/services/multi-student/class-summary";
import {
  CloudRequestError,
  teacherDeleteCloudStudent,
  teacherUpsertCloudStudent,
} from "@/services/cloud/cloud-sync-client";
import {
  classAlreadyExists,
  deleteTeacherClass,
  loadTeacherClassRegistry,
  loadTeacherClassSettings,
  makeClassCode,
  saveTeacherClassSettings,
  selectTeacherClass,
  type TeacherClassSettings,
} from "@/services/teacher/teacher-class-storage";
import type { MultiStudentWorkspace } from "@/types/multi-student";

function normalize(value: string) {
  return value.trim().toUpperCase();
}

function studentCodeCandidates(workspace: MultiStudentWorkspace, classCode: string): string[] {
  const used = new Set(
    workspace.students
      .filter((item) => normalize(item.classCode || item.profile.className || "") === normalize(classCode) && item.accessCode)
      .map((item) => item.accessCode as string),
  );
  return Array.from({ length: 10 }, (_, index) => `HS${index}`).filter((code) => !used.has(code));
}

export function PilotRosterDashboard() {
  const [workspace, setWorkspace] = useState<MultiStudentWorkspace | null>(null);
  const [classSettings, setClassSettings] = useState<TeacherClassSettings | null>(null);
  const [classes, setClasses] = useState<TeacherClassSettings[]>([]);
  const [className, setClassName] = useState("7A");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("Chọn một lớp đã có hoặc tạo lớp mới, sau đó thêm học sinh ngay bên dưới.");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  useEffect(() => {
    const ws = loadMultiStudentWorkspace();
    const savedClasses = loadTeacherClassRegistry();
    const saved = loadTeacherClassSettings() ?? savedClasses[0] ?? null;
    setWorkspace(ws);
    setClasses(savedClasses);
    if (saved) {
      setClassSettings(saved);
      setClassName(saved.className);
    }
  }, []);

  const allRows = useMemo(() => workspace ? buildMultiStudentClassSummary(workspace) : [], [workspace]);

  const rows = useMemo(() => {
    if (!workspace || !classSettings) return [];
    return allRows.filter((row) => {
      const record = workspace.students.find((item) => item.profile.id === row.studentId);
      return normalize(record?.classCode || row.className) === normalize(classSettings.classCode) ||
        normalize(row.className) === normalize(classSettings.className);
    });
  }, [workspace, classSettings, allRows]);

  const classCounts = useMemo(() => {
    if (!workspace) return new Map<string, number>();
    const counts = new Map<string, number>();
    for (const item of workspace.students) {
      const code = normalize(item.classCode || item.profile.className || "");
      if (!code) continue;
      counts.set(code, (counts.get(code) ?? 0) + 1);
    }
    return counts;
  }, [workspace]);

  const selectedStudent = useMemo(() => {
    if (!workspace || !selectedStudentId) return null;
    const record = workspace.students.find((item) => item.profile.id === selectedStudentId);
    const brain = workspace.brains[selectedStudentId];
    const summary = allRows.find((item) => item.studentId === selectedStudentId);
    return record && brain && summary ? { record, brain, summary } : null;
  }, [workspace, selectedStudentId, allRows]);

  function persist(next: MultiStudentWorkspace) {
    saveMultiStudentWorkspace(next);
    setWorkspace(next);
  }

  function refreshClasses() {
    setClasses(loadTeacherClassRegistry());
  }

  function createClass(event: FormEvent) {
    event.preventDefault();
    const cleanName = normalize(className);
    if (!cleanName) {
      setMessage("Hãy nhập tên lớp, ví dụ 7A.");
      return;
    }
    const existing = classAlreadyExists(cleanName);
    if (existing) {
      chooseClass(existing.classCode);
      setMessage(`Lớp ${existing.className} đã tồn tại. Hệ thống đã mở lớp này.`);
      return;
    }
    const saved = saveTeacherClassSettings({ className: cleanName, classCode: makeClassCode(cleanName) });
    setClassSettings(saved);
    setClassName(saved.className);
    refreshClasses();
    setSelectedStudentId(null);
    setMessage(`✓ Đã tạo lớp ${saved.className}. Mã lớp là ${saved.classCode}.`);
  }

  function chooseClass(classCode: string) {
    const selected = selectTeacherClass(classCode);
    if (!selected) return;
    setClassSettings(selected);
    setClassName(selected.className);
    setSelectedStudentId(null);
    setMessage(`✓ Đang quản lý lớp ${selected.className}.`);
  }

  async function addStudent(event: FormEvent) {
    event.preventDefault();
    if (!workspace || !classSettings || !name.trim()) return;
    if (rows.length >= 10) {
      setMessage("Lớp đã đủ 10 học sinh, tương ứng các mã HS0 đến HS9.");
      return;
    }

    const created = createPilotStudent(workspace, {
      displayName: name,
      className: classSettings.className,
    });
    const studentId = created.activeStudentId;
    const candidate = studentCodeCandidates(created, classSettings.classCode)[0];
    if (!candidate) {
      setMessage("Lớp đã dùng đủ mã HS0 đến HS9.");
      return;
    }

    const withLocalCode = updatePilotStudentAccess(created, studentId, {
      classCode: classSettings.classCode,
      accessCode: candidate,
      cloudEnabled: false,
    });
    persist(withLocalCode);
    setName("");
    setSelectedStudentId(studentId);
    setMessage(`✓ Đã thêm học sinh và cấp mã ${candidate}. Đang đồng bộ mã để học sinh có thể đăng nhập…`);
    await provisionAccess(withLocalCode, studentId, candidate);
  }

  async function provisionAccess(current: MultiStudentWorkspace, studentId: string, preferredCode?: string) {
    const brain = current.brains[studentId];
    if (!brain || !classSettings) return;
    const record = current.students.find((item) => item.profile.id === studentId);
    const candidates = [preferredCode || record?.accessCode, ...studentCodeCandidates(current, classSettings.classCode)]
      .filter((value, index, values): value is string => Boolean(value) && values.indexOf(value) === index);
    if (!candidates.length) {
      setMessage("Lớp đã dùng đủ mã HS0 đến HS9.");
      return;
    }

    setBusyId(studentId);
    try {
      let chosen = "";
      for (const accessCode of candidates) {
        try {
          await teacherUpsertCloudStudent({ classCode: classSettings.classCode, accessCode, brain });
          chosen = accessCode;
          break;
        } catch (error) {
          if (error instanceof CloudRequestError && error.code === "ACCESS_CODE_TAKEN") continue;
          throw error;
        }
      }
      if (!chosen) throw new Error("Lớp đã dùng đủ mã HS0 đến HS9 trên hệ thống trực tuyến.");
      const next = updatePilotStudentAccess(current, studentId, {
        classCode: classSettings.classCode,
        accessCode: chosen,
        cloudEnabled: true,
      });
      persist(next);
      setMessage(`✓ ${brain.profile.displayName} đã có mã ${chosen} và có thể đăng nhập vào lớp ${classSettings.classCode}.`);
    } catch (error) {
      setMessage(`Học sinh vẫn có mã ${record?.accessCode || preferredCode || "HS?"} trên thiết bị, nhưng chưa đồng bộ được để đăng nhập từ thiết bị khác. ${error instanceof Error ? error.message : "Hãy kiểm tra kết nối dữ liệu trực tuyến."}`);
    } finally {
      setBusyId(null);
    }
  }

  async function copyLogin(studentId: string) {
    if (!workspace || !classSettings) return;
    const record = workspace.students.find((item) => item.profile.id === studentId);
    if (!record?.accessCode) return;
    const classCode = record.classCode || classSettings.classCode;
    const loginUrl = `${window.location.origin}/pilot-onboarding?class=${encodeURIComponent(classCode)}`;
    const text = `AI Math Tutor 7\nLớp: ${classCode}\nMã học sinh: ${record.accessCode}\nMở: ${loginUrl}`;
    await navigator.clipboard.writeText(text);
    setMessage(`✓ Đã sao chép lớp ${classCode}, mã ${record.accessCode} và liên kết đăng nhập.`);
  }

  async function deleteStudent(studentId: string) {
    if (!workspace) return;
    const record = workspace.students.find((item) => item.profile.id === studentId);
    if (!record) return;
    if (!window.confirm(`Xóa ${record.profile.displayName} khỏi lớp? Dữ liệu học sinh trên thiết bị sẽ bị xóa.`)) return;
    setBusyId(studentId);
    try {
      if (record.cloudEnabled && record.classCode) {
        await teacherDeleteCloudStudent({ classCode: record.classCode, studentId });
      }
      persist(removePilotStudent(workspace, studentId));
      if (selectedStudentId === studentId) setSelectedStudentId(null);
      setMessage(`✓ Đã xóa ${record.profile.displayName} khỏi lớp.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không thể xóa học sinh.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteClass() {
    if (!workspace || !classSettings) return;
    const classCode = classSettings.classCode;
    const classNameValue = classSettings.className;
    const members = workspace.students.filter((item) => normalize(item.classCode || item.profile.className || "") === normalize(classCode));
    const detail = members.length
      ? `Lớp đang có ${members.length} học sinh. Xóa lớp sẽ xóa cả các học sinh này khỏi danh sách trên thiết bị.`
      : "Lớp hiện chưa có học sinh.";
    if (!window.confirm(`Xóa lớp ${classNameValue}?\n\n${detail}\n\nBạn có chắc chắn muốn tiếp tục?`)) return;

    setBusyId(`class:${classCode}`);
    try {
      for (const member of members) {
        if (member.cloudEnabled && member.classCode) {
          await teacherDeleteCloudStudent({ classCode: member.classCode, studentId: member.profile.id });
        }
      }
      persist(removePilotClassStudents(workspace, classCode));
      const remaining = deleteTeacherClass(classCode);
      setClasses(remaining);
      const nextClass = remaining[0] ? selectTeacherClass(remaining[0].classCode) : null;
      setClassSettings(nextClass);
      if (nextClass) setClassName(nextClass.className);
      setSelectedStudentId(null);
      setMessage(`✓ Đã xóa lớp ${classNameValue}${members.length ? ` và ${members.length} học sinh trong lớp` : ""}.`);
    } catch (error) {
      setMessage(error instanceof Error ? `Chưa thể xóa lớp: ${error.message}` : "Chưa thể xóa lớp.");
    } finally {
      setBusyId(null);
    }
  }

  if (!workspace) {
    return <main className="min-h-screen bg-[#f5f7fb] p-8 font-bold">Đang tải dữ liệu lớp học…</main>;
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-cyan-200">KHU VỰC GIÁO VIÊN · QUẢN LÝ LỚP</p>
          <h1 className="mt-3 text-4xl font-black">Lớp học và học sinh</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Chọn lớp để xem học sinh, thêm học sinh mới, xem hồ sơ chi tiết hoặc xóa lớp không còn sử dụng.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/teacher" className="rounded-2xl bg-white px-4 py-2.5 text-sm font-black text-slate-950">← Bảng điều khiển</Link>
            <Link href="/teacher-multi" className="rounded-2xl border border-white/20 px-4 py-2.5 text-sm font-black text-white">Theo dõi cả lớp</Link>
            <Link href="/teacher-progress" className="rounded-2xl border border-white/20 px-4 py-2.5 text-sm font-black text-white">Kiểm tra tiến bộ</Link>
          </div>
        </header>

        <section className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.1em] text-indigo-600">CÁC LỚP ĐÃ TẠO</p>
              <h2 className="mt-2 text-2xl font-black">Chọn lớp cần quản lý</h2>
              <p className="mt-1 text-sm text-slate-500">Bấm vào tên lớp để xem danh sách học sinh của lớp đó.</p>
            </div>
            <form onSubmit={createClass} className="flex flex-wrap gap-2">
              <input value={className} onChange={(e) => setClassName(e.target.value.toUpperCase())} placeholder="Ví dụ: 7A" className="w-36 rounded-xl border border-slate-300 px-4 py-2.5 uppercase outline-none focus:border-indigo-500" />
              <button className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white">+ Tạo lớp</button>
            </form>
          </div>

          {classes.length ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {classes.map((item) => {
                const active = item.classCode === classSettings?.classCode;
                return (
                  <button key={item.classCode} type="button" onClick={() => chooseClass(item.classCode)} className={`rounded-2xl border p-4 text-left transition ${active ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100" : "border-slate-200 bg-slate-50 hover:bg-white"}`}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xl font-black">{item.className}</span>
                      <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-slate-500">{classCounts.get(normalize(item.classCode)) ?? 0} học sinh</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">Mã lớp: <b>{item.classCode}</b></p>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">Chưa có lớp nào. Nhập tên lớp ở phía trên để bắt đầu.</div>
          )}
        </section>

        {classSettings && (
          <section className="mt-5 rounded-[2rem] border border-amber-200 bg-amber-50 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.1em] text-amber-700">LỚP ĐANG MỞ</p>
                <h2 className="mt-2 text-3xl font-black">{classSettings.className}</h2>
                <p className="mt-1 text-sm">Mã lớp: <b>{classSettings.classCode}</b> · {rows.length}/10 học sinh</p>
              </div>
              <button type="button" disabled={busyId === `class:${classSettings.classCode}`} onClick={deleteClass} className="rounded-xl bg-rose-50 px-4 py-2 text-xs font-black text-rose-700 disabled:opacity-40">Xóa lớp</button>
            </div>

            <form onSubmit={addStudent} className="mt-5 rounded-2xl bg-white p-5">
              <label className="text-sm font-black">Thêm học sinh vào lớp {classSettings.className}</label>
              <p className="mt-1 text-xs text-slate-500">Mỗi học sinh được cấp tự động một mã HS0–HS9 trong lớp này.</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Họ và tên học sinh" className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500" />
                <button disabled={!name.trim() || rows.length >= 10} className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white disabled:opacity-40">+ Thêm học sinh</button>
              </div>
            </form>
          </section>
        )}

        <div className="mt-4 rounded-2xl bg-slate-950 p-4 text-sm font-bold text-white">{message}</div>

        {classSettings && (
          <section className="mt-5 grid gap-3">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.1em] text-indigo-600">DANH SÁCH HỌC SINH</p>
                <h2 className="mt-1 text-2xl font-black">Lớp {classSettings.className}</h2>
                <p className="mt-1 text-sm text-slate-500">Bấm vào tên học sinh để xem đầy đủ thông tin.</p>
              </div>
            </div>

            {rows.length === 0 && <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">Lớp chưa có học sinh.</div>}

            {rows.map((row) => {
              const record = workspace.students.find((item) => item.profile.id === row.studentId);
              const isSelected = selectedStudentId === row.studentId;
              return (
                <article key={row.studentId} className={`rounded-[1.5rem] border bg-white p-5 shadow-sm ${isSelected ? "border-indigo-500 ring-2 ring-indigo-100" : "border-slate-200"}`}>
                  <button type="button" onClick={() => setSelectedStudentId(isSelected ? null : row.studentId)} className="w-full text-left">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-black">{row.displayName}</h3>
                          {row.needsAttention && <span className="rounded-full bg-rose-50 px-3 py-1 text-[10px] font-black text-rose-700">CẦN HỖ TRỢ</span>}
                        </div>
                        <p className="mt-1 text-sm text-slate-500">Mã học sinh: <b className="text-indigo-700">{record?.accessCode || "Chưa cấp"}</b> · {record?.cloudEnabled ? "Đã sẵn sàng đăng nhập" : "Chưa đồng bộ đăng nhập"}</p>
                      </div>
                      <span className="text-xs font-black text-indigo-600">{isSelected ? "Thu gọn ↑" : "Xem thông tin ↓"}</span>
                    </div>
                  </button>

                  {isSelected && selectedStudent && selectedStudent.record.profile.id === row.studentId && (
                    <StudentDetail
                      data={selectedStudent}
                      busy={busyId === row.studentId}
                      onRetryCode={() => provisionAccess(workspace, row.studentId, record?.accessCode)}
                      onCopy={() => copyLogin(row.studentId)}
                      onOpen={() => persist(setActivePilotStudent(workspace, row.studentId))}
                      onDelete={() => deleteStudent(row.studentId)}
                    />
                  )}
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

function StudentDetail({
  data,
  busy,
  onRetryCode,
  onCopy,
  onOpen,
  onDelete,
}: {
  data: {
    record: MultiStudentWorkspace["students"][number];
    brain: MultiStudentWorkspace["brains"][string];
    summary: ReturnType<typeof buildMultiStudentClassSummary>[number];
  };
  busy: boolean;
  onRetryCode: () => void;
  onCopy: () => void;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const { record, brain, summary } = data;
  const weakest = [...brain.skills].sort((a, b) => a.masteryScore - b.masteryScore).slice(0, 3);
  const mistakes = [...brain.mistakes].filter((item) => !item.resolved).sort((a, b) => b.count - a.count).slice(0, 3);
  const recent = [...brain.sessions].sort((a, b) => b.startedAt.localeCompare(a.startedAt)).slice(0, 3);
  const totalMinutes = brain.sessions.reduce((sum, item) => sum + item.durationMinutes, 0);

  return (
    <div className="mt-5 border-t border-slate-100 pt-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Info label="Thành thạo" value={`${summary.mastery}/100`} />
        <Info label="Độ chính xác" value={`${summary.accuracy}%`} />
        <Info label="Phiên học" value={summary.sessions} />
        <Info label="Thời gian học" value={`${totalMinutes} phút`} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <DetailBox title="Thông tin học sinh">
          <Line label="Họ tên" value={record.profile.displayName} />
          <Line label="Lớp" value={record.classCode || record.profile.className || "—"} />
          <Line label="Mã học sinh" value={record.accessCode || "Chưa cấp"} />
          <Line label="Mục tiêu" value={record.profile.goal || "Nắm vững Toán 7 học kỳ I"} />
          <Line label="Ngày tham gia" value={formatDate(record.joinedAt)} />
          <Line label="Hoạt động gần nhất" value={record.lastActiveAt ? formatDate(record.lastActiveAt) : "Chưa có"} />
        </DetailBox>
        <DetailBox title="Kỹ năng cần ưu tiên">
          {weakest.length ? weakest.map((item) => <p key={item.id} className="text-sm leading-6"><b>{item.skillName}</b>: {item.masteryScore}/100</p>) : <p className="text-sm text-slate-500">Chưa có dữ liệu kỹ năng.</p>}
        </DetailBox>
        <DetailBox title="Lỗi cần khắc phục">
          {mistakes.length ? mistakes.map((item) => <p key={item.id} className="text-sm leading-6">• {item.description} <b>({item.count} lần)</b></p>) : <p className="text-sm text-slate-500">Chưa có lỗi đang mở.</p>}
        </DetailBox>
      </div>

      {recent.length > 0 && (
        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
          <h4 className="font-black">Các phiên học gần nhất</h4>
          <div className="mt-2 grid gap-2 md:grid-cols-3">
            {recent.map((item) => <div key={item.id} className="rounded-xl bg-white p-3 text-xs leading-5"><b>{formatDate(item.startedAt)}</b><br />{item.questionsCorrect}/{item.questionsAttempted} câu đúng · {item.durationMinutes} phút</div>)}
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {!record.cloudEnabled && <button type="button" disabled={busy} onClick={onRetryCode} className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white disabled:opacity-40">Đồng bộ mã đăng nhập</button>}
        {record.accessCode && <button type="button" onClick={onCopy} className="rounded-xl bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700">Sao chép mã / liên kết</button>}
        <button type="button" onClick={onOpen} className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-black text-white">Mở hồ sơ học sinh</button>
        <Link href={`/teacher-progress?student=${encodeURIComponent(record.profile.id)}`} className="rounded-xl bg-indigo-50 px-4 py-2 text-xs font-black text-indigo-700">Xem tiến độ chi tiết</Link>
        <Link href="/library" className="rounded-xl bg-amber-50 px-4 py-2 text-xs font-black text-amber-800">Chọn hoạt động</Link>
        <button type="button" disabled={busy} onClick={onDelete} className="rounded-xl bg-rose-50 px-4 py-2 text-xs font-black text-rose-700 disabled:opacity-40">Xóa học sinh</button>
      </div>
    </div>
  );
}

function DetailBox({ title, children }: { title: string; children: ReactNode }) {
  return <div className="rounded-2xl bg-slate-50 p-4"><h4 className="font-black">{title}</h4><div className="mt-3 space-y-1">{children}</div></div>;
}

function Info({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-xl bg-slate-50 p-3 text-center"><div className="text-xl font-black">{value}</div><div className="text-[10px] font-black uppercase text-slate-400">{label}</div></div>;
}

function Line({ label, value }: { label: string; value: string | number }) {
  return <p className="text-sm leading-6"><span className="text-slate-500">{label}:</span> <b>{value}</b></p>;
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}
