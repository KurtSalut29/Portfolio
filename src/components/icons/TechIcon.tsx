import * as si from "simple-icons";

type SimpleIcon = { title: string; path: string; hex: string };

export function lookup(slug: string): SimpleIcon | undefined {
  const key = `si${slug.charAt(0).toUpperCase()}${slug.slice(1)}` as keyof typeof si;
  const icon = si[key] as unknown;
  return icon && typeof icon === "object" && "path" in icon ? (icon as SimpleIcon) : undefined;
}

/** Brand colors this close to black or white vanish on one of the themes; those follow the text color instead. */
export function readable(hex: string) {
  const n = parseInt(hex, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return lum > 0.2 && lum < 0.9;
}

/** Brand logo from Simple Icons: in currentColor by default, or its brand color with `brand`. */
export function TechIcon({ slug, name, size = 18, brand = false }: { slug: string; name: string; size?: number; brand?: boolean }) {
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
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={brand && readable(icon.hex) ? `#${icon.hex}` : "currentColor"}
      aria-hidden="true"
    >
      <path d={icon.path} />
    </svg>
  );
}
