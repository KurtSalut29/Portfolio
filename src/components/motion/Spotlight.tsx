"use client";

import type { ComponentPropsWithoutRef } from "react";

/**
 * A card whose border lights up under the cursor (see .spotlight in globals.css).
 * Decorative: CSS hides it on touch devices, and it never moves layout.
 */
export function Spotlight({ className = "", children, ...rest }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...rest}
      className={`spotlight ${className}`}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </div>
  );
}
