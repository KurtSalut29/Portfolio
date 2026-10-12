import Link from "next/link";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Section";
import { SectionLink } from "@/components/nav/SectionLink";

export default function NotFound() {
  return (
    <div className="grid min-h-[calc(100dvh-4rem)] place-items-center lg:min-h-dvh">
      <Container className="text-center">
        <p className="label-mono">Error 404</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-[-0.04em] text-ink sm:text-6xl">Page not found.</h1>
        <p className="mx-auto mt-5 max-w-[38ch] text-lg leading-relaxed text-ink-2">
          This page doesn&apos;t exist, or it moved. Head back home or take a look at my work.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/" transitionTypes={["nav-back"]} className="btn btn-primary">
            <ArrowLeftIcon size={16} aria-hidden="true" />
            Back home
          </Link>
          <SectionLink to="projects" className="btn btn-secondary">
            See projects
          </SectionLink>
        </div>
      </Container>
    </div>
  );
}
