"use client";

import type { PilotChecklistItem } from "@/types/pilot-operations";

const KEY = "math-mentor-ai:pilot-ops-checklist:v1";

const defaults: PilotChecklistItem[] = [
  { id: "before-cloud", phase: "BEFORE", label: "Cloud Activation hiển thị 3 READY", done: false },
  { id: "before-codes", phase: "BEFORE", label: "Đã cấp mã lớp + mã HS cho nhóm Pilot", done: false },
  { id: "before-demo", phase: "BEFORE", label: "Đã test Pull/Push bằng Học Sinh Demo", done: false },
  { id: "before-devices", phase: "BEFORE", label: "HS có trình duyệt/thiết bị sẵn sàng", done: false },
  { id: "during-onboard", phase: "DURING", label: "HS onboarding và Pull hồ sơ trước khi học", done: false },
  { id: "during-observe", phase: "DURING", label: "Quan sát lỗi khó hiểu / mất mã / đổi thiết bị", done: false },
  { id: "during-push", phase: "DURING", label: "HS Push cuối phiên thành công", done: false },
  { id: "after-refresh", phase: "AFTER", label: "Teacher tải lại Cloud Roster sau buổi Pilot", done: false },
  { id: "after-export", phase: "AFTER", label: "Đã export backup dữ liệu Pilot", done: false },
  { id: "after-notes", phase: "AFTER", label: "Đã ghi lại vấn đề cần sửa cho sprint tiếp theo", done: false },
];

export function loadPilotChecklist(): PilotChecklistItem[] {
  if (typeof window === "undefined") return defaults;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return defaults;
  try {
    const parsed = JSON.parse(raw) as PilotChecklistItem[];
    return Array.isArray(parsed) ? parsed : defaults;
  } catch {
    return defaults;
  }
}

export function savePilotChecklist(items: PilotChecklistItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
}

export function resetPilotChecklist(): PilotChecklistItem[] {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(defaults));
  }
  return defaults;
}
