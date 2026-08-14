"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AdaptivePractice } from "@/components/exercise/AdaptivePractice";
import { DemoFeedbackCard } from "@/components/demo/DemoFeedbackCard";
import { LessonProgress } from "@/components/lesson/LessonProgress";
import { QuestionCard } from "@/components/lesson/QuestionCard";
import { LearningDnaCard } from "@/components/student/LearningDnaCard";
import {
  getCurrentStep,
  getLessonProgress,
  getRemainingMinutes,
  isLastStep,
} from "@/services/lesson/lesson-engine";
import { getDemoStudentBrain } from "@/services/student/student-brain-service";
import { decideLearningPath } from "@/services/learning/learning-path-engine";
import {
  clearStudentBrainStorage,
  loadStudentBrainFromStorage,
  saveStudentBrainToStorage,
} from "@/services/student/student-brain-storage";
import { syncTeachingSessionToStudentBrain } from "@/services/student/student-brain-sync";
import { buildLearningDnaProfile } from "@/services/student/learning-dna-service";
import {
  clearLearningDnaStorage,
  loadLearningDnaFromStorage,
  saveLearningDnaToStorage,
} from "@/services/student/learning-dna-storage";
import {
  buildTeachingSessionSummary,
  evaluateTeachingResponse,
  type TeachingFeedback,
} from "@/services/teaching/teaching-session-engine";
import type { AdaptiveExercise, AdaptivePracticeReport } from "@/types/adaptive-exercise";
import type { LearningDnaProfile } from "@/types/learning-dna";
import type { LessonDefinition } from "@/types/lesson";
import type { StudentBrainSnapshot } from "@/types/student";
import type { SessionAttempt } from "@/types/teaching-session";

export function LessonPlayer({
  lesson,
  adaptiveBank = [],
  nextLesson,
}: {
  lesson: LessonDefinition;
  adaptiveBank?: AdaptiveExercise[];
  nextLesson?: LessonDefinition;
}) {
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [feedback, setFeedback] = useState<TeachingFeedback | null>(null);
  const [attempts, setAttempts] = useState<SessionAttempt[]>([]);
  const [completed, setCompleted] = useState(false);
  const [adaptiveMode, setAdaptiveMode] = useState(false);
  const [adaptiveReport, setAdaptiveReport] = useState<AdaptivePracticeReport | null>(null);
  const [studentBrain, setStudentBrain] = useState<StudentBrainSnapshot>(() =>
    getDemoStudentBrain(),
  );
  const [memoryReady, setMemoryReady] = useState(false);
  const [brainSynced, setBrainSynced] = useState(false);
  const [learningDna, setLearningDna] = useState<LearningDnaProfile | null>(null);
  const [dnaSynced, setDnaSynced] = useState(false);
  const sessionStartedAt = useRef(Date.now());
  const sessionStartedAtIso = useRef(new Date().toISOString());
  const questionStartedAt = useRef(Date.now());
  const sessionCompletedAt = useRef<number | null>(null);

  useEffect(() => {
    const savedBrain = loadStudentBrainFromStorage();
    if (savedBrain) setStudentBrain(savedBrain);
    const savedDna = loadLearningDnaFromStorage();
    if (savedDna) setLearningDna(savedDna);
    setMemoryReady(true);
  }, []);

  const step = getCurrentStep(lesson, stepIndex);
  const progress = getLessonProgress(lesson, stepIndex);
  const remainingMinutes = getRemainingMinutes(lesson, stepIndex);
  const question = step.question;
  const questionSolved = useMemo(() => {
    if (!question) return false;
    return attempts.some(
      (attempt) => attempt.questionId === question.id && attempt.isCorrect,
    );
  }, [attempts, question]);

  const lessonSkillNames = useMemo(
    () => [
      ...new Set(
        lesson.steps
          .map((item) => item.question?.skillName)
          .filter((item): item is string => Boolean(item)),
      ),
    ],
    [lesson],
  );
  const coreQuestions = lesson.steps.filter((item) => item.question).length;
  const adaptiveQuestions = adaptiveReport?.questionsCompleted ?? 0;
  const totalQuestions = coreQuestions + adaptiveQuestions;
  const elapsedSeconds = Math.max(
    1,
    Math.round(
      ((sessionCompletedAt.current ?? Date.now()) - sessionStartedAt.current) /
        1000,
    ),
  );
  const summary = buildTeachingSessionSummary({
    attempts,
    totalQuestions,
    elapsedSeconds,
  });

  const learningPath = decideLearningPath({
    currentLesson: lesson,
    nextLesson,
    summary,
  });

  useEffect(() => {
    if (!completed || brainSynced || !memoryReady) return;

    const completedAt = new Date(
      sessionCompletedAt.current ?? Date.now(),
    ).toISOString();
    const nextBrain = syncTeachingSessionToStudentBrain({
      brain: studentBrain,
      lesson,
      summary,
      attempts,
      startedAt: sessionStartedAtIso.current,
      completedAt,
    });

    setStudentBrain(nextBrain);
    saveStudentBrainToStorage(nextBrain);
    setBrainSynced(true);
  }, [
    attempts,
    brainSynced,
    completed,
    lesson,
    memoryReady,
    studentBrain,
    summary,
  ]);

  useEffect(() => {
    if (!completed || dnaSynced || !memoryReady) return;

    const nextDna = buildLearningDnaProfile({
      studentId: studentBrain.profile.id,
      attempts,
      summary,
      previous: learningDna,
    });
    setLearningDna(nextDna);
    saveLearningDnaToStorage(nextDna);
    setDnaSynced(true);
  }, [
    attempts,
    completed,
    dnaSynced,
    learningDna,
    memoryReady,
    studentBrain.profile.id,
    summary,
  ]);

  function resetQuestionState() {
    setSelectedChoiceId(null);
    setAttemptCount(0);
    setFeedback(null);
    questionStartedAt.current = Date.now();
  }

  function goNext() {
    if (isLastStep(lesson, stepIndex)) {
      if (adaptiveBank.length > 0) {
        setAdaptiveMode(true);
      } else {
        sessionCompletedAt.current = Date.now();
        setCompleted(true);
      }
      return;
    }
    setStepIndex((value) => value + 1);
    resetQuestionState();
  }

  function checkAnswer() {
    if (!question || !selectedChoiceId || questionSolved) return;

    const nextAttempt = attemptCount + 1;
    const responseSeconds = Math.max(
      1,
      Math.round((Date.now() - questionStartedAt.current) / 1000),
    );
    const result = evaluateTeachingResponse({
      question,
      selectedChoiceId,
      attemptNumber: nextAttempt,
      responseSeconds,
    });

    setAttempts((items) => [
      ...items,
      {
        questionId: question.id,
        skillName: question.skillName,
        choiceId: selectedChoiceId,
        isCorrect: result.isCorrect,
        attemptNumber: nextAttempt,
        responseSeconds,
        confidenceScore: result.confidenceScore,
        strategy: result.feedback.strategy,
        mistakeCategory: result.feedback.brainDecision.diagnosis?.category,
        diagnosisLabel: result.feedback.brainDecision.diagnosis?.label,
        evidenceSource: "LESSON_CORE",
      },
    ]);
    setAttemptCount(nextAttempt);
    setFeedback(result.feedback);

    if (!result.isCorrect) {
      setSelectedChoiceId(null);
      questionStartedAt.current = Date.now();
    }
  }

  function finishAdaptivePractice(
    nextAttempts: SessionAttempt[],
    report: AdaptivePracticeReport,
  ) {
    setAttempts((items) => [...items, ...nextAttempts]);
    setAdaptiveReport(report);
    setAdaptiveMode(false);
    sessionCompletedAt.current = Date.now();
    setCompleted(true);
  }

  function restartLesson() {
    setStarted(true);
    setStepIndex(0);
    setAttempts([]);
    setCompleted(false);
    setAdaptiveMode(false);
    setAdaptiveReport(null);
    setBrainSynced(false);
    setDnaSynced(false);
    sessionCompletedAt.current = null;
    sessionStartedAt.current = Date.now();
    sessionStartedAtIso.current = new Date().toISOString();
    resetQuestionState();
  }

  function resetStudentBrain() {
    const baseline = getDemoStudentBrain();
    clearStudentBrainStorage();
    clearLearningDnaStorage();
    saveStudentBrainToStorage(baseline);
    setStudentBrain(baseline);
    setLearningDna(null);
    setBrainSynced(true);
    setDnaSynced(true);
  }

  if (!started) {
    return (
      <main className="min-h-screen bg-[#f6f8fc] px-4 py-6 text-slate-950 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
            <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
              <section>
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-indigo-700">
                  Beta 1.6 · Chapter Learning Path
                </div>
                <h1 className="mt-5 max-w-2xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                  Chào em, {studentBrain.profile.displayName}! 👋
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  Hôm nay Math Mentor AI sẽ học cùng em Bài {lesson.lessonNumber}: <strong>{lesson.title}</strong>.
                  Em không cần làm thật nhanh; điều quan trọng là hiểu và tự làm được.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <StartMetric value={`~${lesson.estimatedMinutes} phút`} label="Thời lượng" />
                  <StartMetric value={`${lesson.steps.filter((item) => item.question).length} checkpoint`} label="Kiểm tra nhanh" />
                  <StartMetric value={`${studentBrain.sessions.length} buổi`} label="AI đang nhớ" />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStarted(true);
                    sessionStartedAt.current = Date.now();
                    sessionStartedAtIso.current = new Date().toISOString();
                    questionStartedAt.current = Date.now();
                  }}
                  className="mt-8 rounded-2xl bg-slate-950 px-7 py-4 text-base font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5"
                >
                  Bắt đầu buổi học →
                </button>
              </section>

              <aside className="rounded-[1.75rem] bg-slate-950 p-6 text-white">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-indigo-300">
                  Hôm nay em sẽ làm được
                </p>
                <div className="mt-5 space-y-4">
                  {lesson.objectives.map((objective, index) => (
                    <div key={objective} className="flex items-start gap-3">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-white text-xs font-black text-slate-950">
                        {index + 1}
                      </span>
                      <p className="text-sm leading-6 text-slate-200">{objective}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-black">🧠 AI nhớ gì về em?</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {learningDna
                      ? learningDna.note
                      : "Đây là dữ liệu Demo. Sau mỗi buổi, AI sẽ ghi nhớ tiến độ và dần hiểu nhịp học của em."}
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (adaptiveMode) {
    return (
      <main className="min-h-screen bg-[#f6f8fc] px-4 py-5 text-slate-950 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-5xl">
          <header className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-fuchsia-600">
                  Math Mentor AI · Beta 1.6
                </p>
                <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                  Luyện tập thích ứng · Bài {lesson.lessonNumber}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Câu hỏi được chọn theo hồ sơ học tập AI và kết quả em vừa học.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-indigo-300">
                  Student Brain
                </p>
                <p className="mt-1 text-sm font-black">
                  {studentBrain.sessions.length} buổi · {studentBrain.skills.length} kỹ năng
                </p>
              </div>
            </div>
          </header>

          <div className="mt-6">
            <AdaptivePractice
              brain={studentBrain}
              sessionAttempts={attempts}
              skillNames={lessonSkillNames}
              bank={adaptiveBank}
              onComplete={finishAdaptivePractice}
            />
          </div>
        </div>
      </main>
    );
  }

  if (completed) {
    const lessonSkills = studentBrain.skills.filter(
      (skill) => skill.knowledgeNodeId === lesson.knowledgeNodeId,
    );
    const latestSession = studentBrain.sessions.at(-1);

    return (
      <main className="min-h-screen bg-[#f6f8fc] px-5 py-8 text-slate-950 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-10">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-3xl">
              ✓
            </div>
            <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-emerald-600">
              Đã cập nhật hồ sơ học tập AI
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight">
              Em đã hoàn thành bài học!
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Kết quả buổi học đã được cập nhật vào hồ sơ học tập AI và lưu trên
              trình duyệt. Khi tải lại trang, Math Mentor AI vẫn nhớ tiến độ này.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <ResultStat value={`${summary.score}/100`} label="Điểm hoàn thành" />
              <ResultStat
                value={`${summary.confidenceScore}/100`}
                label="Mức tự tin"
              />
              <ResultStat
                value={`${summary.firstTryCorrect}/${summary.totalQuestions}`}
                label="Đúng lần đầu"
              />
              <ResultStat
                value={`${studentBrain.sessions.length}`}
                label="Buổi đã ghi nhớ"
              />
            </div>

            <div className="mt-7 rounded-3xl border border-indigo-100 bg-indigo-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-indigo-950">
                    🧠 Hồ sơ học tập AI đã cập nhật
                  </p>
                  <p className="mt-1 text-sm leading-6 text-indigo-800">
                    {brainSynced
                      ? "Đã lưu thành công vào localStorage. Hãy tải lại trang để kiểm tra AI vẫn nhớ."
                      : "Đang hoàn tất lưu dữ liệu..."}
                  </p>
                </div>
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-indigo-700">
                  {studentBrain.profile.displayName}
                </span>
              </div>
            </div>

            <div className="mt-7">
              <p className="text-sm font-black text-slate-900">
                Hồ sơ kỹ năng sau buổi học
              </p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {lessonSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-black text-slate-800">
                        {skill.skillName}
                      </p>
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-slate-600">
                        C {skill.confidence}
                      </span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-slate-950"
                        style={{ width: `${skill.masteryScore}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs font-semibold text-slate-500">
                      Thành thạo {skill.masteryScore}/100 · {skill.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-7 grid gap-4 lg:grid-cols-2">
              <InsightCard
                title="Điểm mạnh hôm nay"
                icon="⭐"
                emptyText="Chưa đủ dữ liệu để kết luận. Em cứ tiếp tục luyện nhé."
                items={summary.strengths}
                tone="good"
              />
              <InsightCard
                title="AI đề xuất ôn thêm"
                icon="🎯"
                emptyText="Không có kỹ năng nào cần ưu tiên ôn lại trong buổi này."
                items={summary.reviewSkills}
                tone="review"
              />

              <div className="rounded-2xl bg-violet-50 p-5 md:col-span-2">
                <p className="text-sm font-black text-violet-950">
                  🧠 Teaching Brain nhìn thấy gì?
                </p>
                {summary.diagnosticInsights.length ? (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {summary.diagnosticInsights.slice(0, 4).map((insight) => (
                      <div key={`${insight.category}-${insight.label}`} className="rounded-xl bg-white p-3">
                        <p className="text-xs font-black uppercase tracking-[0.1em] text-violet-600">
                          {insight.category} · {insight.count} lần
                        </p>
                        <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">
                          {insight.label}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm leading-6 text-violet-800">
                    Buổi này chưa có lỗi đủ rõ để Teaching Brain tạo chẩn đoán.
                  </p>
                )}
              </div>
            </div>

            {adaptiveReport && (
              <div className="mt-7 rounded-3xl border border-fuchsia-100 bg-fuchsia-50 p-5">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-fuchsia-600">
                  Adaptive Exercise Report
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <ResultStat
                    value={`${adaptiveReport.questionsCompleted}`}
                    label="Câu thích ứng"
                  />
                  <ResultStat
                    value={`${adaptiveReport.firstTryCorrect}/${adaptiveReport.questionsCompleted}`}
                    label="Đúng lần đầu"
                  />
                  <ResultStat
                    value={`L${adaptiveReport.startDifficulty} → L${adaptiveReport.endDifficulty}`}
                    label="Độ khó"
                  />
                </div>
                <p className="mt-4 text-sm font-semibold leading-6 text-fuchsia-900">
                  {adaptiveReport.message}
                </p>
                <p className="mt-2 text-sm leading-6 text-fuchsia-800">
                  AI ưu tiên: {adaptiveReport.focusSkills.join(" · ")}
                </p>
              </div>
            )}

            {latestSession && (
              <div className="mt-7 rounded-2xl border border-slate-200 p-5">
                <p className="text-sm font-black text-slate-900">
                  Learning History mới nhất
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {latestSession.note}
                </p>
              </div>
            )}

            <div className="mt-7 rounded-3xl bg-slate-950 p-6 text-white">
              <p className="text-xs font-black uppercase tracking-[0.15em] text-indigo-300">
                Lời nhắn từ Math Mentor AI
              </p>
              <p className="mt-3 text-lg font-black leading-7">
                {summary.score >= 85
                  ? "Em đã nắm phần nền tảng rất tốt. Buổi sau mình có thể tăng thử thách một chút."
                  : summary.score >= 65
                    ? "Em đang đi đúng hướng. AI sẽ giữ nhịp vừa sức và cho thêm vài câu củng cố ở phần còn chưa chắc."
                    : "Không cần vội. Buổi sau AI sẽ chia nhỏ hơn, ôn lại phần nền và giúp em tự làm từng bước."}
              </p>
            </div>

            {learningDna && (
              <div className="mt-7">
                <LearningDnaCard profile={learningDna} />
              </div>
            )}

            <div className="mt-7 rounded-3xl border border-cyan-100 bg-cyan-50 p-5">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-cyan-700">
                Learning Path Engine
              </p>
              <h3 className="mt-2 text-xl font-black text-cyan-950">
                {learningPath.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-cyan-900">
                {learningPath.message}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {learningPath.action === "ADVANCE" &&
                  learningPath.nextLessonId && (
                    <Link
                      href={`/learn/${learningPath.nextLessonId}`}
                      className="rounded-2xl bg-cyan-950 px-5 py-3 text-sm font-black text-white"
                    >
                      Học tiếp Bài {nextLesson?.lessonNumber} →
                    </Link>
                  )}

                {learningPath.action === "REVIEW_CURRENT" && (
                  <button
                    type="button"
                    onClick={restartLesson}
                    className="rounded-2xl bg-cyan-950 px-5 py-3 text-sm font-black text-white"
                  >
                    Ôn lại bài này
                  </button>
                )}

                <Link
                  href="/"
                  className="rounded-2xl border border-cyan-200 bg-white px-5 py-3 text-sm font-black text-cyan-900"
                >
                  Về thư viện
                </Link>
              </div>
            </div>

            <div className="mt-7">
              <DemoFeedbackCard />
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={restartLesson}
                className="rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-black text-white"
              >
                Học lại từ đầu
              </button>
              <button
                type="button"
                onClick={resetStudentBrain}
                className="rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-black text-slate-700"
              >
                Đặt lại dữ liệu Demo
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8fc] px-4 py-5 text-slate-950 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <header className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-indigo-600">
                Math Mentor AI · Beta 1.6
              </p>
              <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                Bài {lesson.lessonNumber}. {lesson.title}
              </h1>
              <p className="mt-1 text-sm text-slate-500">{lesson.subtitle}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <HeaderMetric label="Còn lại" value={`~${remainingMinutes} phút`} />
              <HeaderMetric
                label="Bộ nhớ"
                value={memoryReady ? `${studentBrain.sessions.length} buổi` : "..."}
              />
            </div>
          </div>
          <div className="mt-6">
            <LessonProgress
              current={stepIndex + 1}
              total={lesson.steps.length}
              percent={progress}
            />
          </div>
        </header>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.72fr_0.28fr]">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-950 text-xl text-white">
                🤖
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-indigo-600">
                  {formatAction(step.action)}
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-tight">
                  {step.title}
                </h2>
              </div>
            </div>

            <p className="mt-6 text-base leading-8 text-slate-700 sm:text-lg">
              {step.content}
            </p>

            {question ? (
              <QuestionCard
                question={question}
                selectedChoiceId={selectedChoiceId}
                onSelect={setSelectedChoiceId}
                onCheck={checkAnswer}
                feedback={feedback}
                attemptCount={attemptCount}
                solved={questionSolved}
              />
            ) : null}

            <div className="mt-7 flex justify-end">
              <button
                type="button"
                onClick={goNext}
                disabled={Boolean(question && !questionSolved)}
                className="rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isLastStep(lesson, stepIndex)
                  ? "Hoàn thành buổi học"
                  : "Tiếp tục →"}
              </button>
            </div>
          </article>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-indigo-600">
                Mục tiêu
              </p>
              <div className="mt-4 space-y-3">
                {lesson.objectives.map((objective) => (
                  <div
                    key={objective}
                    className="flex items-start gap-2 text-sm leading-6 text-slate-700"
                  >
                    <span className="font-black text-emerald-600">✓</span>
                    <span>{objective}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-slate-950 p-5 text-white">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-indigo-300">
                Student Brain
              </p>
              <p className="mt-3 text-sm font-black">
                {studentBrain.profile.displayName}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {memoryReady
                  ? `AI đang nhớ ${studentBrain.sessions.length} buổi học và ${studentBrain.skills.length} kỹ năng.`
                  : "Đang tải bộ nhớ học tập..."}
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function HeaderMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-100 px-4 py-3 text-right">
      <div className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-black text-slate-900">{value}</div>
    </div>
  );
}

function StartMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-lg font-black text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
        {label}
      </p>
    </div>
  );
}

function ResultStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xl font-black text-slate-950">{value}</div>
      <div className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
        {label}
      </div>
    </div>
  );
}

function InsightCard({
  title,
  icon,
  items,
  emptyText,
  tone,
}: {
  title: string;
  icon: string;
  items: string[];
  emptyText: string;
  tone: "good" | "review";
}) {
  return (
    <div
      className={`rounded-2xl p-5 ${
        tone === "good" ? "bg-emerald-50" : "bg-amber-50"
      }`}
    >
      <p
        className={`text-sm font-black ${
          tone === "good" ? "text-emerald-900" : "text-amber-900"
        }`}
      >
        {icon} {title}
      </p>
      {items.length ? (
        <div className="mt-3 space-y-2">
          {items.map((item) => (
            <p
              key={item}
              className={`text-sm font-semibold ${
                tone === "good" ? "text-emerald-800" : "text-amber-800"
              }`}
            >
              • {item}
            </p>
          ))}
        </div>
      ) : (
        <p
          className={`mt-3 text-sm leading-6 ${
            tone === "good" ? "text-emerald-800" : "text-amber-800"
          }`}
        >
          {emptyText}
        </p>
      )}
    </div>
  );
}

function formatAction(action: string): string {
  const labels: Record<string, string> = {
    WELCOME: "Khởi động",
    OBJECTIVE: "Mục tiêu",
    EXPLAIN: "Giải thích",
    EXAMPLE: "Ví dụ",
    QUESTION: "Checkpoint",
    SUMMARY: "Tổng kết",
  };
  return labels[action] ?? action;
}
