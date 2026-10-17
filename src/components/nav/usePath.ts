"use client";

import { usePathname } from "next/navigation";

/**
 * usePathname, with "/index" read as "/". When Vercel regenerates the cached home page (ISR),
 * the server renders it as "/index" while the browser is on "/". Anything that compared against "/"
 * then rendered differently on the server and in the browser, React threw away the server HTML,
 * and with it the attributes the intro and sidebar scripts had set on <html>: the splash never lifted.
 */
export function usePath() {
  const pathname = usePathname();
  return pathname === "/index" ? "/" : pathname;
}
