# Kurt Michael Salut · Portfolio

Personal portfolio built with Next.js 16, Tailwind CSS v4, and Motion.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Editing content

All copy lives in `src/content/`. Edit these files and the whole site updates:

| File | What it controls |
| --- | --- |
| `profile.ts` | Name, pitch, availability, education, about story, quote, socials, email |
| `projects.ts` | Projects and their case studies (`/projects/[slug]`) |
| `site.ts` | Nav, "What I bring", services, work process, skills, journey, latest activity |

### Adding your photo

1. Save it as `public/images/portrait.jpg` (portrait orientation, about 4:5).
2. In `profile.ts`, set `portrait: "/images/portrait.jpg"`.

### Adding project screenshots

Save an image in `public/images/projects/` and add `image: "/images/projects/ziren.jpg"` to that project in `projects.ts`. It replaces the generated topographic cover.

### Contact form

With no backend, the form opens the visitor's email app with the message filled in. To send emails directly, replace `deliver()` in `src/components/contact/ContactForm.tsx` with a call to Formspree, Resend, or a Server Action.

## Structure

```
src/
  app/                 routes: /, /projects/[slug], /resume, 404
  content/             all editable copy
  components/
    sections/          home page sections
    nav/               sidebar, mobile drawer, theme toggle
    art/               generated mountain ridges and topographic covers
    motion/            Reveal, Parallax, Magnetic
    contact/           form and copy-email button
  lib/art.ts           deterministic SVG generators
```

## Design notes

Signature pieces, all built around the "Summit" climb idea:

- First-visit intro: ridges rise out of the mist (once per session).
- Hero: layered mountain range with parallax and a rotating role line.
- Sidebar altitude meter: scroll progress shown as elevation (120 m to 2,400 m).
- Services: the one deliberate night section, with the work process drawn as a climbing route.
- Journey: on wide screens the section pins while a trail draws from base camp to the summit.
- Case studies: cover morphs in from the carousel, sticky table of contents with reading progress.
- Resume: two-column, A4-ready (Save as PDF prints a light version in either theme).

- Palette "Summit": cool mist neutrals with one deep navy accent. Orange is used only for the availability signal.
- Type: Bricolage Grotesque (headings), Geist (body), Geist Mono (labels), Caveat (signature).
- Light and dark themes follow the system setting and can be toggled.
- All motion respects `prefers-reduced-motion`.
