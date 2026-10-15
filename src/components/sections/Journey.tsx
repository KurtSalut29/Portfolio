import { Container, SectionHeading } from "@/components/ui/Section";
import { GitHubActivity } from "./GitHubActivity";
import { JourneyTrail } from "./JourneyTrail";

const TITLE = "My journey so far."
const LEAD = "Every project taught me something new. Here is where I have been, and where I am headed next.";

export function Journey() {
  return (
    <section id="journey" className="py-20 lg:py-28">
      <Container>
        <SectionHeading title={TITLE} lead={LEAD} />
        <div className="mt-12">
          <JourneyTrail />
        </div>
      </Container>

      <Container className="mt-14">
        <GitHubActivity />
      </Container>
    </section>
  );
}
