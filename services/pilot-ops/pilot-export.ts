"use client";

import type { CloudPilotStudent } from "@/types/cloud-pilot";
import { buildPilotOperationsSnapshot } from "@/services/pilot-ops/pilot-operations";

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportPilotJson(classCode: string, cloud: CloudPilotStudent[]) {
  const payload = {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    classCode,
    students: cloud,
  };
  downloadFile(
    `ai-math-tutor-${classCode}-pilot-backup.json`,
    JSON.stringify(payload, null, 2),
    "application/json;charset=utf-8",
  );
}

export function exportPilotSummaryCsv(classCode: string, cloud: CloudPilotStudent[]) {
  const snapshot = buildPilotOperationsSnapshot(classCode, cloud);
  const header = [
    "student_id",
    "display_name",
    "class_code",
    "sessions",
    "skills",
    "mastery",
    "accuracy",
    "open_mistakes",
    "freshness",
    "needs_attention",
    "updated_at",
  ];

  const rows = snapshot.students.map((item) => [
    item.studentId,
    item.displayName,
    item.classCode,
    String(item.sessions),
    String(item.skills),
    String(item.mastery),
    String(item.accuracy),
    String(item.openMistakes),
    item.freshness,
    item.needsAttention ? "YES" : "NO",
    item.updatedAt,
  ]);

  const csv = [header, ...rows]
    .map((row) =>
      row
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(","),
    )
    .join("\n");

  downloadFile(
    `ai-math-tutor-${classCode}-pilot-summary.csv`,
    "\uFEFF" + csv,
    "text/csv;charset=utf-8",
  );
}
