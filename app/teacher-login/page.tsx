"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TeacherLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/teacher-auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Đăng nhập không thành công.");
      const next = new URLSearchParams(window.location.search).get("next");
      router.replace(next && next.startsWith("/") ? next : "/teacher");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Đăng nhập không thành công.");
    } finally { setBusy(false); }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-8 text-slate-950 sm:py-14">
      <div className="mx-auto max-w-md">
        <Link href="/" className="text-sm font-bold text-slate-500">← Trang chủ</Link>
        <section className="mt-5 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
          <div className="bg-slate-950 p-7 text-white">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-indigo-200">Khu vực giáo viên</p>
            <h1 className="mt-3 text-3xl font-black">Đăng nhập giáo viên</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">Chỉ giáo viên và người được phân quyền mới sử dụng khu vực quản lý.</p>
          </div>
          <form onSubmit={submit} className="p-7">
            <label className="text-sm font-black">Tên đăng nhập</label>
            <input autoComplete="username" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Nhập tên đăng nhập" className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500" />
            <label className="mt-5 block text-sm font-black">Mật khẩu</label>
            <input type="password" autoComplete="current-password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Nhập mật khẩu" className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500" />
            {message && <p className="mt-4 rounded-2xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{message}</p>}
            <button disabled={busy || !username.trim() || !password} className="mt-6 w-full rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white disabled:opacity-40">{busy ? "Đang kiểm tra…" : "Đăng nhập →"}</button>
          </form>
        </section>
      </div>
    </main>
  );
}
