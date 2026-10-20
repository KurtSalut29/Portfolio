"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, MessageCircle, RotateCcw, Square, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { profile } from "@/content/profile";
import { play } from "@/lib/sound";
import { Markdown } from "./Markdown";

type Message = { role: "user" | "assistant"; text: string; error?: boolean };

const SUGGESTIONS = [
  "What kind of apps does Kurt build?",
  "Tell me about his projects",
  "What tech stack does he use?",
  "Is he open to work?",
];
const MAX_CHARS = 800;
const STORE = "kms-chat";
const EASE = [0.32, 0.72, 0, 1] as const;

/**
 * "Ask about Kurt": a floating button and a small chat window. Replies stream in from /api/chat,
 * which answers only from the portfolio's own content. The conversation lasts for the browser tab.
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const abort = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Bring back this tab's conversation after a reload or a page change.
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORE) ?? "[]");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser storage once after mount
      if (Array.isArray(saved)) setMessages(saved.filter((m) => !m.error));
    } catch {}
  }, []);
  useEffect(() => {
    if (busy) return;
    try {
      sessionStorage.setItem(STORE, JSON.stringify(messages.slice(-30)));
    } catch {}
  }, [messages, busy]);

  // Keep the newest message in view while a reply streams in.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function close() {
    setOpen(false);
    play("close");
    buttonRef.current?.focus({ preventScroll: true });
  }

  async function send(text: string) {
    const question = text.trim().slice(0, MAX_CHARS);
    if (!question || busy) return;
    const history = [...messages.filter((m) => !m.error), { role: "user" as const, text: question }];
    setMessages([...history, { role: "assistant", text: "" }]);
    setDraft("");
    setBusy(true);
    play("send");

    const controller = new AbortController();
    abort.current = controller;
    const update = (text: string, error = false) =>
      setMessages((all) => [...all.slice(0, -1), { role: "assistant", text, error }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.map(({ role, text }) => ({ role, text })) }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const { error } = await res.json().catch(() => ({ error: "" }));
        update(
          res.status === 503
            ? `The assistant isn't available right now. You can email Kurt directly at ${profile.email}.`
            : `${error || "Something went wrong."} You can also email Kurt at ${profile.email}.`,
          true,
        );
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        update(reply);
      }
      if (!reply.trim()) update(`I couldn't come up with an answer. Try asking another way, or email Kurt at ${profile.email}.`, true);
      else play("send");
    } catch (e) {
      if ((e as Error).name === "AbortError") {
        setMessages((all) => (all.at(-1)?.text ? all : all.slice(0, -2)));
      } else {
        update(`Couldn't reach the assistant. Check your connection, or email Kurt at ${profile.email}.`, true);
      }
    } finally {
      setBusy(false);
      abort.current = null;
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    void send(draft);
  }

  function reset() {
    abort.current?.abort();
    setMessages([]);
    inputRef.current?.focus();
  }

  return (
    <div className="no-print">
      {/* Launcher: bottom right, above the mobile tab bar */}
      <AnimatePresence>
        {!open && (
          <motion.button
            ref={buttonRef}
            type="button"
            onClick={() => setOpen(true)}
            data-sound="open"
            aria-label="Ask about Kurt (AI assistant)"
            aria-haspopup="dialog"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="chat-launcher fixed right-4 z-50 flex h-12 min-w-12 items-center justify-center gap-2 rounded-full bg-accent px-3.5 text-[14.5px] font-medium text-accent-ink shadow-[0_10px_30px_-10px_color-mix(in_oklab,var(--accent)_70%,transparent)] transition-transform active:scale-95 lg:right-8"
          >
            <MessageCircle size={19} strokeWidth={2} aria-hidden="true" />
            <span className="hidden pr-0.5 sm:inline">Ask about Kurt</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="false"
            aria-label="Ask about Kurt"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: EASE }}
            style={{ transformOrigin: "100% 100%" }}
            className="chat-panel fixed right-3 left-3 z-50 flex flex-col overflow-hidden rounded-[20px] border border-line bg-surface shadow-[var(--card-shadow-lift)] sm:left-auto sm:w-[400px] lg:right-8"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <span className="relative size-9 shrink-0 overflow-hidden rounded-full bg-surface-2">
                {profile.portrait && <Image src={profile.portrait} alt="" fill sizes="36px" className="object-cover" />}
                <span aria-hidden="true" className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-surface bg-[var(--live)]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14.5px] leading-tight font-semibold text-ink">Ask about Kurt</p>
                <p className="mt-0.5 text-[12px] leading-tight text-ink-3">AI assistant · answers from this portfolio</p>
              </div>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={reset}
                  aria-label="Start a new conversation"
                  title="New conversation"
                  className="grid size-8 place-items-center rounded-[9px] text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  <RotateCcw size={15} strokeWidth={2} aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                onClick={close}
                data-sound="none"
                aria-label="Close chat"
                className="grid size-8 place-items-center rounded-[9px] text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
              >
                <X size={17} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            {/* Conversation */}
            <div
              ref={listRef}
              data-lenis-prevent
              aria-live="polite"
              className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
            >
              <Bubble role="assistant">
                Hi! I can answer questions about Kurt&apos;s projects, skills, and services, and how to work with him. What
                would you like to know?
              </Bubble>

              {messages.length === 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => void send(s)}
                      className="rounded-full border border-line bg-surface-2 px-3 py-1.5 text-left text-[13px] text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((m, i) => (
                <Bubble key={i} role={m.role} error={m.error}>
                  {m.role === "assistant" ? (
                    m.text ? (
                      <Markdown text={m.text} />
                    ) : (
                      <span className="chat-typing" aria-label="Typing">
                        <span />
                        <span />
                        <span />
                      </span>
                    )
                  ) : (
                    m.text
                  )}
                </Bubble>
              ))}
            </div>

            {/* Composer */}
            <form onSubmit={submit} className="border-t border-line p-3">
              <div className="flex items-end gap-2 rounded-[14px] border border-line bg-surface-2 p-1.5 pl-3 transition-colors focus-within:border-accent">
                <textarea
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value.slice(0, MAX_CHARS))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      void send(draft);
                    }
                  }}
                  rows={1}
                  placeholder="Ask a question…"
                  aria-label="Your question"
                  className="max-h-28 min-h-9 flex-1 resize-none bg-transparent py-2 text-[14.5px] text-ink outline-none [field-sizing:content] placeholder:text-ink-3"
                />
                {busy ? (
                  <button
                    type="button"
                    onClick={() => abort.current?.abort()}
                    aria-label="Stop answering"
                    className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-ink text-bg transition-transform active:scale-95"
                  >
                    <Square size={13} fill="currentColor" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!draft.trim()}
                    data-sound="none"
                    aria-label="Send"
                    className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-accent text-accent-ink transition-[transform,opacity] active:scale-95 disabled:opacity-40"
                  >
                    <ArrowUp size={17} strokeWidth={2.25} aria-hidden="true" />
                  </button>
                )}
              </div>
              <p className="mt-2 px-1 text-[11.5px] leading-snug text-ink-3">
                AI can make mistakes. For anything important, email{" "}
                <a href={`mailto:${profile.email}`} className="underline underline-offset-2 hover:text-ink">
                  {profile.email}
                </a>
                .
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Bubble({ role, error, children }: { role: Message["role"]; error?: boolean; children: React.ReactNode }) {
  const mine = role === "user";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] space-y-2 rounded-[16px] px-3.5 py-2.5 text-[14.5px] leading-relaxed break-words ${
          mine
            ? "rounded-br-[6px] bg-accent text-accent-ink whitespace-pre-wrap"
            : error
              ? "rounded-bl-[6px] border border-[color-mix(in_oklab,var(--heart)_35%,var(--line))] bg-surface-2 text-ink-2"
              : "rounded-bl-[6px] bg-surface-2 text-ink-2"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
