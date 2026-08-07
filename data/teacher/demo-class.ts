import { demoStudentBrain } from "@/data/student/demo-student";
import type { StudentBrainSnapshot } from "@/types/student";
import type { TeacherStudentRecord } from "@/types/teacher";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function makeStudent({
  id,
  name,
  masteryAdjust,
  confidenceAdjust,
  sessionMultiplier,
  mistakeAdjust,
}: {
  id: string;
  name: string;
  masteryAdjust: number;
  confidenceAdjust: number;
  sessionMultiplier: number;
  mistakeAdjust: number;
}): TeacherStudentRecord {
  const brain = clone(demoStudentBrain);
  brain.profile = {
    ...brain.profile,
    id,
    displayName: name,
    className: "7A",
  };

  brain.skills = brain.skills.map((skill, index) => {
    const mastery = Math.max(
      20,
      Math.min(98, skill.masteryScore + masteryAdjust + index * 2),
    );
    const confidence = Math.max(
      25,
      Math.min(98, skill.confidence + confidenceAdjust + index),
    );

    return {
      ...skill,
      id: `${skill.id}-${id}`,
      studentId: id,
      masteryScore: mastery,
      confidence,
      attempts: Math.max(4, Math.round(skill.attempts * sessionMultiplier)),
      correctAttempts: Math.max(
        2,
        Math.min(
          Math.round(skill.attempts * sessionMultiplier),
          Math.round(skill.correctAttempts * sessionMultiplier),
        ),
      ),
      status:
        mastery >= 85
          ? "MASTERED"
          : mastery >= 65
            ? "LEARNING"
            : "NEEDS_REVIEW",
    };
  });

  brain.mistakes = brain.mistakes.map((mistake, index) => ({
    ...mistake,
    id: `${mistake.id}-${id}`,
    studentId: id,
    skillId:
      brain.skills[Math.min(index + 1, brain.skills.length - 1)]?.id ??
      brain.skills[0].id,
    count: Math.max(1, mistake.count + mistakeAdjust + index),
  }));

  brain.sessions = brain.sessions.map((session, index) => {
    const accuracyBoost = Math.max(-2, Math.min(3, Math.round(masteryAdjust / 10)));
    const correct = Math.max(
      1,
      Math.min(
        session.questionsAttempted,
        session.questionsCorrect + accuracyBoost,
      ),
    );

    return {
      ...session,
      id: `${session.id}-${id}`,
      studentId: id,
      durationMinutes: Math.max(
        12,
        Math.round(session.durationMinutes * sessionMultiplier),
      ),
      questionsCorrect: correct,
      note:
        index === 0
          ? `${session.note} Confidence ${Math.max(
              30,
              Math.min(95, 65 + confidenceAdjust),
            )}/100.`
          : `Reasoning ${Math.max(
              35,
              Math.min(95, 68 + masteryAdjust),
            )}/100 · First attempt ${Math.max(
              30,
              Math.min(95, 64 + masteryAdjust),
            )}% · Hint dependency ${Math.max(
              8,
              Math.min(75, 32 - confidenceAdjust),
            )}% · Recovery ${Math.max(
              35,
              Math.min(100, 72 + masteryAdjust),
            )}%.`,
    };
  });

  return {
    id,
    displayName: name,
    className: "7A",
    source: "DEMO",
    brain,
  };
}

export const demoClassStudents: TeacherStudentRecord[] = [
  makeStudent({
    id: "student-demo-02",
    name: "Minh Anh",
    masteryAdjust: 10,
    confidenceAdjust: 12,
    sessionMultiplier: 1.15,
    mistakeAdjust: -2,
  }),
  makeStudent({
    id: "student-demo-03",
    name: "Gia Huy",
    masteryAdjust: 3,
    confidenceAdjust: 5,
    sessionMultiplier: 1.05,
    mistakeAdjust: -1,
  }),
  makeStudent({
    id: "student-demo-04",
    name: "Khánh Linh",
    masteryAdjust: -5,
    confidenceAdjust: -4,
    sessionMultiplier: 1.0,
    mistakeAdjust: 1,
  }),
  makeStudent({
    id: "student-demo-05",
    name: "Quốc Bảo",
    masteryAdjust: -13,
    confidenceAdjust: -10,
    sessionMultiplier: 0.9,
    mistakeAdjust: 2,
  }),
  makeStudent({
    id: "student-demo-06",
    name: "Thảo My",
    masteryAdjust: 7,
    confidenceAdjust: 8,
    sessionMultiplier: 1.1,
    mistakeAdjust: -1,
  }),
];
