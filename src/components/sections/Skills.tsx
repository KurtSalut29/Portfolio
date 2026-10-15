import { skillGroups } from "@/content/site";
import { projects } from "@/content/projects";
import { Container, SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/icons/Icon";
import { TechIcon } from "@/components/icons/TechIcon";
import { Reveal } from "@/components/motion/Reveal";

/** Which projects used a tool, matched against each project's stack. Proof, not just a list. */
function usedIn(tool: string) {
  const t = tool.toLowerCase();
  return projects.filter((p) => p.stack.some((s) => s.toLowerCase() === t)).map((p) => p.name);
}

/**
 * The toolkit as a table: what each group is for on the left, the tools on the right
 * in their own brand colors. Tools used in a project here carry a count.
 */
export function Skills() {
  return (
    <section id="skills" className="py-20 lg:py-28">
      <Container>
        <SectionHeading
          title="Skills and tools."
          lead="Everything I use to take a project from idea to launch. The number on a tool shows how many projects on this site use it."
        />

        <Reveal className="card mt-12 divide-y divide-line">
          {skillGroups.map((g) => (
            <div key={g.title} className="grid gap-4 p-5 sm:grid-cols-[180px_1fr] sm:gap-6 sm:p-6">
              <div>
                <p className="flex items-center gap-2 font-semibold text-ink">
                  <Icon name={g.icon} size={16} weight="bold" className="text-accent" />
                  {g.title}
                </p>
                <p className="mt-1 text-[13.5px] leading-snug text-ink-3">{g.blurb}</p>
              </div>
              <ul className="flex flex-wrap content-start gap-2">
                {g.items.map((t) => {
                  const used = usedIn(t.name);
                  return (
                    <li
                      key={t.name}
                      tabIndex={used.length ? 0 : undefined}
                      className="tip-host relative flex h-9 items-center gap-2 rounded-[10px] border border-line bg-surface-2 pr-3 pl-2.5 text-[14px] text-ink transition-[border-color,background-color] duration-200 hover:border-line-strong hover:bg-surface"
                    >
                      <TechIcon slug={t.slug} name={t.name} size={16} brand />
                      {t.name}
                      {used.length > 0 && (
                        <>
                          <span className="grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent-soft px-1 font-mono text-[10.5px] font-medium text-accent">
                            {used.length}
                            <span className="sr-only"> projects</span>
                          </span>
                          <span
                            role="tooltip"
                            className="tip absolute bottom-full left-0 z-20 mb-2 rounded-[10px] bg-ink px-3 py-2 text-xs whitespace-nowrap text-bg shadow-[var(--card-shadow-lift)]"
                          >
                            <span className="opacity-70">Used in </span>
                            {used.join(", ")}
                          </span>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
