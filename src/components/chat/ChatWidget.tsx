"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { Sparkles, X } from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState, type FormEvent } from "react";
import { profile } from "@/content/profile";
import { play } from "@/lib/sound";
import { ASK_EVENT, openAsk } from "./ask";
import { Markdown } from "./Markdown";

type Message = { role: "user" | "assistant"; text: string };
type Phase = "idle" | "thinking" | "answering" | "done";

const SUGGESTIONS = ["what does kurt build?", "what tech stack does he use?", "is he open to work?"];
const MAX_CHARS = 800;
const STORE = "kms-chat";
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * "Ask about Kurt": a full-screen prompt over the blurred page, modeled on bryllim.com's "ask anything".
 * One big question, a blinking caret, the visitor's question as a bubble, a shimmering "thinking",
 * then the answer streams in from /api/chat (which answers only from this portfolio's content).
 * Earlier questions stay in the conversation sent to the model, so follow-ups work.
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [draft, setDraft] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [failed, setFailed] = useState(false);
  const history = useRef<Message[]>([]);
  const abort = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const lenis = useLenis();

  // Open from the sidebar, the mobile button, or Alt+K.
  useEffect(() => {
    const show = () => {
      opener.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && !e.ctrlKey && !e.metaKey && e.code === "KeyK") {
        e.preventDefault();
        play("open");
        show();
      }
    };
    window.addEventListener(ASK_EVENT, show);
    window.addEventListener("keydown", onKey);
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORE) ?? "[]");
      if (Array.isArray(saved)) history.current = saved;
    } catch {}
    return () => {
      window.removeEventListener(ASK_EVENT, show);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  function close() {
    abort.current?.abort();
    setOpen(false);
    setPhase((p) => (p === "thinking" || p === "answering" ? "idle" : p));
    play("close");
    opener.current?.focus?.({ preventScroll: true });
  }

  // While open: the page underneath holds still, the caret is ready for typing, and Escape closes.
  const onEscape = useEffectEvent(() => close());
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 60);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onEscape();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      lenis?.start();
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis]);

  // After an answer, the caret is back so a follow-up can be typed straight away.
  useEffect(() => {
    if (phase === "done") inputRef.current?.focus({ preventScroll: true });
  }, [phase]);

  async function ask(text: string) {
    const q = text.trim().slice(0, MAX_CHARS);
    if (!q || phase === "thinking" || phase === "answering") return;
    setQuestion(q);
    setAnswer("");
    setFailed(false);
    setDraft("");
    setPhase("thinking");
    play("send");

    const messages = [...history.current, { role: "user" as const, text: q }].slice(-12);
    const controller = new AbortController();
    abort.current = controller;
    const fail = (text: string) => {
      setFailed(true);
      setAnswer(text);
      setPhase("done");
    };

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const { error } = await res.json().catch(() => ({ error: "" }));
        return fail(`${error || "Something went wrong."} You can also email Kurt at ${profile.email}.`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        if (reply.trim()) {
          setPhase("answering");
          setAnswer(reply);
        }
      }
      if (!reply.trim()) return fail(`I couldn't come up with an answer. Try asking another way, or email Kurt at ${profile.email}.`);
      history.current = [...messages, { role: "assistant" as const, text: reply }].slice(-12);
      try {
        sessionStorage.setItem(STORE, JSON.stringify(history.current));
      } catch {}
      setPhase("done");
      play("send");
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      fail(`Couldn't reach the assistant. Check your connection, or email Kurt at ${profile.email}.`);
    } finally {
      abort.current = null;
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    void ask(draft);
  }

  function startOver() {
    setPhase("idle");
    setQuestion("");
    setAnswer("");
    setDraft("");
    inputRef.current?.focus({ preventScroll: true });
  }

  const busy = phase === "thinking" || phase === "answering";
  const fresh = phase === "idle";

  return (
    <div className="no-print">
      {/* Phones: a round button above the tab bar. Desktop opens it from the sidebar (or Alt+K). */}
      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            onClick={openAsk}
            data-sound="open"
            aria-label="Ask about Kurt (AI)"
            aria-haspopup="dialog"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="chat-launcher fixed right-4 z-20 grid size-12 place-items-center rounded-full bg-accent text-accent-ink shadow-[0_10px_30px_-10px_color-mix(in_oklab,var(--accent)_70%,transparent)] transition-transform active:scale-95 lg:hidden"
          >
            <Sparkles size={20} strokeWidth={1.9} aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="ask"
            role="dialog"
            aria-modal="true"
            aria-label="Ask about Kurt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="ask fixed inset-0 z-[90]"
          >
            {/* The page, blurred and faded behind the prompt */}
            <div className="ask-backdrop absolute inset-0" aria-hidden="true" />

            <button
              type="button"
              onClick={close}
              data-sound="none"
              aria-label="Close"
              className="absolute top-4 right-4 z-10 flex h-9 items-center gap-2 rounded-full bg-[color-mix(in_oklab,var(--bg)_75%,transparent)] px-3 font-mono text-[12px] text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink sm:top-6 sm:right-6"
            >
              <span className="hidden sm:inline">esc</span>
              <X size={16} strokeWidth={2} aria-hidden="true" />
            </button>

            {/* Scrolls on its own when an answer runs long. Clicking the empty space closes. */}
            <div
              data-lenis-prevent
              className="relative h-full overflow-y-auto overscroll-contain"
              onClick={(e) => e.target === e.currentTarget && close()}
            >
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
                className="flex min-h-full w-full max-w-[860px] flex-col items-start justify-center gap-6 py-24 pr-6 pl-[clamp(1.5rem,9vw,8rem)]"
                onClick={(e) => (e.target === e.currentTarget ? close() : inputRef.current?.focus({ preventScroll: true }))}
              >
                {/* What the visitor asked */}
                {question && (
                  <motion.p
                    key={question}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.24, ease: EASE }}
                    className="ask-bubble"
                  >
                    {question}
                  </motion.p>
                )}

                {/* The big prompt, or a shimmering "thinking" while the answer is on its way */}
                {(fresh || phase === "thinking") && (
                  <div className={`flex max-w-full items-center gap-[0.5em] ${phase === "thinking" ? "ask-shimmer" : ""}`}>
                    {phase === "thinking" && <span className="ask-loader" aria-hidden="true" />}
                    <h2 className={`ask-title ${phase === "thinking" ? "is-small" : ""}`} aria-live="polite">
                      {phase === "thinking" ? "thinking" : "what do you want to ask?"}
                    </h2>
                  </div>
                )}

                {/* The answer, streaming in */}
                {answer && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    aria-live="polite"
                    className={`ask-answer ${failed ? "text-ink-2" : "text-ink"}`}
                  >
                    <Markdown text={answer} />
                  </motion.div>
                )}

                {/* The prompt: what you type shows here, with a blinking caret */}
                {!busy && (
                  <form onSubmit={submit} className="w-full">
                    <label className="ask-field">
                      {!fresh && <span className="mr-[0.6em] text-ink-3 select-none">&gt;</span>}
                      <span className={draft ? "text-ink-2" : "text-ink-3"}>{draft || (fresh ? "" : "ask a follow-up")}</span>
                      <span className="ask-caret" aria-hidden="true" />
                      <input
                        ref={inputRef}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value.slice(0, MAX_CHARS))}
                        aria-label="Type your question, then press Enter"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                        enterKeyHint="send"
                        className="ask-input"
                      />
                    </label>
                  </form>
                )}

                {/* A few starting points, before the first question */}
                {fresh && (
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[13px] text-ink-3">
                    <span>try</span>
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          void ask(s);
                        }}
                        className="underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {phase === "done" && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      startOver();
                    }}
                    className="font-mono text-[13px] text-ink-3 underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink"
                  >
                    start over
                  </button>
                )}

                {/* In the flow (not pinned to the bottom), so a long answer never runs underneath it */}
                <p className="mt-4 max-w-[640px] font-mono text-[11.5px] leading-snug text-ink-3">
                  ai · answers come from this portfolio and can be wrong · for anything important, email {profile.email}
                </p>
              </motion.div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
