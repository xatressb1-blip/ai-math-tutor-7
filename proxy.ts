import { NextRequest, NextResponse } from "next/server";

async function digest(value: string) {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function proxy(request: NextRequest) {
  const username = process.env.TEACHER_USERNAME || "giaovien";
  const password = process.env.TEACHER_PASSWORD || process.env.PILOT_TEACHER_KEY || "";
  if (!password) return NextResponse.redirect(new URL("/teacher-login", request.url));
  const expected = await digest(`${username}:${password}:ai-math-tutor-teacher`);
  if (request.cookies.get("amt_teacher_session")?.value === expected) return NextResponse.next();
  const login = new URL("/teacher-login", request.url);
  login.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/advanced-quality/:path*", "/teacher", "/teacher-progress/:path*", "/teacher-cloud/:path*", "/teacher-multi/:path*", "/teacher-pilot/:path*", "/pilot-roster/:path*", "/pilot-ops/:path*", "/cloud-activation/:path*", "/knowledge-qa/:path*", "/content/:path*", "/authoring/:path*"],
};
