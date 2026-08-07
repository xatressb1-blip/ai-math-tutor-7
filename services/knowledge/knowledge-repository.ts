import { chapter1, chapter1KnowledgeNodes } from "@/data/knowledge/chapter-1";
import { knowledgeSources } from "@/data/knowledge/sources";
import type { Chapter, KnowledgeNode, KnowledgeSource } from "@/types/knowledge";

const chapters: Chapter[] = [chapter1];
const nodes: KnowledgeNode[] = [...chapter1KnowledgeNodes];

export function getAllChapters(): Chapter[] {
  return chapters;
}

export function getAllKnowledgeNodes(): KnowledgeNode[] {
  return nodes;
}

export function getChapterById(id: string): Chapter | undefined {
  return chapters.find((chapter) => chapter.id === id);
}

export function getLessonsByChapterId(chapterId: string): KnowledgeNode[] {
  return nodes
    .filter((node) => node.chapterId === chapterId && node.type === "LESSON")
    .sort((a, b) => a.order - b.order);
}

export function getKnowledgeNodeById(id: string): KnowledgeNode | undefined {
  return nodes.find((node) => node.id === id);
}

export function getKnowledgeSources(): KnowledgeSource[] {
  return knowledgeSources;
}

export function getKnowledgeStats() {
  return {
    chapters: chapters.length,
    lessons: nodes.filter((node) => node.type === "LESSON").length,
    skills: nodes.reduce((total, node) => total + node.skills.length, 0),
    verifiedNodes: nodes.filter((node) => node.status === "VERIFIED").length,
    sources: knowledgeSources.length,
  };
}
