import { Fragment, type ReactNode } from "react";

/**
 * Just enough Markdown for chat replies: paragraphs, bullet and numbered lists, **bold**, and links.
 * Builds React elements (never HTML strings), so a reply can't inject markup.
 */
const INLINE = /\*\*(.+?)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)|(https?:\/\/[^\s)]+[^\s).,!?])/g;

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const [, bold, label, href, bare] = m;
    if (bold) out.push(<strong key={m.index} className="font-semibold text-ink">{bold}</strong>);
    else {
      const url = href ?? bare!;
      const external = /^https?:/.test(url) && !url.includes("kurtmichaelsalut");
      out.push(
        <a
          key={m.index}
          href={url}
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
          className="font-medium text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent"
        >
          {label ?? url.replace(/^https?:\/\/(www\.)?/, "")}
        </a>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  const flush = () => {
    if (!list) return;
    const Tag = list.ordered ? "ol" : "ul";
    blocks.push(
      <Tag key={blocks.length} className={`space-y-1 pl-5 ${list.ordered ? "list-decimal" : "list-disc"} marker:text-ink-3`}>
        {list.items.map((item, i) => (
          <li key={i}>{inline(item)}</li>
        ))}
      </Tag>,
    );
    list = null;
  };

  for (const raw of text.split("\n")) {
    const line = raw.trim();
    const bullet = /^[-*•]\s+(.*)$/.exec(line);
    const numbered = /^\d+[.)]\s+(.*)$/.exec(line);
    if (bullet || numbered) {
      const ordered = !!numbered;
      if (list && list.ordered !== ordered) flush();
      list ??= { ordered, items: [] };
      list.items.push((bullet ?? numbered)![1]);
      continue;
    }
    flush();
    if (!line) continue;
    // Headings come through as bold lines; the window is too small for real ones.
    const heading = /^#{1,6}\s+(.*)$/.exec(line);
    blocks.push(<p key={blocks.length}>{heading ? <strong className="font-semibold text-ink">{heading[1]}</strong> : inline(line)}</p>);
  }
  flush();
  return <Fragment>{blocks}</Fragment>;
}
