import { ViewTransition } from "react";
import { Hero } from "@/components/sections/Hero";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Values } from "@/components/sections/Values";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Skills } from "@/components/sections/Skills";
import { Certificates } from "@/components/sections/Certificates";
import { Journey } from "@/components/sections/Journey";
import { Contact } from "@/components/sections/Contact";
import { Guestbook } from "@/components/sections/Guestbook";
import { Footer } from "@/components/sections/Footer";
import { Marquee } from "@/components/sections/Marquee";

export default function Home() {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      <div>
        <Hero />
        <FeaturedProjects />
        <Values />
        <Marquee />
        <About />
        <Services />
        <Skills />
        <Certificates />
        <Journey />
        <Guestbook />
        <Contact />
        <Footer />
      </div>
    </ViewTransition>
  );
}
