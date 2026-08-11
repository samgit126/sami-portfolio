# Samuel Temesgen Yimer — Portfolio

Personal developer portfolio. Vue 3 (Composition API + `<script setup>`), TypeScript, Vite and
Tailwind CSS v4, with a class-based dark/light theme and a technical-schematic visual language.

**Live:** _add the deploy URL here once it's up_

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check (vue-tsc) + production build to dist/
npm run preview  # serve the built dist/ locally
```

Requires Node 20+.

## Structure

```
src/
  main.ts                     app bootstrap, registers the v-reveal directive
  style.css                   Tailwind v4 config + design tokens (CSS-first)
  App.vue                     page shell and section order
  data/portfolio.ts           ALL site content — edit copy here, not in markup
  composables/
    useTheme.ts               dark/light state, localStorage + system preference
    useReducedMotion.ts       reactive prefers-reduced-motion
    useScrollSpy.ts           marks the current section in the header nav
  directives/reveal.ts        v-reveal — fade-up on scroll, no-ops for reduced motion
  components/
    SiteHeader.vue            fixed header, nav, mobile menu
    ThemeToggle.vue           accessible theme switch
    SectionShell.vue          shared section frame (index, eyebrow, title, intro)
    HeroSection.vue           hero: portrait, pitch, stat strip
    ArchitectureDiagram.vue   the signature animated stack diagram
    AboutSection.vue  SkillsSection.vue  ExperienceSection.vue
    ProjectsSection.vue  PublicationsSection.vue  TeachingSection.vue
    EducationSection.vue  ContactSection.vue  SiteFooter.vue
```

### Editing content

Everything — bio, skills, roles, projects, repos, publications, teaching, education, contact —
lives in [`src/data/portfolio.ts`](src/data/portfolio.ts) as typed objects. Adding a project is one
entry in the `projects` array; the grid picks it up automatically. Set `featured: true` to promote
one into the large cards at the top of the section (the first featured entry becomes the wide lead
card).

### Images

Screenshots are committed as optimised WebP under [`public/projects/`](public/projects/) and the
portrait as `public/samuel-temesgen.webp` — about 420 KB in total. The original PNGs in
`src/images/` are ~19 MB and are **git-ignored**; keep your own copy of them. To add or replace one:

```bash
ffmpeg -y -i "src/images/new-project.png" -vf "scale=1280:-2" \
  -c:v libwebp -quality 76 -compression_level 6 public/projects/new-project.webp
```

Then point the project's `image` field at `/projects/new-project.webp`.

### Contribution graphs (Activity section)

The Activity section shows GitHub and GitLab side by side. Each panel renders a dashed drop-in
slot until you give it a screenshot — useful because most of the GitLab work is in private
repositories, so the graph is the only visible evidence of it.

To fill a panel, screenshot the contribution graph from the profile page, then:

```bash
ffmpeg -y -i shot.png -vf "scale=1280:-2" \
  -c:v libwebp -quality 80 -compression_level 6 public/contributions/gitlab.webp
```

and set that source's `image` in `contributions` to `/contributions/gitlab.webp`. The expected
path for each panel is printed inside its empty state, so you can read it straight off the page.

## CV

The PDF CV is generated from the same `src/data/portfolio.ts` the site renders, so the two can't
drift apart. Edit the data, then:

```bash
npm run cv                                  # -> public/samuel-temesgen-yimer-cv.pdf
SITE_URL=https://your-domain.com npm run cv # also prints the site URL in the CV header
```

It writes `cv.html` (git-ignored intermediate) and prints it to A4 PDF with headless Chrome, so
there are no extra npm dependencies. The PDF lands in `public/`, which is why the hero's
**Download CV** button always serves the current build. Layout lives in
[`scripts/generate-cv.mjs`](scripts/generate-cv.mjs).

Featured projects get full entries with bullets; the rest are condensed into a table, which keeps
it to three pages. If you add enough content to spill onto a fourth, tighten `font-size` and the
`section` / `.entry` margins in that script.

## Design system

Tailwind v4 is configured in CSS, not a JS config file. Tokens are defined as CSS custom
properties in `:root` / `.dark` in [`src/style.css`](src/style.css) and exposed to Tailwind through
`@theme inline`, so `bg-surface`, `text-ink-2`, `border-line`, `text-accent` etc. all flip with the
theme automatically.

- **Type** — Space Grotesk (display headings), Inter (body), JetBrains Mono (labels/eyebrows)
- **Accent** — one signal amber, darkened in light mode for contrast
- **Motion** — a single animated moment (the hero stack diagram); everything else is still

Dark mode uses `@custom-variant dark (&:where(.dark, .dark *))` — the v4 equivalent of
`darkMode: 'class'`.

### Theme behaviour

On first load the site follows `prefers-color-scheme` and keeps following it if the OS setting
changes. Once the user clicks the toggle, that choice is written to `localStorage` and wins from
then on. An inline script in `index.html` applies the class before first paint, so there is no
flash of the wrong theme.

### Accessibility

- Skip-to-content link, landmark elements, and a visible `:focus-visible` ring on every control
- Theme toggle exposes `aria-pressed` and a descriptive `aria-label`
- The hero diagram carries `<title>` / `<desc>` and is described in text
- `prefers-reduced-motion: reduce` removes the diagram's pulse animation entirely, disables
  scroll-reveal, and turns off smooth scrolling

## Deploying

**Vercel** — import the repo; `vercel.json` sets the build command and output directory.

**Netlify** — import the repo; `netlify.toml` does the same.

**GitHub Pages** — `.github/workflows/deploy.yml` builds and publishes on every push to `main`.
Enable it under *Settings → Pages → Source: GitHub Actions*. The workflow passes
`BASE_PATH=/<repo-name>/` so assets resolve under the project-site subpath. For a user site
(`<user>.github.io`) drop that env var.

For any other static host: `npm run build` and serve `dist/`.

## Author

**Samuel Temesgen Yimer** — Front-End Developer & Front-End Team Lead, Addis Ababa, Ethiopia
[samueltemesgen158@gmail.com](mailto:samueltemesgen158@gmail.com) ·
[github.com/samgit126](https://github.com/samgit126) ·
[qmtgitlab.qmt.et/Sami](https://qmtgitlab.qmt.et/Sami)
