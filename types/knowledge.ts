export type DifficultyLevel =
  | "FOUNDATION"
  | "BASIC"
  | "APPLIED"
  | "ADVANCED";

export type KnowledgeNodeType =
  | "CHAPTER"
  | "LESSON"
  | "CONCEPT"
  | "SKILL";

export type KnowledgeSource = {
  id: string;
  title: string;
  sourceType: "SGK" | "SUPPLEMENT" | "ADVANCED";
  curriculum: string;
  grade: number;
  semester: 1 | 2;
  note?: string;
};

export type KnowledgeNode = {
  id: string;
  type: KnowledgeNodeType;
  title: string;
  description: string;
  grade: number;
  semester: 1 | 2;
  chapterId: string;
  lessonNumber?: number;
  order: number;
  difficulty: DifficultyLevel;
  prerequisites: string[];
  learningObjectives: string[];
  skills: string[];
  commonMistakes: string[];
  sourceIds: string[];
  status: "DRAFT" | "VERIFIED";
};

export type Chapter = {
  id: string;
  number: number;
  title: string;
  semester: 1 | 2;
  description: string;
  lessonIds: string[];
};
