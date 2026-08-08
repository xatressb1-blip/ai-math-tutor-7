import type { MultiStudentWorkspace } from "@/types/multi-student";

/**
 * Cloud-ready contract for the next phase.
 * Beta 2.6 intentionally ships with localStorage only.
 * A future database adapter should implement these operations without changing UI consumers.
 */
export type CloudStudentRepository = {
  pullWorkspace(ownerId: string): Promise<MultiStudentWorkspace | null>;
  pushWorkspace(ownerId: string, workspace: MultiStudentWorkspace): Promise<void>;
};

export const MULTI_STUDENT_SCHEMA_VERSION = 1;
