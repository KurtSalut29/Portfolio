import { Star } from "lucide-react";

/** A read-only star row. Averages round to the nearest half star, so 4.5 shows four and a half. */
export function Stars({ value, size = 14, className = "" }: { value: number; size?: number; className?: string }) {
  const halves = Math.round(value * 2) / 2;
  return (
    <span role="img" aria-label={`${halves} out of 5 stars`} className={`inline-flex gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = Math.min(1, Math.max(0, halves - (n - 1)));
        return (
          <span key={n} className="relative inline-flex" aria-hidden="true">
            <Star size={size} strokeWidth={1.75} className="text-line-strong" />
            {fill > 0 && (
              <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star size={size} strokeWidth={1.75} className="fill-[var(--star)] text-[var(--star)]" />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
