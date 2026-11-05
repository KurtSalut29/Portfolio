"use client";

import { useState, type CSSProperties } from "react";
import { Stars } from "./Stars";

export type ShownEntry = { id: number; name: string; role: string | null; message: string; rating: number | null; date: string; iso: string };

/** From this many comments the list drifts like the certificates. Fewer would visibly repeat. */
const MARQUEE_FROM = 4;
/** Longer than this gets clamped on a drifting card, with "Read more" to open it. */
const LONG_MESSAGE = 150;
/** Seconds each card adds to the loop, so the speed stays the same however many comments there are. */
const SECONDS_PER_CARD = 11;

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

function Comment({
  entry: e,
  clamped = false,
  expanded = false,
  onToggle,
}: {
  entry: ShownEntry;
  clamped?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
}) {
  const long = clamped && e.message.length > LONG_MESSAGE;
  return (
    <>
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-soft text-[13px] font-semibold text-accent"
        >
          {initials(e.name)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14.5px] font-semibold text-ink">{e.name}</p>
          {e.role && <p className="truncate text-[12.5px] text-ink-3">{e.role}</p>}
        </div>
      </div>
      {e.rating && <Stars value={e.rating} className="mt-4" />}
      <p
        className={`${e.rating ? "mt-2" : "mt-4"} flex-1 text-[14.5px] leading-relaxed whitespace-pre-line text-ink-2 ${
          long && !expanded ? "line-clamp-4" : ""
        }`}
      >
        {e.message}
      </p>
      {long && (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="link-underline mt-2 self-start text-[13px] font-medium text-ink transition-[background-size,scale] active:scale-[0.97]"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
      <time dateTime={e.iso} className="mt-4 text-[12px] text-ink-3">
        {e.date}
      </time>
    </>
  );
}

/** Approved comments, newest first: a grid while there are few, then a slow drift that pauses on hover. */
export function GuestbookList({ entries }: { entries: ShownEntry[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  if (entries.length < MARQUEE_FROM) {
    return (
      <ul className="grid gap-3 sm:grid-cols-2">
        {entries.map((e) => (
          <li key={e.id} className="card flex flex-col p-5">
            <Comment entry={e} />
          </li>
        ))}
      </ul>
    );
  }

  // One run of cards. The track holds two runs and slides by exactly one, so the loop is seamless.
  const row = (dup: boolean) => (
    <ul
      className={`flex shrink-0 items-stretch gap-3 pr-3 ${dup ? "marquee-dup" : ""}`}
      aria-hidden={dup || undefined}
      // The copy is for the eye only: keep it out of the tab order and away from screen readers.
      inert={dup}
    >
      {entries.map((e) => (
        <li key={e.id} className="card flex w-[300px] shrink-0 flex-col p-5">
          <Comment
            entry={e}
            clamped
            expanded={expanded === e.id}
            onToggle={() => setExpanded((id) => (id === e.id ? null : e.id))}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      // Holding still while a comment is open, because a tap doesn't count as hover or focus on every phone.
      data-paused={expanded !== null || undefined}
      className="marquee -mx-4 overflow-hidden px-4 py-2 sm:-mx-6 sm:px-6"
      role="region"
      aria-label="Guestbook comments"
    >
      <div
        className="marquee-track flex w-max"
        style={{ "--marquee-duration": `${entries.length * SECONDS_PER_CARD}s` } as CSSProperties}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
