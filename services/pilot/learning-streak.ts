import type { LearningStreak } from "@/types/pilot-experience";

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function previousDateKey(key: string): string {
  const [year, month, day] = key.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() - 1);
  return dateKey(date);
}
export function calculateLearningStreak(dateKeys: string[]): LearningStreak {
  const unique = [...new Set(dateKeys)].sort();
  const today = dateKey(new Date());
  const set = new Set(unique);
  let currentStreak = 0;
  let cursor = set.has(today) ? today : previousDateKey(today);
  while (set.has(cursor)) {
    currentStreak += 1;
    cursor = previousDateKey(cursor);
  }
  let longestStreak = 0;
  let running = 0;
  let previous = "";
  for (const key of unique) {
    if (previous && previousDateKey(key) === previous) running += 1;
    else running = 1;
    longestStreak = Math.max(longestStreak, running);
    previous = key;
  }
  return {
    currentStreak,
    longestStreak,
    activeDays: unique.length,
    todayCompleted: set.has(today),
    recentDateKeys: unique.slice(-14).reverse(),
  };
}
