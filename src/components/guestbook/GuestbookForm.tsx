"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Check, Star } from "lucide-react";
import { GUESTBOOK_LIMITS as LIMITS } from "@/lib/guestbook";
import { play } from "@/lib/sound";

const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

/** Name, optional role, optional star rating, and the comment. Posts go to a review queue, not straight onto the page. */
export function GuestbookForm() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const shownAt = useRef(0);

  useEffect(() => {
    shownAt.current = Date.now();
  }, [state]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          role: form.get("role"),
          message,
          rating: rating || null,
          website: form.get("website"),
          elapsed: Date.now() - shownAt.current,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Couldn't post your comment. Please try again.");
      setState("sent");
      setRating(0);
      setMessage("");
      play("success");
    } catch (err) {
      setError((err as Error).message);
      setState("idle");
    }
  }

  if (state === "sent") {
    return (
      <div className="card flex flex-col items-center p-8 text-center" role="status">
        <span className="grid size-11 place-items-center rounded-full bg-[color-mix(in_oklab,var(--live)_16%,transparent)] text-[var(--live)]">
          <Check size={22} strokeWidth={2.25} aria-hidden="true" />
        </span>
        <p className="mt-4 font-semibold text-ink">Thanks for your comment!</p>
        <p className="mt-1 max-w-[40ch] text-[14.5px] leading-relaxed text-ink-2">
          It will show up here once I&apos;ve reviewed it.
        </p>
        <button type="button" onClick={() => setState("idle")} className="link-underline mt-5 text-sm font-medium text-ink">
          Write another
        </button>
      </div>
    );
  }

  const shown = hover || rating;
  const field =
    "w-full rounded-[12px] border border-line bg-surface-2 px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-line-strong focus:bg-surface";

  return (
    <form onSubmit={submit} className="card p-5 sm:p-6">
      <p className="font-semibold text-ink">Leave a comment</p>
      <p className="mt-1 text-[14px] text-ink-2">Comments appear after I review them.</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[13px] text-ink-2">Name</span>
          <input name="name" required maxLength={LIMITS.name} autoComplete="name" placeholder="Your name" className={field} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] text-ink-2">
            Role or company <span className="text-ink-3">(optional)</span>
          </span>
          <input name="role" maxLength={LIMITS.role} autoComplete="organization-title" placeholder="e.g. Recruiter at Acme" className={field} />
        </label>
      </div>

      {/* Star rating: a radio group, so arrow keys work */}
      <fieldset className="mt-4">
        <legend className="mb-1.5 text-[13px] text-ink-2">
          Rating <span className="text-ink-3">(optional)</span>
        </legend>
        <div className="flex items-center gap-3">
          <div className="flex" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} className="cursor-pointer p-0.5" onMouseEnter={() => setHover(n)} data-sound="none">
                <input
                  type="radio"
                  name="rating"
                  value={n}
                  checked={rating === n}
                  // Choosing the same star again clears the rating.
                  onClick={() => rating === n && setRating(0)}
                  onChange={() => setRating(n)}
                  className="peer sr-only"
                  aria-label={`${n} star${n > 1 ? "s" : ""}, ${LABELS[n]}`}
                />
                <Star
                  size={26}
                  strokeWidth={1.6}
                  aria-hidden="true"
                  className={`rounded-[4px] transition-[transform,color,fill] duration-150 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent hover:scale-110 ${
                    n <= shown ? "fill-[var(--star)] text-[var(--star)]" : "text-line-strong"
                  }`}
                />
              </label>
            ))}
          </div>
          <span className="text-[13px] text-ink-3" aria-hidden="true">
            {LABELS[shown]}
          </span>
        </div>
      </fieldset>

      <label className="mt-4 block">
        <span className="mb-1.5 flex justify-between text-[13px] text-ink-2">
          Comment
          <span className={message.length > LIMITS.message - 50 ? "text-ink" : "text-ink-3"} aria-hidden="true">
            {message.length}/{LIMITS.message}
          </span>
        </span>
        <textarea
          name="message"
          required
          minLength={2}
          maxLength={LIMITS.message}
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Feedback on my work, a suggestion, or just a hello."
          className={`${field} min-h-28 resize-y leading-relaxed`}
        />
      </label>

      {/* Hidden from people; bots fill it in */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] size-px opacity-0" />

      {error && (
        <p role="alert" className="mt-3 text-[14px] text-[var(--heart)]">
          {error}
        </p>
      )}

      <button type="submit" disabled={state === "sending"} data-sound="none" className="btn btn-primary mt-5 w-full sm:w-auto">
        {state === "sending" ? "Posting…" : "Post comment"}
      </button>
    </form>
  );
}
