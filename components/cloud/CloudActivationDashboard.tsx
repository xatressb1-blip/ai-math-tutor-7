"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCloudHealth } from "@/services/cloud/cloud-sync-client";
import type { CloudHealth } from "@/types/cloud-pilot";

export function CloudActivationDashboard() {
  const [health, setHealth] = useState<CloudHealth | null>(null);
  const [error, setError] = useState("");
  async function check() {
    setError("");
    try { setHealth(await getCloudHealth()); } catch (e) { setError(e instanceof Error ? e.message : "Không thể kiểm tra trạng thái kết nối."); }
  }
  useEffect(() => { void check(); }, []);

  return <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-slate-950 sm:px-8">
    <div className="mx-auto max-w-5xl">
      <header className="rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-cyan-200">AI Math Tutor 7 · Kiểm tra kết nối</p>
        <h1 className="mt-3 text-4xl font-black">Kiểm tra kết nối dữ liệu trực tuyến</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">Kiểm tra ba lớp trước khi dùng dữ liệu trực tuyến: biến môi trường, kết nối dữ liệu và cấu trúc hệ thống.</p>
      </header>
      <section className="mt-5 grid gap-3 sm:grid-cols-3">
        <Status title="Server env" ready={Boolean(health?.configured)} detail="SUPABASE_URL + Secret key" />
        <Status title="Data API" ready={Boolean(health?.databaseReachable)} detail="Supabase REST reachable" />
        <Status title="Cấu trúc dữ liệu học sinh" ready={Boolean(health?.schemaReady)} detail="Bảng dữ liệu học sinh có thể truy cập" />
      </section>
      <section className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">{error || health?.message || "Đang kiểm tra…"}</div>
        <button onClick={() => void check()} className="mt-4 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white">↻ Kiểm tra lại</button>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link href="/teacher-cloud" className="rounded-2xl bg-amber-500 p-5 font-black text-slate-950">👨‍🏫 Quản lý dữ liệu giáo viên →</Link>
          <Link href="/cloud-sync" className="rounded-2xl bg-cyan-700 p-5 font-black text-white">☁️ Đồng bộ dữ liệu học sinh →</Link>
        </div>
      </section>
    </div>
  </main>;
}
function Status({ title, ready, detail }: { title: string; ready: boolean; detail: string }) {
  return <div className={`rounded-[1.5rem] border p-5 ${ready ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
    <div className={`text-xs font-black uppercase ${ready ? "text-emerald-700" : "text-amber-700"}`}>{ready ? "READY" : "WAITING"}</div>
    <div className="mt-2 text-xl font-black">{title}</div><div className="mt-1 text-xs text-slate-500">{detail}</div>
  </div>;
}
