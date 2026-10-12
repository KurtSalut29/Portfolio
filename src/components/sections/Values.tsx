import { values } from "@/content/site";
import { Container } from "@/components/ui/Section";
import { Icon } from "@/components/icons/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { SectionLink } from "@/components/nav/SectionLink";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Spotlight } from "@/components/motion/Spotlight";
import { WordReveal } from "@/components/motion/WordReveal";


/** Bento: one statement cell plus one cell per value (5 cells, 3x2 on desktop). */
export function Values() {
  return (
    <section aria-labelledby="values-title" className="py-14 lg:py-20">
      <Container>
        <ul className="grid gap-3 sm:grid-cols-2">
          <Reveal
            as="li"
            className="relative isolate flex min-h-[300px] flex-col overflow-hidden rounded-[var(--radius-card)] bg-accent p-7 text-accent-ink sm:col-span-2"
          >
            <h2 id="values-title" className="max-w-[12ch] text-[2.25rem] leading-[1.04] font-semibold tracking-[-0.03em] sm:text-[2.75rem]">
              <WordReveal text="What I bring to your team." />
            </h2>
            <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed opacity-80">
              Clear communication, reliable delivery. Here is what you can expect when we work together.
            </p>
            <SectionLink
              to="contact"
              className="link-underline relative z-10 mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-medium"
            >
              Let&apos;s talk
              <ArrowRightIcon size={14} weight="bold" aria-hidden="true" />
            </SectionLink>
          </Reveal>

          {values.map((v, i) => (
            <Reveal as="li" key={v.title} delay={0.05 * (i + 1)}>
              <Spotlight
                className={`group card h-full p-6 transition-[border-color,transform] duration-300 ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-line-strong ${
                  i === 1 ? "bg-[radial-gradient(120%_90%_at_100%_0%,var(--accent-soft),var(--surface)_60%)]" : ""
                }`}
              >
              <span className="grid size-11 place-items-center rounded-[var(--radius-control)] bg-accent-soft text-accent transition-transform duration-300 ease-[var(--ease-out)] group-hover:-rotate-6 group-hover:scale-110">
                <Icon name={v.icon} size={22} weight="duotone" />
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-ink">{v.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{v.body}</p>
              </Spotlight>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
