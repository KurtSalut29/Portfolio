import { skillGroups } from "@/content/site";
import { TechIcon } from "@/components/icons/TechIcon";
import { Container } from "@/components/ui/Section";

const tools: { name: string; slug: string }[] = skillGroups.flatMap((g) => [...g.items]);

/** The page's one marquee: a quiet band of the tools behind the work. Pauses on hover. */
export function Marquee() {
  const row = (dup: boolean) => (
    <ul
      className={`flex shrink-0 items-center gap-10 pr-10 ${dup ? "marquee-dup" : ""}`}
      aria-hidden={dup || undefined}
    >
      {tools.map((t) => (
        <li key={t.name} className="flex items-center gap-2.5 text-ink-3 transition-colors duration-200 hover:text-ink">
          <TechIcon slug={t.slug} name={t.name} size={20} />
          <span className="font-display text-lg font-medium tracking-tight whitespace-nowrap">{t.name}</span>
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="Tools I work with">
      <Container>
        <div className="marquee overflow-hidden border-y border-line py-7">
          <div className="marquee-track flex w-max">
            {row(false)}
            {row(true)}
          </div>
        </div>
      </Container>
    </section>
  );
}
