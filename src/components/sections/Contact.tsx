import { profile } from "@/content/profile";
import { Container } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SocialLinks } from "@/components/nav/SocialLinks";
import { CopyEmail } from "@/components/contact/CopyEmail";
import { ContactForm } from "@/components/contact/ContactForm";
import { WordReveal } from "@/components/motion/WordReveal";
import { Spotlight } from "@/components/motion/Spotlight";

export function Contact() {
  return (
    <section id="contact" className="py-20 lg:py-28">
      <Container>
        <Reveal>
        <Spotlight className="card relative isolate grid overflow-hidden">
          <div className="relative flex flex-col overflow-hidden border-b border-line p-7 sm:p-10">
            <h2 className="text-[2.5rem] leading-[1.02] font-semibold tracking-[-0.035em] text-ink sm:text-[3.5rem]">
              <WordReveal text="Let's build something useful." />
            </h2>
            <p className="mt-5 max-w-[40ch] text-[1.0625rem] leading-relaxed text-ink-2">
              Hiring a developer, need help with a project, or want to collaborate? I&apos;d love to hear
              about it.
            </p>
            {profile.availability.open && (
              <p className="mt-6 flex items-center gap-2.5 text-sm text-ink-2">
                <span className="status-dot" aria-hidden="true" />
                {profile.availability.label}
              </p>
            )}
            <p className="mt-2 pl-[18px] text-sm text-ink-3">Based in {profile.location}. Philippine time, UTC+8.</p>
            <div className="mt-8">
              <CopyEmail email={profile.email} />
              <SocialLinks className="-mx-2 mt-4" />
            </div>
          </div>
          <div className="p-7 sm:p-10">
            <ContactForm to={profile.email} />
          </div>
        </Spotlight>
        </Reveal>
      </Container>
    </section>
  );
}
