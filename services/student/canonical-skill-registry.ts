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
  { skillId:"L01_RATIONAL_RECOGNITION", displayName:"Nhận biết số hữu tỉ", lessonNumber:1, tier:"CORE", aliases:["Nhận biết số hữu tỉ","Phân số cơ bản"] },
  { skillId:"L01_RATIONAL_COMPARISON", displayName:"So sánh số hữu tỉ", lessonNumber:1, tier:"CORE", aliases:["So sánh số hữu tỉ","Số nguyên và dấu"] },
  { skillId:"L01_RATIONAL_OPPOSITE", displayName:"Số đối của số hữu tỉ", lessonNumber:1, tier:"CORE", aliases:["Số đối của số hữu tỉ","Số đối"] },
  { skillId:"L01_NUMBER_LINE", displayName:"Biểu diễn trên trục số", lessonNumber:1, tier:"CORE", aliases:["Biểu diễn trên trục số"] },

  { skillId:"L02_RATIONAL_ADD_SUB", displayName:"Cộng trừ số hữu tỉ", lessonNumber:2, tier:"CORE", aliases:["Cộng trừ số hữu tỉ","Phép tính phân số"] },
  { skillId:"L02_RATIONAL_MUL_DIV", displayName:"Nhân chia số hữu tỉ", lessonNumber:2, tier:"CORE", aliases:["Nhân chia số hữu tỉ"] },

  { skillId:"L03_POWER", displayName:"Tính lũy thừa", lessonNumber:3, tier:"CORE", aliases:["Tính lũy thừa"] },
  { skillId:"L03_POWER_PRODUCT_QUOTIENT", displayName:"Nhân chia lũy thừa cùng cơ số", lessonNumber:3, tier:"CORE", aliases:["Nhân chia lũy thừa cùng cơ số"] },
  { skillId:"L03_POWER_OF_POWER", displayName:"Lũy thừa của lũy thừa", lessonNumber:3, tier:"CORE", aliases:["Lũy thừa của lũy thừa"] },

  { skillId:"L04_OPERATION_ORDER", displayName:"Thứ tự phép tính", lessonNumber:4, tier:"CORE", aliases:["Thứ tự phép tính"] },
  { skillId:"L04_TRANSPOSE_RULE", displayName:"Quy tắc chuyển vế", lessonNumber:4, tier:"CORE", aliases:["Quy tắc chuyển vế"] },

  { skillId:"L05_REPEATING_DECIMAL", displayName:"Nhận biết số thập phân tuần hoàn", lessonNumber:5, tier:"CORE", aliases:["Nhận biết số thập phân tuần hoàn","Số thập phân tuần hoàn"] },
  { skillId:"L05_ROUNDING", displayName:"Làm tròn theo độ chính xác", lessonNumber:5, tier:"CORE", aliases:["Làm tròn theo độ chính xác"] },

  { skillId:"L06_ARITHMETIC_SQRT", displayName:"Căn bậc hai số học", lessonNumber:6, tier:"CORE", aliases:["Căn bậc hai số học"] },
  { skillId:"L06_IRRATIONAL_RECOGNITION", displayName:"Nhận biết số vô tỉ", lessonNumber:6, tier:"CORE", aliases:["Nhận biết số vô tỉ"] },

  { skillId:"L07_REAL_RECOGNITION", displayName:"Nhận biết số thực", lessonNumber:7, tier:"CORE", aliases:["Nhận biết số thực"] },
  { skillId:"L07_REAL_COMPARISON", displayName:"So sánh số thực", lessonNumber:7, tier:"CORE", aliases:["So sánh số thực"] },
  { skillId:"L07_REAL_OPPOSITE", displayName:"Số đối của số thực", lessonNumber:7, tier:"CORE", aliases:["Số đối của số thực"] },
  { skillId:"L07_ABSOLUTE_VALUE", displayName:"Giá trị tuyệt đối", lessonNumber:7, tier:"CORE", aliases:["Giá trị tuyệt đối"] },
  { skillId:"L07_REAL_NUMBER_LINE", displayName:"Biểu diễn số thực trên trục số", lessonNumber:7, tier:"CORE", aliases:["Biểu diễn số thực trên trục số"] },

  { skillId:"L08_SUPPLEMENTARY_ANGLES", displayName:"Nhận diện góc kề bù", lessonNumber:8, tier:"CORE", aliases:["Nhận diện góc kề bù"] },
  { skillId:"L08_VERTICAL_ANGLES", displayName:"Tính chất góc đối đỉnh", lessonNumber:8, tier:"CORE", aliases:["Tính chất góc đối đỉnh"] },
  { skillId:"L08_ANGLE_BISECTOR", displayName:"Điều kiện tia phân giác", lessonNumber:8, tier:"CORE", aliases:["Điều kiện tia phân giác","Tính góc bằng tia phân giác"] },

  { skillId:"L09_PARALLEL_CRITERIA", displayName:"Điều kiện dấu hiệu song song", lessonNumber:9, tier:"CORE", aliases:["Điều kiện dấu hiệu song song","Phân biệt dấu hiệu và tính chất"] },
  { skillId:"L09_ALT_INTERIOR_CRITERION", displayName:"Dấu hiệu so le trong", lessonNumber:9, tier:"CORE", aliases:["Dấu hiệu so le trong"] },
  { skillId:"L09_CORRESPONDING_CRITERION", displayName:"Dấu hiệu đồng vị", lessonNumber:9, tier:"CORE", aliases:["Dấu hiệu đồng vị"] },

  { skillId:"L10_EUCLID_AXIOM", displayName:"Tiên đề Euclid", lessonNumber:10, tier:"CORE", aliases:["Tiên đề Euclid"] },
  { skillId:"L10_PARALLEL_ANGLE_PROPERTIES", displayName:"Tính chất góc tạo bởi hai đường thẳng song song", lessonNumber:10, tier:"CORE", aliases:["Chiều suy luận song song → góc","Tính chất góc đồng vị","Tính chất góc so le trong"] },
  { skillId:"L10_PERPENDICULAR_PARALLEL", displayName:"Vuông góc với hai đường song song", lessonNumber:10, tier:"CORE", aliases:["Vuông góc với hai đường song song"] },

  { skillId:"L11_GIVEN_CONCLUSION", displayName:"Giả thiết và kết luận", lessonNumber:11, tier:"CORE", aliases:["Giả thiết và kết luận","Nhận biết giả thiết","Nhận biết kết luận"] },
  { skillId:"L11_PROOF_JUSTIFICATION", displayName:"Căn cứ của bước chứng minh", lessonNumber:11, tier:"CORE", aliases:["Căn cứ của bước chứng minh"] },
  { skillId:"L11_CIRCULAR_REASONING", displayName:"Phát hiện lập luận vòng tròn", lessonNumber:11, tier:"APPLIED", aliases:["Phát hiện lập luận vòng tròn"] },
  { skillId:"L11_CONVERSE_ERROR", displayName:"Phát hiện lỗi đảo mệnh đề", lessonNumber:11, tier:"APPLIED", aliases:["Phát hiện lỗi đảo mệnh đề"] },

  { skillId:"L12_TRIANGLE_ANGLE_SUM", displayName:"Tính góc còn lại của tam giác", lessonNumber:12, tier:"CORE", aliases:["Tính góc còn lại của tam giác","Giải thích định lí tổng ba góc trong tam giác bằng 180°"] },
  { skillId:"L12_EXTERIOR_ANGLE", displayName:"Góc ngoài của tam giác", lessonNumber:12, tier:"CORE", aliases:["Góc ngoài của tam giác","Vận dụng quan hệ góc ngoài trong bài toán đơn giản"] },

  { skillId:"L13_TRIANGLE_CORRESPONDENCE", displayName:"Xác định yếu tố tương ứng của hai tam giác bằng nhau", lessonNumber:13, tier:"CORE", aliases:["Xác định yếu tố tương ứng của hai tam giác bằng nhau","Nhận biết và viết đúng hai tam giác bằng nhau theo thứ tự tương ứng","Suy ra các yếu tố tương ứng và lập luận hình học đơn giản"] },
  { skillId:"L13_CONGRUENCE_SSS", displayName:"Trường hợp bằng nhau cạnh-cạnh-cạnh", lessonNumber:13, tier:"CORE", aliases:["Trường hợp bằng nhau cạnh-cạnh-cạnh","Trường hợp cạnh-cạnh-cạnh","Điều kiện c.c.c","Giải thích hai tam giác bằng nhau theo trường hợp c.c.c"] },

  { skillId:"L14_CONGRUENCE_SAS", displayName:"Trường hợp bằng nhau cạnh-góc-cạnh", lessonNumber:14, tier:"CORE", aliases:["Trường hợp bằng nhau cạnh-góc-cạnh","Trường hợp cạnh-góc-cạnh","Chứng minh hai tam giác bằng nhau theo c.g.c"] },
  { skillId:"L14_CONGRUENCE_ASA", displayName:"Trường hợp bằng nhau góc-cạnh-góc", lessonNumber:14, tier:"CORE", aliases:["Trường hợp bằng nhau góc-cạnh-góc","Trường hợp góc-cạnh-góc","Chứng minh hai tam giác bằng nhau theo g.c.g"] },
  { skillId:"L14_INCLUDED_ELEMENT", displayName:"Nhận biết góc xen giữa và cạnh xen giữa", lessonNumber:14, tier:"APPLIED", aliases:["Nhận biết góc xen giữa và cạnh xen giữa"] },

  { skillId:"L15_RIGHT_TRIANGLE_CONGRUENCE", displayName:"Phân biệt trường hợp bằng nhau của tam giác vuông", lessonNumber:15, tier:"CORE", aliases:["Phân biệt trường hợp bằng nhau của tam giác vuông"] },
  { skillId:"L15_RIGHT_LEG_LEG", displayName:"Hai cạnh góc vuông", lessonNumber:15, tier:"CORE", aliases:["Hai cạnh góc vuông"] },
  { skillId:"L15_RIGHT_LEG_ACUTE", displayName:"Cạnh góc vuông và góc nhọn kề", lessonNumber:15, tier:"CORE", aliases:["Cạnh góc vuông và góc nhọn kề"] },
  { skillId:"L15_RIGHT_HYP_ACUTE", displayName:"Cạnh huyền và góc nhọn", lessonNumber:15, tier:"CORE", aliases:["Cạnh huyền và góc nhọn"] },
  { skillId:"L15_RIGHT_HYP_LEG", displayName:"Cạnh huyền-cạnh góc vuông", lessonNumber:15, tier:"CORE", aliases:["Cạnh huyền-cạnh góc vuông"] },

  { skillId:"L16_ISOSCELES_DEFINITION", displayName:"Định nghĩa tam giác cân", lessonNumber:16, tier:"CORE", aliases:["Định nghĩa tam giác cân"] },
  { skillId:"L16_ISOSCELES_BASE_ANGLES", displayName:"Tính chất góc ở đáy của tam giác cân", lessonNumber:16, tier:"CORE", aliases:["Tính chất góc ở đáy của tam giác cân"] },
  { skillId:"L16_EQUILATERAL_RECOGNITION", displayName:"Nhận biết tam giác đều", lessonNumber:16, tier:"APPLIED", aliases:["Nhận biết tam giác đều"] },
  { skillId:"L16_ISOSCELES_CONVERSE", displayName:"Định lí đảo của tam giác cân", lessonNumber:16, tier:"CORE", aliases:["Định lí đảo của tam giác cân"] },
  { skillId:"L16_PERP_BISECTOR_DEFINITION", displayName:"Định nghĩa đường trung trực", lessonNumber:16, tier:"CORE", aliases:["Định nghĩa đường trung trực"] },
  { skillId:"L16_PERP_BISECTOR_PROPERTY", displayName:"Tính chất đường trung trực", lessonNumber:16, tier:"CORE", aliases:["Tính chất đường trung trực"] },
  { skillId:"L16_PERP_BISECTOR_CONVERSE", displayName:"Tính chất đảo của đường trung trực", lessonNumber:16, tier:"CORE", aliases:["Tính chất đảo của đường trung trực"] },

  { skillId:"L17_DATA_CLASSIFICATION", displayName:"Phân loại dữ liệu", lessonNumber:17, tier:"CORE", aliases:["Phân loại dữ liệu"] },
  { skillId:"L17_DATA_COLLECTION", displayName:"Thu thập dữ liệu", lessonNumber:17, tier:"CORE", aliases:["Thu thập dữ liệu bằng phỏng vấn hoặc bảng hỏi"] },
  { skillId:"L17_REPRESENTATIVE_DATA", displayName:"Tính đại diện của dữ liệu", lessonNumber:17, tier:"CORE", aliases:["Tính đại diện của dữ liệu","Nhận biết tính đại diện của dữ liệu thu thập"] },

  { skillId:"L18_PIE_CHART_READ", displayName:"Đọc biểu đồ hình quạt tròn", lessonNumber:18, tier:"CORE", aliases:["Đọc biểu đồ hình quạt tròn","Đọc và mô tả dữ liệu từ biểu đồ hình quạt tròn"] },
  { skillId:"L18_PIE_CHART_COUNT", displayName:"Chuyển tỉ lệ thành số lượng", lessonNumber:18, tier:"CORE", aliases:["Chuyển tỉ lệ thành số lượng","Biểu diễn dữ liệu vào biểu đồ hình quạt tròn cho sẵn"] },

  { skillId:"L19_LINE_CHART_TREND", displayName:"Nhận xét xu hướng biểu đồ đoạn thẳng", lessonNumber:19, tier:"CORE", aliases:["Nhận xét xu hướng biểu đồ đoạn thẳng","Nhận ra xu hướng hoặc quy luật đơn giản từ biểu đồ","Nhận ra vấn đề hoặc quy luật đơn giản từ biểu đồ"] },
  { skillId:"L19_LINE_CHART_READ", displayName:"Đọc biểu đồ đoạn thẳng", lessonNumber:19, tier:"CORE", aliases:["Đọc và mô tả dữ liệu từ biểu đồ đoạn thẳng","Đọc thang đo và phát hiện biểu đồ gây hiểu nhầm"] },
  { skillId:"L19_LINE_CHART_DRAW", displayName:"Vẽ biểu đồ đoạn thẳng", lessonNumber:19, tier:"CORE", aliases:["Vẽ biểu đồ đoạn thẳng từ bảng dữ liệu"] },
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


export function getCanonicalLessonNumbers(): number[] {
  return [...new Set(DEFINITIONS.map((item) => item.lessonNumber))].sort(
    (a, b) => a - b,
  );
}

export function isExplicitCanonicalSkill(skillName: string): boolean {
  return resolveCanonicalSkill(skillName) !== null;
}

export function getUnexpectedLegacySkillNames(skillNames: string[]): string[] {
  return [...new Set(skillNames.filter((name) => !isExplicitCanonicalSkill(name)))].sort();
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
