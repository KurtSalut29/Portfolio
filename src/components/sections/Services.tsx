import { ArrowRightIcon, RocketLaunchIcon } from "@phosphor-icons/react/dist/ssr";
import { services, workflow } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/icons/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { Spotlight } from "@/components/motion/Spotlight";
import { SectionLink } from "@/components/nav/SectionLink";

/** Services, then the working process. Follows the site theme like every other section. */
export function Services() {
  return (
    <section id="services" className="relative isolate">
      <div className="relative">
        <Container className="py-20 lg:py-28">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionHeading
              eyebrow="Services"
              title="How I can help."
              lead="Need a website, an app, or an extra pair of hands on your team? Here is what I can take on today."
            />
            <Reveal delay={0.2}>
              <Magnetic>
                <SectionLink to="contact" className="btn btn-primary">
                  Let&apos;s talk
                  <ArrowRightIcon size={16} weight="bold" className="btn-arrow" aria-hidden="true" />
                </SectionLink>
              </Magnetic>
            </Reveal>
          </div>

          <ul className="mt-14 grid gap-3 md:grid-cols-2">
            {services.map((s, i) => (
              <Reveal as="li" key={s.title} delay={0.06 * i}>
                <Spotlight className="group card flex h-full flex-col p-7 transition-[border-color] duration-300 hover:border-line-strong">
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid size-12 place-items-center rounded-[var(--radius-control)] bg-accent-soft text-accent transition-transform duration-300 ease-[var(--ease-out)] group-hover:-rotate-6 group-hover:scale-110">
                      <Icon name={s.icon} size={24} weight="duotone" />
                    </span>
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold tracking-tight text-ink">{s.title}</h3>
                  <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-ink-2">{s.body}</p>
                  <p className="mt-auto pt-6 text-[13px] text-ink-3">
                    <span className="text-ink-2">Good for:</span> {s.forWho}
                  </p>
                </Spotlight>
              </Reveal>
            ))}
          </ul>

          {/* The working process */}
          <div className="mt-24">
            <Reveal>
              <h3 className="text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">How we would work together</h3>
              <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-ink-2">
                Four steps from first call to launch. You always know which stage we are in.
              </p>
            </Reveal>
            <div className="relative mt-12">
              <ol className="relative grid gap-10 sm:grid-cols-2">
                {workflow.map((step, i) => {
                  const last = i === workflow.length - 1;
                  return (
                    <Reveal as="li" key={step.title} delay={0.12 * i}>
                      <span
                        className={`relative grid size-9 place-items-center rounded-full border ${
                          last
                            ? "border-accent bg-accent text-accent-ink shadow-[0_0_0_6px_var(--accent-soft)]"
                            : "border-line-strong bg-bg text-ink-2"
                        }`}
                      >
                        {last ? (
                          <RocketLaunchIcon size={16} weight="fill" aria-hidden="true" />
                        ) : (
                          <span className="font-mono text-xs">{i + 1}</span>
                        )}
                      </span>
                      <p className="mt-5 font-display text-xl font-semibold tracking-tight text-ink">{step.title}</p>
                      <p className="mt-2 max-w-[30ch] text-[15px] leading-relaxed text-ink-2">{step.body}</p>
                    </Reveal>
                  );
                })}
              </ol>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
