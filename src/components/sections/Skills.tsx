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

/** One panel split into columns, so the stack reads as a single toolkit. */
export function Skills() {
  return (
    <section id="skills" className="py-20 lg:py-28">
      <Container>
        <SectionHeading
          title="My toolkit."
          lead="The languages, frameworks, and tools I use to take an idea from sketch to deployed product. Hover one to see where I used it."
        />
        <Reveal className="card mt-12 grid gap-px overflow-hidden bg-line sm:grid-cols-2">
          {skillGroups.map((g) => (
            <div key={g.title} className="bg-surface p-6">
              <p className="flex items-center gap-2 text-sm font-medium text-ink">
                <Icon name={g.icon} size={16} className="text-accent" weight="bold" />
                {g.title}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {g.items.map((t) => {
                  const used = usedIn(t.name);
                  return (
                    <li
                      key={t.name}
                      tabIndex={used.length ? 0 : undefined}
                      className={`group tip-host relative flex h-9 items-center gap-2 rounded-full border border-line bg-surface-2 pr-3.5 pl-2.5 text-[13.5px] text-ink-2 transition-[color,border-color,background-color] duration-200 hover:border-line-strong hover:bg-surface hover:text-ink ${
                        used.length ? "cursor-default" : ""
                      }`}
                    >
                      <span className="text-ink-3 transition-colors duration-200 group-hover:text-accent">
                        <TechIcon slug={t.slug} name={t.name} size={15} />
                      </span>
                      {t.name}
                      {used.length > 0 && (
                        <>
                          <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
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
        <p className="mt-4 flex items-center gap-2 text-[13px] text-ink-3">
          <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
          Used in a project on this site
        </p>
      </Container>
    </section>
  );
}
