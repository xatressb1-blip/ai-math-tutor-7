"use client";

import type { ClassAnalyticsSnapshot } from "@/types/teacher";

function quote(value: string | number | null): string {
  const text = value === null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export function classAnalyticsToCsv(
  analytics: ClassAnalyticsSnapshot,
): string {
  const header = [
    "Học sinh",
    "Lớp",
    "Nguồn",
    "Mastery",
    "Confidence",
    "Accuracy",
    "Reasoning",
    "Hint Dependency",
    "Phút học",
    "Buổi học",
    "Lỗi đang mở",
    "Mức hỗ trợ",
    "Kỹ năng mạnh",
    "Kỹ năng yếu",
    "Khuyến nghị",
  ];

  const rows = analytics.students.map((student) => [
    student.displayName,
    student.className,
    student.source,
    student.masteryAverage,
    student.confidenceAverage,
    student.accuracyAverage,
    student.reasoningScore,
    student.hintDependency,
    student.totalStudyMinutes,
    student.sessionCount,
    student.activeMistakes,
    student.supportLevel,
    student.strongestSkill ?? "",
    student.weakestSkill ?? "",
    student.recommendation,
  ]);

  return [header, ...rows]
    .map((row) => row.map((value) => quote(value)).join(","))
    .join("\n");
}

export function downloadClassAnalyticsCsv(
  analytics: ClassAnalyticsSnapshot,
): void {
  const csv = "\uFEFF" + classAnalyticsToCsv(analytics);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `class-${analytics.className}-analytics.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
