import type { LearningDnaProfile, LearningPace, SupportNeed } from "@/types/learning-dna";

const paceLabel: Record<LearningPace, string> = {
  FAST: "Phản hồi nhanh",
  BALANCED: "Nhịp học cân bằng",
  DELIBERATE: "Suy nghĩ kỹ",
};

const supportLabel: Record<SupportNeed, string> = {
  INDEPENDENT: "Tự học tốt",
  GUIDED: "Gợi ý vừa đủ",
  NEEDS_SUPPORT: "Cần chia nhỏ bước",
};

export function LearningDnaCard({ profile }: { profile: LearningDnaProfile }) {
  return (
    <section className="rounded-3xl border border-violet-100 bg-violet-50 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-600">
            Learning DNA · bản đầu
          </p>
          <h3 className="mt-2 text-xl font-black text-violet-950">
            AI đang học cách em học
          </h3>
        </div>
        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-violet-700">
          {profile.sessionsObserved} buổi quan sát
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DnaMetric label="Nhịp học" value={paceLabel[profile.pace]} />
        <DnaMetric label="Mức hỗ trợ" value={supportLabel[profile.supportNeed]} />
        <DnaMetric label="Đúng lần đầu" value={`${profile.firstTryRate}%`} />
        <DnaMetric label="Phản hồi TB" value={`${profile.averageResponseSeconds}s`} />
      </div>

      <p className="mt-4 text-sm font-semibold leading-6 text-violet-900">
        {profile.note}
      </p>
    </section>
  );
}

function DnaMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-violet-100 bg-white p-3.5">
      <p className="text-xs font-bold uppercase tracking-[0.1em] text-violet-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-slate-900">{value}</p>
    </div>
  );
}
