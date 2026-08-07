"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  clearLessonDraft,
  loadLessonDraft,
  saveLessonDraft,
} from "@/services/authoring/lesson-authoring-storage";
import { downloadLessonJson, lessonToJson } from "@/services/authoring/lesson-export";
import { publishLesson } from "@/services/content/content-repository-storage";
import {
  parseLessonJson,
  validateLessonDefinition,
} from "@/services/authoring/lesson-validator";
import type { LessonDefinition, LessonStep } from "@/types/lesson";

function cloneLesson(lesson: LessonDefinition): LessonDefinition {
  return JSON.parse(JSON.stringify(lesson)) as LessonDefinition;
}

export function LessonAuthoringStudio({
  initialLesson,
  templates,
}: {
  initialLesson: LessonDefinition;
  templates: LessonDefinition[];
}) {
  const [lesson, setLesson] = useState<LessonDefinition>(() => cloneLesson(initialLesson));
  const [jsonText, setJsonText] = useState(() => lessonToJson(initialLesson));
  const [status, setStatus] = useState(`Đang biên soạn Bài ${initialLesson.lessonNumber}.`);
  const [selectedStepId, setSelectedStepId] = useState(initialLesson.steps[0]?.id ?? "");

  const validation = useMemo(() => validateLessonDefinition(lesson), [lesson]);
  const selectedStep =
    lesson.steps.find((step) => step.id === selectedStepId) ?? lesson.steps[0];

  useEffect(() => {
    const saved = loadLessonDraft(initialLesson.id);
    if (!saved) {
      const next = cloneLesson(initialLesson);
      setLesson(next);
      setJsonText(lessonToJson(next));
      setSelectedStepId(next.steps[0]?.id ?? "");
      setStatus(`Đang biên soạn Bài ${next.lessonNumber}.`);
      return;
    }
    setLesson(saved.lesson);
    setJsonText(lessonToJson(saved.lesson));
    setSelectedStepId(saved.lesson.steps[0]?.id ?? "");
    setStatus(
      `Đã khôi phục bản nháp lưu lúc ${new Date(saved.updatedAt).toLocaleString("vi-VN")}.`,
    );
  }, [initialLesson]);

  function commit(next: LessonDefinition, message: string) {
    setLesson(next);
    setJsonText(lessonToJson(next));
    setStatus(message);
  }

  function updateMeta<K extends keyof LessonDefinition>(
    key: K,
    value: LessonDefinition[K],
  ) {
    commit({ ...lesson, [key]: value }, "Đã cập nhật metadata.");
  }

  function updateStep(stepId: string, patch: Partial<LessonStep>) {
    const next = {
      ...lesson,
      steps: lesson.steps.map((step) =>
        step.id === stepId ? { ...step, ...patch } : step,
      ),
    };
    commit(next, "Đã cập nhật bước dạy.");
  }

  function updateObjective(index: number, value: string) {
    const objectives = [...lesson.objectives];
    objectives[index] = value;
    commit({ ...lesson, objectives }, "Đã cập nhật mục tiêu.");
  }

  function addObjective() {
    commit(
      { ...lesson, objectives: [...lesson.objectives, "Mục tiêu mới"] },
      "Đã thêm mục tiêu.",
    );
  }

  function removeObjective(index: number) {
    commit(
      {
        ...lesson,
        objectives: lesson.objectives.filter((_, current) => current !== index),
      },
      "Đã xoá mục tiêu.",
    );
  }

  function applyJson() {
    try {
      const parsed = parseLessonJson(jsonText);
      const result = validateLessonDefinition(parsed);
      setLesson(parsed);
      setSelectedStepId(parsed.steps[0]?.id ?? "");
      setStatus(
        result.isValid
          ? "Đã áp dụng JSON. Lesson hợp lệ."
          : `Đã áp dụng JSON nhưng còn ${result.errors.length} lỗi cần sửa.`,
      );
    } catch (error) {
      setStatus(
        error instanceof Error
          ? `Không đọc được JSON: ${error.message}`
          : "JSON không hợp lệ.",
      );
    }
  }

  function saveDraft() {
    saveLessonDraft(lesson);
    setStatus("Đã lưu bản nháp vào trình duyệt.");
  }

  function publishCurrentLesson() {
    const result = validateLessonDefinition(lesson);
    if (!result.isValid) {
      setStatus(
        `Không thể publish: còn ${result.errors.length} lỗi cấu trúc cần sửa.`,
      );
      return;
    }

    const published = publishLesson(lesson);
    setStatus(
      `Đã publish ${lesson.title} thành phiên bản v${published.version}. Demo học sẽ dùng bản này sau khi tải lại trang.`,
    );
  }

  function resetDraft() {
    clearLessonDraft(initialLesson.id);
    const reset = cloneLesson(initialLesson);
    commit(reset, `Đã khôi phục Bài ${reset.lessonNumber} mẫu.`);
    setSelectedStepId(reset.steps[0]?.id ?? "");
  }

  function switchTemplate(lessonId: string) {
    const nextTemplate = templates.find((item) => item.id === lessonId);
    if (!nextTemplate) return;
    window.location.href = `/authoring?lesson=${nextTemplate.id}`;
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-5 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-indigo-700">
                Beta 1.4
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-emerald-700">
                Lesson Authoring Studio
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-black tracking-tight">
              Biên soạn bài học không cần sửa Lesson Player
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Sửa metadata, mục tiêu và từng Teaching Step; hệ thống kiểm tra cấu trúc,
              lưu bản nháp và xuất Lesson Definition dưới dạng JSON.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={initialLesson.id}
              onChange={(event) => switchTemplate(event.target.value)}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold"
              aria-label="Chọn bài để biên soạn"
            >
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  Bài {template.lessonNumber}: {template.title}
                </option>
              ))}
            </select>
            <Link
              href="/"
              className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold hover:bg-slate-50"
            >
              ← Về thư viện
            </Link>
            <Link
              href="/content"
              className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold hover:bg-slate-50"
            >
              📚 Content Repository
            </Link>
            <button
              onClick={saveDraft}
              className="rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white"
            >
              Lưu bản nháp
            </button>
            <button
              onClick={() => downloadLessonJson(lesson)}
              className="rounded-2xl bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-700"
            >
              Xuất JSON
            </button>
            <button
              onClick={publishCurrentLesson}
              disabled={!validation.isValid}
              className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              🚀 Publish
            </button>
          </div>
        </header>

        <div className="mb-5 grid gap-3 sm:grid-cols-4">
          <Metric label="Teaching steps" value={lesson.steps.length} />
          <Metric
            label="Checkpoint"
            value={lesson.steps.filter((step) => step.action === "QUESTION").length}
          />
          <Metric label="Lỗi cấu trúc" value={validation.errors.length} />
          <Metric label="Cảnh báo" value={validation.warnings.length} />
        </div>

        <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr_1fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black">1. Metadata & mục tiêu</h2>

            <Field label="Tên bài">
              <input
                value={lesson.title}
                onChange={(event) => updateMeta("title", event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </Field>

            <Field label="Phụ đề">
              <textarea
                value={lesson.subtitle}
                onChange={(event) => updateMeta("subtitle", event.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </Field>

            <div className="grid grid-cols-3 gap-2">
              <Field label="Khối">
                <NumberInput value={lesson.grade} onChange={(value) => updateMeta("grade", value)} />
              </Field>
              <Field label="Chương">
                <NumberInput value={lesson.chapter} onChange={(value) => updateMeta("chapter", value)} />
              </Field>
              <Field label="Bài">
                <NumberInput value={lesson.lessonNumber} onChange={(value) => updateMeta("lessonNumber", value)} />
              </Field>
            </div>

            <Field label="Thời lượng">
              <NumberInput
                value={lesson.estimatedMinutes}
                onChange={(value) => updateMeta("estimatedMinutes", value)}
              />
            </Field>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-black text-slate-700">Mục tiêu</label>
                <button onClick={addObjective} className="text-xs font-black text-indigo-600">
                  + Thêm
                </button>
              </div>
              <div className="space-y-2">
                {lesson.objectives.map((objective, index) => (
                  <div key={index} className="flex gap-2">
                    <textarea
                      value={objective}
                      onChange={(event) => updateObjective(index, event.target.value)}
                      rows={2}
                      className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    />
                    <button
                      onClick={() => removeObjective(index)}
                      className="rounded-xl border border-rose-200 px-3 text-sm font-black text-rose-600"
                      aria-label="Xoá mục tiêu"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black">2. Teaching Steps</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-[190px_1fr]">
              <div className="space-y-2">
                {lesson.steps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => setSelectedStepId(step.id)}
                    className={`w-full rounded-2xl border p-3 text-left ${
                      selectedStep?.id === step.id
                        ? "border-indigo-300 bg-indigo-50"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <div className="text-[11px] font-black uppercase tracking-[0.1em] text-indigo-600">
                      {index + 1}. {step.action}
                    </div>
                    <div className="mt-1 text-sm font-bold">{step.title}</div>
                  </button>
                ))}
              </div>

              {selectedStep ? (
                <div>
                  <Field label="Teaching Action">
                    <select
                      value={selectedStep.action}
                      onChange={(event) =>
                        updateStep(selectedStep.id, {
                          action: event.target.value as LessonStep["action"],
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    >
                      {["WELCOME", "OBJECTIVE", "EXPLAIN", "EXAMPLE", "QUESTION", "SUMMARY"].map(
                        (action) => (
                          <option key={action} value={action}>
                            {action}
                          </option>
                        ),
                      )}
                    </select>
                  </Field>

                  <Field label="Tiêu đề bước">
                    <input
                      value={selectedStep.title}
                      onChange={(event) =>
                        updateStep(selectedStep.id, { title: event.target.value })
                      }
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    />
                  </Field>

                  <Field label="Nội dung">
                    <textarea
                      value={selectedStep.content}
                      onChange={(event) =>
                        updateStep(selectedStep.id, { content: event.target.value })
                      }
                      rows={6}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm leading-6"
                    />
                  </Field>

                  <Field label="Thời lượng bước">
                    <NumberInput
                      value={selectedStep.estimatedMinutes}
                      onChange={(value) =>
                        updateStep(selectedStep.id, { estimatedMinutes: value })
                      }
                    />
                  </Field>

                  {selectedStep.question && (
                    <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.1em] text-amber-700">
                        Question preview
                      </p>
                      <p className="mt-2 font-black">{selectedStep.question.prompt}</p>
                      <div className="mt-3 space-y-2">
                        {selectedStep.question.choices.map((choice) => (
                          <div
                            key={choice.id}
                            className={`rounded-xl border px-3 py-2 text-sm ${
                              choice.id === selectedStep.question?.correctChoiceId
                                ? "border-emerald-300 bg-emerald-50 font-bold text-emerald-800"
                                : "border-amber-200 bg-white"
                            }`}
                          >
                            {choice.id.toUpperCase()}. {choice.text}
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 text-xs leading-5 text-amber-800">
                        Ở Beta 1.2, chỉnh sâu câu hỏi/diagnostics qua JSON Editor để giữ
                        Studio gọn và tránh làm hỏng cấu trúc.
                      </p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-black">3. JSON & Validation</h2>
              <button
                onClick={applyJson}
                className="rounded-xl bg-indigo-50 px-3 py-2 text-xs font-black text-indigo-700"
              >
                Áp dụng JSON
              </button>
            </div>

            <textarea
              value={jsonText}
              onChange={(event) => setJsonText(event.target.value)}
              rows={25}
              spellCheck={false}
              className="mt-4 w-full rounded-2xl border border-slate-300 bg-slate-950 p-4 font-mono text-xs leading-5 text-slate-100 outline-none focus:border-indigo-500"
            />

            <div
              className={`mt-4 rounded-2xl border p-4 ${
                validation.isValid
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-rose-200 bg-rose-50"
              }`}
            >
              <p className="font-black">
                {validation.isValid
                  ? "✓ Lesson Definition hợp lệ"
                  : `Có ${validation.errors.length} lỗi cần sửa`}
              </p>

              {(validation.errors.length > 0 || validation.warnings.length > 0) && (
                <div className="mt-3 max-h-56 space-y-2 overflow-auto text-sm">
                  {[...validation.errors, ...validation.warnings].map((item, index) => (
                    <div key={`${item.path}-${index}`} className="rounded-xl bg-white/70 p-2">
                      <span className="font-black">
                        {item.level === "ERROR" ? "Lỗi" : "Cảnh báo"} · {item.path}
                      </span>
                      <p className="mt-0.5 text-slate-600">{item.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="mt-4 rounded-2xl bg-slate-100 p-3 text-sm font-semibold text-slate-600">
              {status}
            </p>

            <button
              onClick={resetDraft}
              className="mt-3 w-full rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700"
            >
              Khôi phục Lesson 1 mẫu
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="mt-4 block">
      <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.1em] text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function NumberInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <input
      type="number"
      min={1}
      value={value}
      onChange={(event) => onChange(Number(event.target.value) || 1)}
      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
    />
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-2xl font-black">{value}</div>
      <div className="mt-1 text-xs font-black uppercase tracking-[0.1em] text-slate-500">
        {label}
      </div>
    </div>
  );
}
