import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import type { StudentBrainSnapshot } from "@/types/student";

export const runtime = "nodejs";

const MAX_BRAIN_BYTES = 750_000;
const CODE_RE = /^[A-Z0-9-]{3,32}$/;
const ACCESS_RE = /^[A-Z0-9]{6,16}$/;

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
  const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  return { url, secret };
}
function dbHeaders(secret: string) { return { apikey: secret, "Content-Type": "application/json" }; }
function hashAccess(classCode: string, accessCode: string) {
  return createHash("sha256").update(`${classCode}:${accessCode}`).digest("hex");
}
function secureTeacherKey(value: string): boolean {
  const expected = process.env.PILOT_TEACHER_KEY || "";
  if (!value || !expected) return false;
  const a = Buffer.from(value); const b = Buffer.from(expected);
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
    accessCodeMasked: row.access_code_last4 ? `••••${row.access_code_last4}` : undefined,
    brain: row.brain,
    updatedAt: row.updated_at,
  };
}
async function dbFetch(url: string, secret: string, path: string, init?: RequestInit) {
  return fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { ...dbHeaders(secret), ...(init?.headers || {}) },
    cache: "no-store",
  });
}
async function queryRows(url: string, secret: string, query: string): Promise<DbRow[]> {
  const response = await dbFetch(url, secret, `pilot_students?${query}`);
  if (!response.ok) throw new Error(`Supabase read failed (${response.status}).`);
  return (await response.json()) as DbRow[];
}

export async function GET(request: Request) {
  const { url, secret } = config();
  const checkedAt = new Date().toISOString();
  if (!url || !secret) return NextResponse.json({ configured: false, provider: "not-configured", databaseReachable: false, schemaReady: false, message: "Thiếu SUPABASE_URL hoặc SUPABASE_SECRET_KEY.", checkedAt });
  try {
    const response = await dbFetch(url, secret, "pilot_students?select=student_id&limit=1");
    const schemaReady = response.ok;
    return NextResponse.json({ configured: true, provider: "supabase-rest", databaseReachable: response.status !== 0, schemaReady, message: schemaReady ? "Cloud đã sẵn sàng." : `Cloud kết nối được nhưng schema chưa sẵn sàng (${response.status}).`, checkedAt });
  } catch {
    return NextResponse.json({ configured: true, provider: "supabase-rest", databaseReachable: false, schemaReady: false, message: "Không kết nối được Supabase Data API.", checkedAt }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const { url, secret } = config();
  if (!url || !secret) return NextResponse.json({ error: "Cloud chưa cấu hình trên server." }, { status: 503 });
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const action = String(body.action || "");
    const classCode = String(body.classCode || "").trim().toUpperCase();
    const accessCode = String(body.accessCode || "").trim().toUpperCase();

    if (["studentPull", "studentPush"].includes(action)) {
      if (!CODE_RE.test(classCode) || !ACCESS_RE.test(accessCode)) return NextResponse.json({ error: "Mã lớp hoặc mã học sinh không hợp lệ." }, { status: 400 });
      const hash = hashAccess(classCode, accessCode);
      const rows = await queryRows(url, secret, `class_code=eq.${encodeURIComponent(classCode)}&access_code_hash=eq.${hash}&select=*`);
      const row = rows[0];
      if (!row) return NextResponse.json({ error: "Không tìm thấy hồ sơ Cloud phù hợp." }, { status: 404 });
      if (action === "studentPull") return NextResponse.json({ student: toClient(row), serverUpdatedAt: row.updated_at, direction: "PULL" });

      if (!validBrain(body.brain)) return NextResponse.json({ error: "Student Brain không hợp lệ hoặc quá lớn." }, { status: 400 });
      const brain = body.brain;
      if (brain.profile.id !== row.student_id) return NextResponse.json({ error: "Student ID không khớp hồ sơ Cloud." }, { status: 409 });
      const updatedAt = new Date().toISOString();
      const response = await dbFetch(url, secret, `pilot_students?student_id=eq.${encodeURIComponent(row.student_id)}`, {
        method: "PATCH", headers: { Prefer: "return=representation" },
        body: JSON.stringify({ brain, display_name: brain.profile.displayName, updated_at: updatedAt }),
      });
      if (!response.ok) throw new Error(`Supabase update failed (${response.status}).`);
      const updated = ((await response.json()) as DbRow[])[0];
      return NextResponse.json({ student: toClient(updated), serverUpdatedAt: updated.updated_at, direction: "PUSH" });
    }

    if (!secureTeacherKey(String(body.teacherKey || ""))) return NextResponse.json({ error: "Teacher key không đúng." }, { status: 401 });

    if (action === "teacherList") {
      if (!CODE_RE.test(classCode)) return NextResponse.json({ error: "Mã lớp không hợp lệ." }, { status: 400 });
      const rows = await queryRows(url, secret, `class_code=eq.${encodeURIComponent(classCode)}&select=*&order=display_name.asc`);
      return NextResponse.json({ students: rows.map(toClient) });
    }

    if (action === "teacherUpsert") {
      if (!CODE_RE.test(classCode) || !ACCESS_RE.test(accessCode) || !validBrain(body.brain)) return NextResponse.json({ error: "Dữ liệu tạo hồ sơ Cloud không hợp lệ." }, { status: 400 });
      const brain = body.brain;
      const row = {
        student_id: brain.profile.id,
        class_code: classCode,
        access_code_hash: hashAccess(classCode, accessCode),
        access_code_last4: accessCode.slice(-4),
        display_name: brain.profile.displayName,
        brain,
        updated_at: new Date().toISOString(),
      };
      const response = await dbFetch(url, secret, "pilot_students?on_conflict=student_id", {
        method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=representation" }, body: JSON.stringify(row),
      });
      if (!response.ok) throw new Error(`Supabase upsert failed (${response.status}).`);
      const saved = ((await response.json()) as DbRow[])[0];
      return NextResponse.json({ student: toClient(saved) });
    }

    if (action === "teacherDelete") {
      const studentId = String(body.studentId || "");
      if (!studentId || !CODE_RE.test(classCode)) return NextResponse.json({ error: "Thiếu studentId hoặc mã lớp." }, { status: 400 });
      const response = await dbFetch(url, secret, `pilot_students?student_id=eq.${encodeURIComponent(studentId)}&class_code=eq.${encodeURIComponent(classCode)}`, { method: "DELETE" });
      if (!response.ok) throw new Error(`Supabase delete failed (${response.status}).`);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Action không hỗ trợ." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Cloud error" }, { status: 500 });
  }
}
