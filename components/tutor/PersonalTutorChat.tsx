"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { getDemoStudentBrain } from "@/services/student/student-brain-service";
import { loadStudentBrainFromStorage } from "@/services/student/student-brain-storage";
import { buildTutorStudentContext } from "@/services/tutor/tutor-context";
import {
  clearTutorHistory,
  loadTutorHistory,
  saveTutorHistory,
} from "@/services/tutor/tutor-storage";
import { getTutorSuggestions } from "@/services/tutor/tutor-suggestions";
import type { LessonDefinition } from "@/types/lesson";
import type { StudentBrainSnapshot } from "@/types/student";
import type { TutorMessage, TutorResponse } from "@/types/tutor";

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function makeStudentMessage(text: string): TutorMessage {
  return {
    id: `student-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role: "student",
    text,
    createdAt: new Date().toISOString(),
  };
}

function welcomeMessage(lesson: LessonDefinition): TutorMessage {
  return {
    id: `welcome-${lesson.id}`,
    role: "tutor",
    text: `Chào em! Đây là khu vực hỏi riêng cho “${lesson.title}”. Em có thể nói chỗ chưa hiểu, xin gợi ý hoặc nhờ thầy/cô hỏi lại để kiểm tra. Thầy/cô sẽ ưu tiên hướng dẫn từng bước thay vì đưa đáp án ngay.`,
    createdAt: new Date().toISOString(),
    intent: "EXPLAIN",
  };
}

export function PersonalTutorChat({ lesson }: { lesson: LessonDefinition }) {
  const [brain, setBrain] = useState<StudentBrainSnapshot>(getDemoStudentBrain());
  const [messages, setMessages] = useState<TutorMessage[]>([welcomeMessage(lesson)]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>(
    getTutorSuggestions(lesson),
  );
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [sourceLabel, setSourceLabel] = useState("Teaching Brain · Lesson Context");
  const endRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    const savedBrain = loadStudentBrainFromStorage();
    if (savedBrain) setBrain(savedBrain);

    const history = loadTutorHistory(lesson.id);
    if (history.length > 0) setMessages(history);

    const browser = window as typeof window & {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    setVoiceSupported(Boolean(browser.SpeechRecognition || browser.webkitSpeechRecognition));
  }, [lesson.id]);

  useEffect(() => {
    saveTutorHistory(lesson.id, messages);
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lesson.id, messages]);

  const studentContext = useMemo(
    () => buildTutorStudentContext({ lesson, brain }),
    [lesson, brain],
  );

  async function sendMessage(raw: string) {
    const text = raw.trim();
    if (!text || sending) return;

    const studentMessage = makeStudentMessage(text);
    const nextHistory = [...messages, studentMessage].slice(-20);
    setMessages(nextHistory);
    setInput("");
    setSending(true);

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: lesson.id,
          message: text,
          history: nextHistory,
          studentContext,
        }),
      });

      if (!response.ok) throw new Error("Tutor API error");
      const payload = (await response.json()) as TutorResponse;
      setMessages((current) => [...current, payload.message].slice(-40));
      setSuggestedReplies(payload.suggestedReplies);
      setSourceLabel(payload.sourceLabel);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `error-${Date.now()}`,
          role: "tutor",
          text: "Thầy/cô chưa phản hồi được lúc này. Em thử gửi lại câu hỏi ngắn hơn nhé.",
          createdAt: new Date().toISOString(),
          intent: "OUT_OF_SCOPE",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void sendMessage(input);
  }

  function toggleVoice() {
    if (!voiceSupported) return;
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const browser = window as typeof window & {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    const Ctor = browser.SpeechRecognition || browser.webkitSpeechRecognition;
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.lang = "vi-VN";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      setInput(transcript);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }

  function speakLastTutorMessage() {
    if (!("speechSynthesis" in window)) return;
    const last = [...messages].reverse().find((message) => message.role === "tutor");
    if (!last) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(last.text);
    utterance.lang = "vi-VN";
    utterance.rate = 0.96;
    window.speechSynthesis.speak(utterance);
  }

  function resetConversation() {
    clearTutorHistory(lesson.id);
    setMessages([welcomeMessage(lesson)]);
    setSuggestedReplies(getTutorSuggestions(lesson));
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-5 text-slate-950 sm:px-6 sm:py-7">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="space-y-4">
          <section className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-indigo-200">
                Beta 2.1
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-emerald-200">
                Reasoning Tutor
              </span>
            </div>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
              Bài {lesson.lessonNumber}
            </p>
            <h1 className="mt-2 text-3xl font-black leading-tight">{lesson.title}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">{lesson.subtitle}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link href={`/learn/${lesson.id}`} className="rounded-2xl bg-white px-4 py-2.5 text-sm font-black text-slate-950">
                ← Về bài học
              </Link>
              <Link href="/progress" className="rounded-2xl border border-white/15 px-4 py-2.5 text-sm font-black text-white">
                🗺️ Tiến độ
              </Link>
              <Link href={`/reasoning-lab/${lesson.id}`} className="rounded-2xl border border-indigo-300 bg-indigo-500/20 px-4 py-2.5 text-sm font-black text-indigo-100">
                🧠 Luyện lập luận
              </Link>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-indigo-600">
              Student Brain Context
            </p>
            <h2 className="mt-2 text-xl font-black">AI đang điều chỉnh theo em</h2>
            <div className="mt-4 space-y-3">
              {studentContext.weakSkills.length > 0 ? (
                studentContext.weakSkills.map((skill) => (
                  <div key={skill.skillName} className="rounded-2xl bg-slate-50 p-3">
                    <div className="flex justify-between gap-3 text-sm font-bold">
                      <span>{skill.skillName}</span>
                      <span>{skill.masteryScore}/100</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">Mức tự tin {skill.confidence}/100</p>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
                  Chưa có đủ dữ liệu kỹ năng riêng cho bài này. AI sẽ dùng Lesson Context trước.
                </p>
              )}
            </div>

            {studentContext.recentMistakes.length > 0 && (
              <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.1em] text-rose-600">Lỗi AI đang lưu ý</p>
                <p className="mt-2 text-sm font-bold leading-6 text-rose-900">
                  {studentContext.recentMistakes[0]?.description}
                </p>
              </div>
            )}
          </section>
        </aside>

        <section className="flex min-h-[78vh] flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg">
          <header className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black">💬 Hỏi gia sư AI</p>
                <p className="mt-1 text-xs text-slate-500">{sourceLabel}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={speakLastTutorMessage} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600">
                  🔊 Nghe
                </button>
                <button type="button" onClick={resetConversation} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600">
                  Xóa chat
                </button>
              </div>
            </div>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "student" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[86%] whitespace-pre-line rounded-3xl px-4 py-3 text-sm leading-7 ${message.role === "student" ? "bg-slate-950 text-white" : "bg-indigo-50 text-slate-800"}`}>
                  {message.role === "tutor" && (
                    <p className="mb-1 text-[10px] font-black uppercase tracking-[0.12em] text-indigo-600">Math Mentor AI</p>
                  )}
                  {message.text}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="rounded-3xl bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-700">AI đang suy nghĩ theo bài học của em…</div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-slate-100 bg-slate-50/70 p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap gap-2">
              {suggestedReplies.slice(0, 4).map((suggestion) => (
                <button key={suggestion} type="button" disabled={sending} onClick={() => void sendMessage(suggestion)} className="rounded-full border border-indigo-100 bg-white px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-50">
                  {suggestion}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="flex items-end gap-2">
              <textarea value={input} onChange={(event) => setInput(event.target.value)} rows={2} placeholder="Ví dụ: Em chưa hiểu tại sao phải đổi dấu…" className="min-h-[52px] flex-1 resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500" />
              {voiceSupported && (
                <button type="button" onClick={toggleVoice} className={`grid h-[52px] w-[52px] place-items-center rounded-2xl text-lg font-black ${listening ? "bg-rose-600 text-white" : "border border-slate-300 bg-white"}`} aria-label="Nhập bằng giọng nói">
                  {listening ? "■" : "🎙️"}
                </button>
              )}
              <button type="submit" disabled={!input.trim() || sending} className="h-[52px] rounded-2xl bg-indigo-600 px-5 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40">
                Gửi
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
