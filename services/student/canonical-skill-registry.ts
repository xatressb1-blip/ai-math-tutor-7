import type { StudentBrainSnapshot, StudentSkill } from "@/types/student";
import { mergeSkillEvidence, normalizeSkillEvidence, statusFromMasteryWithEvidence } from "@/services/student/mastery-integrity-policy";

export type CanonicalSkillDefinition = {
  skillId: string;
  displayName: string;
  lessonNumber: number;
  tier: "CORE" | "APPLIED" | "ENRICHMENT" | "ADVANCED_ONLY";
  aliases: string[];
};

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[.。]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const DEFINITIONS: CanonicalSkillDefinition[] = [
  { skillId:"L08_SUPPLEMENTARY_ANGLES", displayName:"Nhận diện góc kề bù", lessonNumber:8, tier:"CORE", aliases:["Nhận diện góc kề bù"] },
  { skillId:"L08_VERTICAL_ANGLES", displayName:"Tính chất góc đối đỉnh", lessonNumber:8, tier:"CORE", aliases:["Tính chất góc đối đỉnh"] },
  { skillId:"L08_ANGLE_BISECTOR", displayName:"Điều kiện tia phân giác", lessonNumber:8, tier:"CORE", aliases:["Điều kiện tia phân giác","Tính góc bằng tia phân giác"] },
  { skillId:"L09_PARALLEL_CRITERIA", displayName:"Điều kiện dấu hiệu song song", lessonNumber:9, tier:"CORE", aliases:["Điều kiện dấu hiệu song song"] },
  { skillId:"L09_ALT_INTERIOR_CRITERION", displayName:"Dấu hiệu so le trong", lessonNumber:9, tier:"CORE", aliases:["Dấu hiệu so le trong"] },
  { skillId:"L09_CORRESPONDING_CRITERION", displayName:"Dấu hiệu đồng vị", lessonNumber:9, tier:"CORE", aliases:["Dấu hiệu đồng vị"] },
  { skillId:"L10_EUCLID_AXIOM", displayName:"Tiên đề Euclid", lessonNumber:10, tier:"CORE", aliases:["Tiên đề Euclid"] },
  { skillId:"L10_PARALLEL_ANGLE_PROPERTIES", displayName:"Tính chất góc tạo bởi hai đường thẳng song song", lessonNumber:10, tier:"CORE", aliases:["Chiều suy luận song song → góc","Tính chất góc đồng vị","Tính chất góc so le trong"] },
  { skillId:"L10_PERPENDICULAR_PARALLEL", displayName:"Vuông góc với hai đường song song", lessonNumber:10, tier:"CORE", aliases:["Vuông góc với hai đường song song"] },
  { skillId:"L11_GIVEN_CONCLUSION", displayName:"Giả thiết và kết luận", lessonNumber:11, tier:"CORE", aliases:["Giả thiết và kết luận","Nhận biết giả thiết","Nhận biết kết luận"] },
  { skillId:"L11_PROOF_JUSTIFICATION", displayName:"Căn cứ của bước chứng minh", lessonNumber:11, tier:"CORE", aliases:["Căn cứ của bước chứng minh"] },
  { skillId:"L11_CIRCULAR_REASONING", displayName:"Phát hiện lập luận vòng tròn", lessonNumber:11, tier:"APPLIED", aliases:["Phát hiện lập luận vòng tròn"] },
  { skillId:"L12_TRIANGLE_ANGLE_SUM", displayName:"Tính góc còn lại của tam giác", lessonNumber:12, tier:"CORE", aliases:["Tính góc còn lại của tam giác","Giải thích định lí tổng ba góc trong tam giác bằng 180°"] },
  { skillId:"L12_EXTERIOR_ANGLE", displayName:"Góc ngoài của tam giác", lessonNumber:12, tier:"CORE", aliases:["Góc ngoài của tam giác","Vận dụng quan hệ góc ngoài trong bài toán đơn giản"] },
  { skillId:"L13_TRIANGLE_CORRESPONDENCE", displayName:"Xác định yếu tố tương ứng của hai tam giác bằng nhau", lessonNumber:13, tier:"CORE", aliases:["Xác định yếu tố tương ứng của hai tam giác bằng nhau","Nhận biết và viết đúng hai tam giác bằng nhau theo thứ tự tương ứng","Suy ra các yếu tố tương ứng và lập luận hình học đơn giản"] },
  { skillId:"L13_CONGRUENCE_SSS", displayName:"Trường hợp bằng nhau cạnh-cạnh-cạnh", lessonNumber:13, tier:"CORE", aliases:["Trường hợp bằng nhau cạnh-cạnh-cạnh","Trường hợp cạnh-cạnh-cạnh","Điều kiện c.c.c","Giải thích hai tam giác bằng nhau theo trường hợp c.c.c"] },
  { skillId:"L14_CONGRUENCE_SAS", displayName:"Trường hợp bằng nhau cạnh-góc-cạnh", lessonNumber:14, tier:"CORE", aliases:["Trường hợp bằng nhau cạnh-góc-cạnh","Trường hợp cạnh-góc-cạnh","Chứng minh hai tam giác bằng nhau theo c.g.c"] },
  { skillId:"L14_CONGRUENCE_ASA", displayName:"Trường hợp bằng nhau góc-cạnh-góc", lessonNumber:14, tier:"CORE", aliases:["Trường hợp bằng nhau góc-cạnh-góc","Trường hợp góc-cạnh-góc","Chứng minh hai tam giác bằng nhau theo g.c.g"] },
  { skillId:"L14_INCLUDED_ELEMENT", displayName:"Nhận biết góc xen giữa và cạnh xen giữa", lessonNumber:14, tier:"APPLIED", aliases:["Nhận biết góc xen giữa và cạnh xen giữa"] },
  { skillId:"L16_ISOSCELES_CONVERSE", displayName:"Định lí đảo của tam giác cân", lessonNumber:16, tier:"CORE", aliases:["Định lí đảo của tam giác cân"] },
  { skillId:"L16_PERP_BISECTOR_CONVERSE", displayName:"Tính chất đảo của đường trung trực", lessonNumber:16, tier:"CORE", aliases:["Tính chất đảo của đường trung trực"] },
  { skillId:"L17_DATA_CLASSIFICATION", displayName:"Phân loại dữ liệu", lessonNumber:17, tier:"CORE", aliases:["Phân loại dữ liệu"] },
  { skillId:"L17_REPRESENTATIVE_DATA", displayName:"Tính đại diện của dữ liệu", lessonNumber:17, tier:"CORE", aliases:["Tính đại diện của dữ liệu","Nhận biết tính đại diện của dữ liệu thu thập"] },
  { skillId:"L18_PIE_CHART_READ", displayName:"Đọc biểu đồ hình quạt tròn", lessonNumber:18, tier:"CORE", aliases:["Đọc biểu đồ hình quạt tròn","Đọc và mô tả dữ liệu từ biểu đồ hình quạt tròn"] },
  { skillId:"L18_PIE_CHART_COUNT", displayName:"Chuyển tỉ lệ thành số lượng", lessonNumber:18, tier:"CORE", aliases:["Chuyển tỉ lệ thành số lượng","Biểu diễn dữ liệu vào biểu đồ hình quạt tròn cho sẵn"] },
  { skillId:"L19_LINE_CHART_TREND", displayName:"Nhận xét xu hướng biểu đồ đoạn thẳng", lessonNumber:19, tier:"CORE", aliases:["Nhận xét xu hướng biểu đồ đoạn thẳng","Nhận ra xu hướng hoặc quy luật đơn giản từ biểu đồ"] },
  { skillId:"L19_LINE_CHART_READ", displayName:"Đọc biểu đồ đoạn thẳng", lessonNumber:19, tier:"CORE", aliases:["Đọc và mô tả dữ liệu từ biểu đồ đoạn thẳng","Đọc thang đo và phát hiện biểu đồ gây hiểu nhầm"] },
];

const aliasMap = new Map<string, CanonicalSkillDefinition>();
for (const item of DEFINITIONS) {
  for (const alias of [item.displayName, ...item.aliases]) aliasMap.set(normalize(alias), item);
}

export function resolveCanonicalSkill(skillName: string): CanonicalSkillDefinition | null {
  return aliasMap.get(normalize(skillName)) ?? null;
}

export function canonicalSkillId(skillName: string): string {
  return resolveCanonicalSkill(skillName)?.skillId ?? `LEGACY_${normalize(skillName).replace(/[^a-z0-9]+/g, "_").toUpperCase()}`;
}

export function canonicalSkillName(skillName: string): string {
  return resolveCanonicalSkill(skillName)?.displayName ?? skillName.replace(/[.。]+$/g, "").trim();
}

export function sameCanonicalSkill(a: string, b: string): boolean {
  return canonicalSkillId(a) === canonicalSkillId(b);
}

export function getCanonicalSkillDefinitions(): CanonicalSkillDefinition[] {
  return DEFINITIONS.map((item) => ({ ...item, aliases: [...item.aliases] }));
}


export function migrateBrainToCanonicalSkills(
  brain: StudentBrainSnapshot,
): StudentBrainSnapshot {
  const groups = new Map<string, StudentSkill[]>();
  for (const skill of brain.skills) {
    const id = skill.canonicalSkillId ?? canonicalSkillId(skill.skillName);
    const bucket = groups.get(id) ?? [];
    bucket.push(skill);
    groups.set(id, bucket);
  }

  const oldToNew = new Map<string, string>();
  const skills: StudentSkill[] = [];

  for (const [id, group] of groups) {
    const newest = [...group].sort(
      (a, b) =>
        new Date(b.lastPracticedAt ?? 0).getTime() -
        new Date(a.lastPracticedAt ?? 0).getTime(),
    )[0];
    let evidence = normalizeSkillEvidence(group[0]?.evidence, group[0]);
    for (let index = 1; index < group.length; index += 1) {
      const itemEvidence = normalizeSkillEvidence(group[index].evidence, group[index]);
      evidence = mergeSkillEvidence(evidence, itemEvidence);
    }
    const attempts = group.reduce((sum, item) => sum + item.attempts, 0);
    const correctAttempts = group.reduce(
      (sum, item) => sum + item.correctAttempts,
      0,
    );
    const masteryScore = Math.max(...group.map((item) => item.masteryScore));
    const confidence = attempts
      ? Math.round(
          group.reduce(
            (sum, item) => sum + item.confidence * Math.max(1, item.attempts),
            0,
          ) / group.reduce((sum, item) => sum + Math.max(1, item.attempts), 0),
        )
      : newest.confidence;
    const newSkillId = `skill-${id.toLowerCase()}`;
    for (const item of group) oldToNew.set(item.id, newSkillId);
    const canonicalEvidence = evidence ?? newest.evidence;
    skills.push({
      ...newest,
      id: newSkillId,
      skillName: canonicalSkillName(newest.skillName),
      canonicalSkillId: id,
      attempts,
      correctAttempts,
      masteryScore,
      confidence,
      status: canonicalEvidence
        ? statusFromMasteryWithEvidence(masteryScore, canonicalEvidence)
        : newest.status,
      evidence: canonicalEvidence,
    });
  }

  return {
    ...brain,
    skills,
    mistakes: brain.mistakes.map((mistake) => ({
      ...mistake,
      skillId: oldToNew.get(mistake.skillId) ?? mistake.skillId,
    })),
  };
}
