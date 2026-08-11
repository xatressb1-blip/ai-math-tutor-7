"use client";

import { useMemo, useRef, useState } from "react";
import { QuestionCard } from "@/components/lesson/QuestionCard";
import {
  buildAdaptivePracticeReport,
  decideInitialAdaptiveDifficulty,
  formatAdaptiveDifficulty,
  rankAdaptiveSkills,
  selectAdaptiveExercise,
  updateAdaptiveDifficulty,
} from "@/services/exercise/adaptive-exercise-engine";
import {
  evaluateTeachingResponse,
  type TeachingFeedback,
} from "@/services/teaching/teaching-session-engine";
import type {
  AdaptiveDifficulty,
  AdaptiveExercise,
  AdaptivePracticeReport,
} from "@/types/adaptive-exercise";
import type { StudentBrainSnapshot } from "@/types/student";
import type { SessionAttempt } from "@/types/teaching-session";

const TARGET_QUESTIONS = 4;

export function AdaptivePractice({
  brain,
  sessionAttempts,
  skillNames,
  bank,
  onComplete,
}: {
  brain: StudentBrainSnapshot;
  sessionAttempts: SessionAttempt[];
  skillNames: string[];
  bank: AdaptiveExercise[];
  onComplete: (
    attempts: SessionAttempt[],
    report: AdaptivePracticeReport,
  ) => void;
}) {
  const defaultSkill = skillNames[0] ?? "Nhận biết số hữu tỉ";
  const rankedSkills = useMemo(
    () => rankAdaptiveSkills({ brain, attempts: sessionAttempts, skillNames }),
    [brain, sessionAttempts, skillNames],
  );
  const initialDecision = useMemo(
    () =>
      decideInitialAdaptiveDifficulty({
        brain,
        skillName: rankedSkills[0] ?? defaultSkill,
        attempts: sessionAttempts,
      }),
    [brain, defaultSkill, rankedSkills, sessionAttempts],
  );

  const [difficulty, setDifficulty] = useState<AdaptiveDifficulty>(
    initialDecision.difficulty,
  );
  const [startDifficulty] = useState<AdaptiveDifficulty>(
    initialDecision.difficulty,
  );
  const [questionNumber, setQuestionNumber] = useState(0);
  const [usedIds, setUsedIds] = useState<string[]>([]);
  const [adaptiveAttempts, setAdaptiveAttempts] = useState<SessionAttempt[]>([]);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [feedback, setFeedback] = useState<TeachingFeedback | null>(null);
  const questionStartedAt = useRef(Date.now());

  const currentSkill =
    rankedSkills[questionNumber % Math.max(1, rankedSkills.length)] ??
    initialDecision.focusSkill;

  const currentQuestion = useMemo(
    () =>
      selectAdaptiveExercise({
        bank,
        skillName: currentSkill,
        difficulty,
        usedIds,
      }) ??
      selectAdaptiveExercise({
        bank,
        skillName: rankedSkills[0] ?? currentSkill,
        difficulty,
        usedIds,
      }),
    [bank, currentSkill, difficulty, rankedSkills, usedIds],
  );

  const solved = Boolean(
    currentQuestion &&
      adaptiveAttempts.some(
        (attempt) => attempt.questionId === currentQuestion.id && attempt.isCorrect,
      ),
  );

  function checkAnswer() {
    if (!currentQuestion || !selectedChoiceId || solved) return;

    const nextAttemptNumber = attemptCount + 1;
    const responseSeconds = Math.max(
      1,
      Math.round((Date.now() - questionStartedAt.current) / 1000),
    );
    const result = evaluateTeachingResponse({
      question: currentQuestion,
      selectedChoiceId,
      attemptNumber: nextAttemptNumber,
      responseSeconds,
    });
    const attempt: SessionAttempt = {
      questionId: currentQuestion.id,
      skillName: currentQuestion.skillName,
      choiceId: selectedChoiceId,
      isCorrect: result.isCorrect,
      attemptNumber: nextAttemptNumber,
      responseSeconds,
      confidenceScore: result.confidenceScore,
      strategy: result.feedback.strategy,
      mistakeCategory: result.feedback.brainDecision.diagnosis?.category,
      diagnosisLabel: result.feedback.brainDecision.diagnosis?.label,
      evidenceSource: "ADAPTIVE",
    };

    setAdaptiveAttempts((items) => [...items, attempt]);
    setAttemptCount(nextAttemptNumber);
    setFeedback(result.feedback);

    if (!result.isCorrect) {
      setSelectedChoiceId(null);
      questionStartedAt.current = Date.now();
    }
  }

  function nextQuestion() {
    if (!currentQuestion || !solved) return;

    const questionAttempts = adaptiveAttempts.filter(
      (attempt) => attempt.questionId === currentQuestion.id,
    );
    const correctAttempt = questionAttempts.find((attempt) => attempt.isCorrect);
    const nextDifficulty = updateAdaptiveDifficulty({
      current: difficulty,
      solved: Boolean(correctAttempt),
      attemptCount: correctAttempt?.attemptNumber ?? Math.max(1, attemptCount),
      responseSeconds: correctAttempt?.responseSeconds ?? 90,
    });
    const nextUsedIds = [...usedIds, currentQuestion.id];
    const nextQuestionNumber = questionNumber + 1;

    if (nextQuestionNumber >= TARGET_QUESTIONS) {
      const report = buildAdaptivePracticeReport({
        focusSkills: rankedSkills.slice(0, 3),
        attempts: adaptiveAttempts,
        startDifficulty,
        endDifficulty: nextDifficulty,
      });
      onComplete(adaptiveAttempts, report);
      return;
    }

    setDifficulty(nextDifficulty);
    setUsedIds(nextUsedIds);
    setQuestionNumber(nextQuestionNumber);
    setSelectedChoiceId(null);
    setAttemptCount(0);
    setFeedback(null);
    questionStartedAt.current = Date.now();
  }

  if (!currentQuestion) {
    const report = buildAdaptivePracticeReport({
      focusSkills: rankedSkills.slice(0, 3),
      attempts: adaptiveAttempts,
      startDifficulty,
      endDifficulty: difficulty,
    });

    return (
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-black">Không còn câu hỏi phù hợp trong ngân hàng Demo.</h2>
        <button
          type="button"
          onClick={() => onComplete(adaptiveAttempts, report)}
          className="mt-5 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-black text-white"
        >
          Xem kết quả
        </button>
      </section>
    );
  }

  const progress = Math.round(((questionNumber + 1) / TARGET_QUESTIONS) * 100);

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-fuchsia-600">
            Adaptive Exercise Engine
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight">
            AI đang chọn bài vừa sức với em
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Trọng tâm hiện tại: <strong>{currentSkill}</strong>. {initialDecision.reason}
          </p>
        </div>
        <div className="rounded-2xl bg-fuchsia-50 px-4 py-3 text-right">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-fuchsia-500">
            Độ khó
          </p>
          <p className="mt-1 text-sm font-black text-fuchsia-900">
            {formatAdaptiveDifficulty(difficulty)} · L{difficulty}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>Câu thích ứng {questionNumber + 1}/{TARGET_QUESTIONS}</span>
          <span>{progress}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-fuchsia-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <QuestionCard
        question={currentQuestion}
        selectedChoiceId={selectedChoiceId}
        feedback={feedback}
        onSelect={setSelectedChoiceId}
        onCheck={checkAnswer}
        attemptCount={attemptCount}
        solved={solved}
      />

      <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-slate-600">
          {solved
            ? "AI sẽ dùng số lần thử và thời gian trả lời để quyết định câu tiếp theo khó hơn, giữ nguyên hay dễ hơn."
            : "Hãy tự làm trước. Nếu chưa đúng, hệ thống sẽ gợi ý theo từng tầng thay vì đưa đáp án ngay."}
        </p>
        <button
          type="button"
          disabled={!solved}
          onClick={nextQuestion}
          className="shrink-0 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {questionNumber + 1 >= TARGET_QUESTIONS ? "Hoàn thành luyện tập" : "Câu thích ứng tiếp →"}
        </button>
      </div>
    </section>
  );
}
