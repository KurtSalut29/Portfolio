"use client";

import { useState } from "react";
import { Stars } from "./Stars";

export type ShownEntry = { id: number; name: string; role: string | null; message: string; rating: number | null; date: string; iso: string };

const FIRST = 6;

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

/** Approved comments, newest first. The first few show; the rest wait behind "Show all". */
export function GuestbookList({ entries }: { entries: ShownEntry[] }) {
  const [all, setAll] = useState(false);
  const shown = all ? entries : entries.slice(0, FIRST);

  return (
    <>
      <ul className="grid gap-3 sm:grid-cols-2">
        {shown.map((e) => (
          <li key={e.id} className="card flex flex-col p-5">
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
            <p className={`${e.rating ? "mt-2" : "mt-4"} flex-1 text-[14.5px] leading-relaxed whitespace-pre-line text-ink-2`}>
              {e.message}
            </p>
            <time dateTime={e.iso} className="mt-4 text-[12px] text-ink-3">
              {e.date}
            </time>
          </li>
        ))}
      </ul>
      {entries.length > FIRST && (
        <button
          type="button"
          onClick={() => setAll((v) => !v)}
          aria-expanded={all}
          className="btn btn-secondary mx-auto mt-5 flex"
        >
          {all ? "Show fewer" : `Show all ${entries.length} comments`}
        </button>
      )}
    </>
  );
}
