import * as si from "simple-icons";

type SimpleIcon = { title: string; path: string; hex: string };

export function lookup(slug: string): SimpleIcon | undefined {
  const key = `si${slug.charAt(0).toUpperCase()}${slug.slice(1)}` as keyof typeof si;
  const icon = si[key] as unknown;
  return icon && typeof icon === "object" && "path" in icon ? (icon as SimpleIcon) : undefined;
}

/** Brand logo from Simple Icons, drawn in currentColor so it follows the theme. */
export function TechIcon({ slug, name, size = 18 }: { slug: string; name: string; size?: number }) {
  const icon = lookup(slug);
  if (!icon) {
    // No logo in the set: fall back to a monogram tile.
    return (
      <span
        aria-hidden="true"
        className="grid place-items-center rounded-[5px] bg-current/10 font-mono text-[9px] font-semibold"
        style={{ width: size, height: size }}
      >
        {name.slice(0, 2).toUpperCase()}
      </span>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}
