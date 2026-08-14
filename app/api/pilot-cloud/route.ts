import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import type { StudentBrainSnapshot } from "@/types/student";

export const runtime = "nodejs";

const MAX_BRAIN_BYTES = 750_000;
const MAX_STUDENTS_PER_CLASS = 10;
const CODE_RE = /^[A-Z0-9-]{2,32}$/;
const ACCESS_RE = /^HS[0-9]$/;

type DbRow = {
  student_id: string;
  class_code: string;
  access_code_hash: string;
  access_code_last4: string;
  display_name: string;
  brain: StudentBrainSnapshot;
  updated_at: string;
};

function config() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const secret =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  return { url, secret };
}

function dbHeaders(secret: string) {
  return { apikey: secret, "Content-Type": "application/json" };
}

function hashAccess(classCode: string, accessCode: string) {
  return createHash("sha256")
    .update(`${classCode}:${accessCode}`)
    .digest("hex");
}

function generateAvailableAccessCode(rows: DbRow[], currentStudentId?: string): string | null {
  const used = new Set(
    rows
      .filter((row) => !currentStudentId || row.student_id !== currentStudentId)
      .map((row) => row.access_code_last4)
      .filter(Boolean),
  );
  for (let index = 0; index <= 9; index += 1) {
    const code = `HS${index}`;
    if (!used.has(code)) return code;
  }
  return null;
}

function secureTeacherKey(value: string): boolean {
  const expected = process.env.PILOT_TEACHER_KEY || "";
  if (!value || !expected) return false;
  const a = Buffer.from(value);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function secureTeacherSession(request: Request): boolean {
  const username = process.env.TEACHER_USERNAME || "giaovien";
  const password = process.env.TEACHER_PASSWORD || process.env.PILOT_TEACHER_KEY || "";
  if (!password) return false;
  const expected = createHash("sha256")
    .update(`${username}:${password}:ai-math-tutor-teacher`)
    .digest("hex");
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|;\s*)amt_teacher_session=([^;]+)/);
  const value = match?.[1] || "";
  if (!value) return false;
  const a = Buffer.from(value);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function validBrain(value: unknown): value is StudentBrainSnapshot {
  if (!value || typeof value !== "object") return false;
  const brain = value as StudentBrainSnapshot;
  if (!brain.profile?.id || !brain.profile?.displayName) return false;
  return Buffer.byteLength(JSON.stringify(brain), "utf8") <= MAX_BRAIN_BYTES;
}

function toClient(row: DbRow) {
  return {
    studentId: row.student_id,
    classCode: row.class_code,
    displayName: row.display_name,
    accessCodeMasked: row.access_code_last4
      ? `••••${row.access_code_last4}`
      : undefined,
    brain: row.brain,
    updatedAt: row.updated_at,
  };
}

async function dbFetch(
  url: string,
  secret: string,
  path: string,
  init?: RequestInit,
) {
  return fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { ...dbHeaders(secret), ...(init?.headers || {}) },
    cache: "no-store",
  });
}

async function queryRows(
  url: string,
  secret: string,
  query: string,
): Promise<DbRow[]> {
  const response = await dbFetch(url, secret, `pilot_students?${query}`);
  if (!response.ok) {
    throw new Error(`Supabase read failed (${response.status}).`);
  }
  return (await response.json()) as DbRow[];
}

function errorResponse(
  error: string,
  status: number,
  extra?: Record<string, unknown>,
) {
  return NextResponse.json({ error, ...extra }, { status });
}

export async function GET() {
  const { url, secret } = config();
  const checkedAt = new Date().toISOString();

  if (!url || !secret) {
    return NextResponse.json({
      configured: false,
      provider: "not-configured",
      databaseReachable: false,
      schemaReady: false,
      message: "Thiếu SUPABASE_URL hoặc SUPABASE_SECRET_KEY.",
      checkedAt,
    });
  }

  try {
    const response = await dbFetch(
      url,
      secret,
      "pilot_students?select=student_id&limit=1",
    );
    const schemaReady = response.ok;
    return NextResponse.json({
      configured: true,
      provider: "supabase-rest",
      databaseReachable: response.status !== 0,
      schemaReady,
      message: schemaReady
        ? "Dữ liệu trực tuyến đã sẵn sàng."
        : `Cloud kết nối được nhưng schema chưa sẵn sàng (${response.status}).`,
      checkedAt,
    });
  } catch {
    return NextResponse.json(
      {
        configured: true,
        provider: "supabase-rest",
        databaseReachable: false,
        schemaReady: false,
        message: "Không kết nối được Supabase Data API.",
        checkedAt,
      },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  const { url, secret } = config();
  if (!url || !secret) {
    return errorResponse("Cloud chưa cấu hình trên server.", 503);
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const action = String(body.action || "");
    const classCode = String(body.classCode || "")
      .trim()
      .toUpperCase();
    const accessCode = String(body.accessCode || "")
      .trim()
      .toUpperCase();

    if (action === "studentClassList") {
      const rows = await queryRows(
        url,
        secret,
        "select=class_code&order=class_code.asc",
      );
      const classes = [...new Set(rows.map((row) => row.class_code).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, "vi"));
      return NextResponse.json({ classes });
    }

    if (action === "studentPull" || action === "studentPush") {
      if (!CODE_RE.test(classCode) || !ACCESS_RE.test(accessCode)) {
        return errorResponse("Mã lớp hoặc mã học sinh không hợp lệ.", 400);
      }

      const hash = hashAccess(classCode, accessCode);
      const rows = await queryRows(
        url,
        secret,
        `class_code=eq.${encodeURIComponent(classCode)}&access_code_hash=eq.${hash}&select=*`,
      );
      const row = rows[0];

      if (!row) {
        return errorResponse("Không tìm thấy hồ sơ học sinh phù hợp với mã đã nhập.", 404);
      }

      if (action === "studentPull") {
        return NextResponse.json({
          student: toClient(row),
          serverUpdatedAt: row.updated_at,
          direction: "PULL",
        });
      }

      if (!validBrain(body.brain)) {
        return errorResponse(
          "Hồ sơ học tập không hợp lệ hoặc quá lớn.",
          400,
        );
      }

      const brain = body.brain;
      if (brain.profile.id !== row.student_id) {
        return errorResponse(
          "Mã định danh học sinh không khớp hồ sơ trực tuyến.",
          409,
        );
      }

      const baseUpdatedAt = String(body.baseUpdatedAt || "");
      if (!baseUpdatedAt) {
        return errorResponse(
          "Thiết bị cần tải hồ sơ từ Cloud trước khi gửi tiến độ.",
          428,
          {
            code: "PULL_REQUIRED",
            serverUpdatedAt: row.updated_at,
          },
        );
      }

      if (baseUpdatedAt !== row.updated_at) {
        return errorResponse(
          "Cloud có dữ liệu mới hơn. Hãy tải hồ sơ trước để tránh ghi đè tiến độ.",
          409,
          {
            code: "CLOUD_CONFLICT",
            serverUpdatedAt: row.updated_at,
            student: toClient(row),
          },
        );
      }

      const updatedAt = new Date().toISOString();
      const response = await dbFetch(
        url,
        secret,
        `pilot_students?student_id=eq.${encodeURIComponent(row.student_id)}`,
        {
          method: "PATCH",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify({
            brain,
            display_name: brain.profile.displayName,
            updated_at: updatedAt,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Supabase update failed (${response.status}).`);
      }

      const updated = ((await response.json()) as DbRow[])[0];
      return NextResponse.json({
        student: toClient(updated),
        serverUpdatedAt: updated.updated_at,
        direction: "PUSH",
      });
    }

    if (
      !secureTeacherSession(request) &&
      !secureTeacherKey(String(body.teacherKey || ""))
    ) {
      return errorResponse("Phiên giáo viên không hợp lệ. Hãy đăng nhập lại.", 401);
    }

    if (action === "teacherList") {
      if (!CODE_RE.test(classCode)) {
        return errorResponse("Mã lớp không hợp lệ.", 400);
      }
      const rows = await queryRows(
        url,
        secret,
        `class_code=eq.${encodeURIComponent(classCode)}&select=*&order=display_name.asc`,
      );
      return NextResponse.json({ students: rows.map(toClient) });
    }

    if (action === "teacherUpsert") {
      if (
        !CODE_RE.test(classCode) ||
        !ACCESS_RE.test(accessCode) ||
        !validBrain(body.brain)
      ) {
        return errorResponse(
          "Dữ liệu tạo hồ sơ Cloud không hợp lệ.",
          400,
        );
      }

      const brain = body.brain;
      const classRows = await queryRows(
        url,
        secret,
        `class_code=eq.${encodeURIComponent(classCode)}&select=*`,
      );
      const alreadyExists = classRows.some(
        (item) => item.student_id === brain.profile.id,
      );
      const accessHash = hashAccess(classCode, accessCode);
      const accessTaken = classRows.some(
        (item) => item.student_id !== brain.profile.id && item.access_code_hash === accessHash,
      );
      if (accessTaken) {
        return errorResponse(
          `Mã học sinh ${accessCode} đã được sử dụng trong lớp ${classCode}.`,
          409,
          { code: "ACCESS_CODE_TAKEN" },
        );
      }

      if (!alreadyExists && classRows.length >= MAX_STUDENTS_PER_CLASS) {
        return errorResponse(
          `Pilot hiện giới hạn ${MAX_STUDENTS_PER_CLASS} học sinh mỗi lớp.`,
          409,
          { code: "PILOT_LIMIT" },
        );
      }

      const row = {
        student_id: brain.profile.id,
        class_code: classCode,
        access_code_hash: accessHash,
        access_code_last4: accessCode.slice(-4),
        display_name: brain.profile.displayName,
        brain,
        updated_at: new Date().toISOString(),
      };

      const response = await dbFetch(
        url,
        secret,
        "pilot_students?on_conflict=student_id",
        {
          method: "POST",
          headers: {
            Prefer: "resolution=merge-duplicates,return=representation",
          },
          body: JSON.stringify(row),
        },
      );

      if (!response.ok) {
        throw new Error(`Supabase upsert failed (${response.status}).`);
      }

      const saved = ((await response.json()) as DbRow[])[0];
      return NextResponse.json({ student: toClient(saved) });
    }

    if (action === "teacherRotateAccess") {
      const studentId = String(body.studentId || "");
      if (!studentId || !CODE_RE.test(classCode)) {
        return errorResponse("Thiếu studentId hoặc mã lớp.", 400);
      }

      const rows = await queryRows(
        url,
        secret,
        `student_id=eq.${encodeURIComponent(studentId)}&class_code=eq.${encodeURIComponent(classCode)}&select=*`,
      );
      const row = rows[0];

      if (!row) {
        return errorResponse("Không tìm thấy học sinh trong dữ liệu trực tuyến.", 404);
      }

      const classRows = await queryRows(
        url,
        secret,
        `class_code=eq.${encodeURIComponent(classCode)}&select=*`,
      );
      const newAccessCode = generateAvailableAccessCode(classRows, studentId);
      if (!newAccessCode) {
        return errorResponse(
          "Lớp đã dùng đủ mã HS0 đến HS9; chưa thể đặt lại mã mới.",
          409,
          { code: "NO_ACCESS_CODE_AVAILABLE" },
        );
      }
      const updatedAt = new Date().toISOString();
      const response = await dbFetch(
        url,
        secret,
        `pilot_students?student_id=eq.${encodeURIComponent(studentId)}&class_code=eq.${encodeURIComponent(classCode)}`,
        {
          method: "PATCH",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify({
            access_code_hash: hashAccess(classCode, newAccessCode),
            access_code_last4: newAccessCode.slice(-4),
            updated_at: updatedAt,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Supabase access rotation failed (${response.status}).`,
        );
      }

      const updated = ((await response.json()) as DbRow[])[0];
      return NextResponse.json({
        student: toClient(updated),
        accessCode: newAccessCode,
      });
    }

    if (action === "teacherDelete") {
      const studentId = String(body.studentId || "");
      if (!studentId || !CODE_RE.test(classCode)) {
        return errorResponse("Thiếu studentId hoặc mã lớp.", 400);
      }

      const response = await dbFetch(
        url,
        secret,
        `pilot_students?student_id=eq.${encodeURIComponent(studentId)}&class_code=eq.${encodeURIComponent(classCode)}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        throw new Error(`Supabase delete failed (${response.status}).`);
      }

      return NextResponse.json({ ok: true });
    }

    return errorResponse("Thao tác không được hỗ trợ.", 400);
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Lỗi dữ liệu trực tuyến",
      500,
    );
  }
}
