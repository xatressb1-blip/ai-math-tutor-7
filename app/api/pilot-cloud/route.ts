import { NextResponse } from "next/server";
import type { StudentBrainSnapshot } from "@/types/student";

export const runtime = "nodejs";

type DbRow = {
  student_id: string;
  class_code: string;
  access_code: string;
  display_name: string;
  brain: StudentBrainSnapshot;
  updated_at: string;
};

function getConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  return { url, secret };
}

function headers(secret: string) {
  return {
    apikey: secret,
    "Content-Type": "application/json",
  };
}

function toClient(row: DbRow) {
  return {
    studentId: row.student_id,
    classCode: row.class_code,
    accessCode: row.access_code,
    displayName: row.display_name,
    brain: row.brain,
    updatedAt: row.updated_at,
  };
}

async function queryRows(url: string, secret: string, query: string): Promise<DbRow[]> {
  const response = await fetch(`${url}/rest/v1/pilot_students?${query}`, {
    headers: headers(secret),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Supabase read failed: ${response.status}`);
  return (await response.json()) as DbRow[];
}

export async function GET() {
  const { url, secret } = getConfig();
  return NextResponse.json({
    configured: Boolean(url && secret),
    provider: url && secret ? "supabase-rest" : "not-configured",
  });
}

export async function POST(request: Request) {
  const { url, secret } = getConfig();
  if (!url || !secret) {
    return NextResponse.json(
      { error: "Cloud chưa được cấu hình. Cần SUPABASE_URL và SUPABASE_SECRET_KEY (hoặc legacy SUPABASE_SERVICE_ROLE_KEY)." },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const action = String(body.action || "");
    const classCode = String(body.classCode || "").trim().toUpperCase();
    const accessCode = String(body.accessCode || "").trim().toUpperCase();

    if (action === "studentPull" || action === "studentPush") {
      if (!classCode || !accessCode) {
        return NextResponse.json({ error: "Thiếu mã lớp hoặc mã học sinh." }, { status: 400 });
      }

      const rows = await queryRows(
        url,
        secret,
        `class_code=eq.${encodeURIComponent(classCode)}&access_code=eq.${encodeURIComponent(accessCode)}&select=*`,
      );
      const row = rows[0];
      if (!row) return NextResponse.json({ error: "Không tìm thấy hồ sơ Cloud phù hợp." }, { status: 404 });

      if (action === "studentPull") return NextResponse.json(toClient(row));

      const brain = body.brain as StudentBrainSnapshot | undefined;
      if (!brain?.profile?.id) return NextResponse.json({ error: "Student Brain không hợp lệ." }, { status: 400 });
      if (brain.profile.id !== row.student_id) {
        return NextResponse.json({ error: "Student ID không khớp hồ sơ Cloud." }, { status: 409 });
      }

      const updatedAt = new Date().toISOString();
      const response = await fetch(`${url}/rest/v1/pilot_students?student_id=eq.${encodeURIComponent(row.student_id)}`, {
        method: "PATCH",
        headers: { ...headers(secret), Prefer: "return=representation" },
        body: JSON.stringify({ brain, display_name: brain.profile.displayName, updated_at: updatedAt }),
      });
      if (!response.ok) throw new Error(`Supabase update failed: ${response.status}`);
      const updated = ((await response.json()) as DbRow[])[0];
      return NextResponse.json(toClient(updated));
    }

    const teacherKey = String(body.teacherKey || "");
    if (!process.env.PILOT_TEACHER_KEY || teacherKey !== process.env.PILOT_TEACHER_KEY) {
      return NextResponse.json({ error: "Teacher key không đúng." }, { status: 401 });
    }

    if (action === "teacherList") {
      if (!classCode) return NextResponse.json({ error: "Thiếu mã lớp." }, { status: 400 });
      const rows = await queryRows(
        url,
        secret,
        `class_code=eq.${encodeURIComponent(classCode)}&select=*&order=display_name.asc`,
      );
      return NextResponse.json({ students: rows.map(toClient) });
    }

    if (action === "teacherUpsert") {
      const brain = body.brain as StudentBrainSnapshot | undefined;
      if (!classCode || !accessCode || !brain?.profile?.id) {
        return NextResponse.json({ error: "Thiếu dữ liệu tạo hồ sơ Cloud." }, { status: 400 });
      }
      const row = {
        student_id: brain.profile.id,
        class_code: classCode,
        access_code: accessCode,
        display_name: brain.profile.displayName,
        brain,
        updated_at: new Date().toISOString(),
      };
      const response = await fetch(`${url}/rest/v1/pilot_students?on_conflict=student_id`, {
        method: "POST",
        headers: { ...headers(secret), Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify(row),
      });
      if (!response.ok) throw new Error(`Supabase upsert failed: ${response.status}`);
      const saved = ((await response.json()) as DbRow[])[0];
      return NextResponse.json(toClient(saved));
    }

    return NextResponse.json({ error: "Action không hỗ trợ." }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Cloud error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
