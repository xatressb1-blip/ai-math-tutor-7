import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a); const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
function sessionToken(username: string, password: string) {
  return createHash("sha256").update(`${username}:${password}:ai-math-tutor-teacher`).digest("hex");
}
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { username?: string; password?: string };
  const expectedUser = process.env.TEACHER_USERNAME || "giaovien";
  const expectedPassword = process.env.TEACHER_PASSWORD || process.env.PILOT_TEACHER_KEY || "";
  if (!expectedPassword) return NextResponse.json({ error: "Tài khoản giáo viên chưa được cấu hình trên hệ thống." }, { status: 503 });
  if (!safeEqual(String(body.username || ""), expectedUser) || !safeEqual(String(body.password || ""), expectedPassword)) {
    return NextResponse.json({ error: "Tên đăng nhập hoặc mật khẩu không đúng." }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set("amt_teacher_session", sessionToken(expectedUser, expectedPassword), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 });
  return response;
}
