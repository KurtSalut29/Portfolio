import { Container, SectionHeading } from "@/components/ui/Section";
import { CertificateGrid } from "@/components/certificates/CertificateGrid";

export function Certificates() {
  return (
    <section id="certificates" className="py-20 lg:py-28">
      <Container>
        <SectionHeading
          title="Certificates and recognition."
          lead="Courses, workshops, and one competition. I keep learning so every project is better than the last. Tap any certificate to see it full size."
        />
        <CertificateGrid />
      </Container>
    </section>
  );
}
