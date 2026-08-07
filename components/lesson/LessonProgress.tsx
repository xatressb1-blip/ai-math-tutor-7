export function LessonProgress({
  current,
  total,
  percent,
}: {
  current: number;
  total: number;
  percent: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-bold text-slate-600">
        <span>Bước {current}/{total}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
