import type { ReasoningProblem } from "@/types/reasoning";

export type AdvancedLevel = "VAN_DUNG" | "SUY_LUAN" | "THU_THACH";

export type AdvancedMathProblem = ReasoningProblem & {
  level: AdvancedLevel;
  levelLabel: string;
  learningGoal: string;
  companionMessage: string;
};
