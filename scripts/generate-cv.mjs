/**
 * Builds a print-ready CV from the same data the site renders, so the two can
 * never drift. Writes an HTML file, then prints it to PDF with headless Chrome
 * (no extra npm dependencies — Chrome is already on the machine).
 *
 *   npm run cv
 *   npm run resume                             # --short: two-page industry résumé
 *   SITE_URL=https://example.com npm run cv   # overrides the portfolio URL
 *
 * `--short` prints a two-page résumé for job boards and talent networks
 * (Turing, Toptal, Arc): same data, no portrait, years per technology,
 * one line per project, publications as titles only. Output:
 * public/samuel-temesgen-yimer-resume.pdf.
 *
 * A full-length CV, set at a comfortable reading size rather than squeezed:
 *   summary -> core competencies -> skills -> experience -> teaching ->
 *   projects (every one, in detail) -> open-source -> education ->
 *   publications (with abstracts) -> recognition -> additional information
 *
 * Facts (contacts, education, publications, credentials, repositories) come
 * from src/data/portfolio.ts so they cannot drift from the site. The prose is
 * local: the site can afford long-form copy, a CV needs it tighter, and the
 * same sentence rarely works in both.
 *
 * Output: public/samuel-temesgen-yimer-cv.pdf — served by the site, so the
 * Download CV buttons always hand over the current build.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const { profile, education, publications, credentials, contactChannels, repos } = await import(
  resolve(root, 'src/data/portfolio.ts')
)

// The live portfolio, printed in the contact line. Override with SITE_URL=…
const SITE_URL = process.env.SITE_URL ?? 'https://sami-portfolio-gamma.vercel.app'
const SHORT = process.argv.includes('--short')

const esc = (v) =>
  String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const CHROME = ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser'].find(
  (bin) => {
    try {
      execFileSync('which', [bin], { stdio: 'pipe' })
      return true
    } catch {
      return false
    }
  },
)

/** Inline an asset from /public as a data URI so the HTML stands alone. */
function dataUri(publicPath, mime) {
  const file = resolve(root, 'public', String(publicPath).replace(/^\//, ''))
  if (!existsSync(file)) return null
  return `data:${mime};base64,${readFileSync(file).toString('base64')}`
}

const photo = dataUri(profile.photo, 'image/webp')

const byId = Object.fromEntries(contactChannels.map((c) => [c.id, c]))
const link = (href, text) => `<a href="${href}">${esc(text)}</a>`
// GitLab is omitted: the company instance is private, so the link is dead to
// anyone reading this.
const contacts = [
  byId.phone && link(byId.phone.href, byId.phone.value),
  byId.email && link(byId.email.href, byId.email.value),
  byId.linkedin && link(byId.linkedin.href, 'linkedin.com/in/samuel-temesgen'),
  byId.github && link(byId.github.href, byId.github.value),
  SITE_URL && link(SITE_URL, SITE_URL.replace(/^https?:\/\/(www\.)?/, '')),
].filter(Boolean)

const section = (title, body, cls = '') =>
  `<section${cls ? ` class="${cls}"` : ''}><h2>${esc(title)}</h2>${body}</section>`

/* ------------------------------------------------------------------ copy --
 * Written in the implied first person a CV uses — no "I", and no bullet that
 * only restates the job title. Every project below is either a live URL or an
 * offer to demonstrate.
 */

const summary = [
  'Front-End Developer and Software Engineer with six years of experience building enterprise web applications with Vue 3, TypeScript and Tailwind CSS on top of Laravel REST APIs. The work has covered ERP platforms, university systems, scheduling and approval workflows, and public sector websites.',
  'Currently Front-End Team Lead on the Haleta ERP platform at Qelem Meda Technologies, responsible for module architecture, the shared component library and the review standards the rest of the front-end team follows. Eleven products delivered over the last six years, several of them still in active commercial use.',
  'Daily work is Vue 3 with the Composition API and TypeScript, styled with Tailwind CSS and PrimeVue and connected to Laravel REST APIs. The same care goes into what users notice, such as responsive layouts, keyboard access and clear loading states, as into what the team notices later: predictable structure, small reviewable changes, and code that is still easy to work with once the deadline has passed.',
  'Before Qelem Meda came five years running Moseb Technologies, a self-founded company, covering both the business side and the front-end work. Alongside all of it, lecturer in software engineering at Wollo University’s Kombolcha Institute of Technology since 2019.',
  'The engineering side is backed by research. An MSc in Software Engineering with a CGPA of 3.97, focused on machine learning approaches to software size and effort estimation, produced three peer reviewed papers, one of them in IEEE Access.',
]

/**
 * What the work actually demanded, stated without naming a project — the
 * projects section below is where each claim gets its evidence.
 */
const competencies = [
  {
    title: 'Front-end architecture',
    note: 'Module boundaries, shared component libraries, coding standards and a review workflow for multi-module single-page applications, built so the twentieth release is as easy to work with as the first.',
  },
  {
    title: 'Dense, data-first screens',
    note: 'Tables, filters, charts and Excel/PDF export over real institutional data, with Pinia state staying predictable as the number of views grows.',
  },
  {
    title: 'Workflow & permissions',
    note: 'Multi-role approval chains with submission, review, commenting and status tracking, behind server-driven permission models and document version control.',
  },
  {
    title: 'Accessibility & reach',
    note: 'Keyboard access, heading structure and colour contrast handled while building rather than patched afterwards; mobile-first for audiences on mixed devices and slow connections.',
  },
  {
    title: 'Internationalisation',
    note: 'Bilingual English and Amharic interfaces, multilingual CMS-driven sites, and light and dark themes carried across a whole product.',
  },
  {
    title: 'Team leadership',
    note: 'Setting front-end standards, reviewing the team’s changes, mentoring developers, and coordinating with back-end developers, designers and stakeholders across the full SDLC.',
  },
]

/** Grouped for scanning, and ordered so the primary discipline comes first. */
const skills = [
  {
    title: 'Front-end',
    items:
      'Vue.js 3 / Composition API &nbsp;•&nbsp; TypeScript &nbsp;•&nbsp; JavaScript (ES6+) &nbsp;•&nbsp; Tailwind CSS &nbsp;•&nbsp; PrimeVue &nbsp;•&nbsp; Pinia &nbsp;•&nbsp; Vue Router &nbsp;•&nbsp; SPA architecture &nbsp;•&nbsp; Component library design &nbsp;•&nbsp; Responsive, mobile-first design &nbsp;•&nbsp; Accessibility (WCAG) &nbsp;•&nbsp; Performance optimisation &nbsp;•&nbsp; HTML5 / CSS3',
  },
  {
    title: 'Back-end & data',
    items:
      'Laravel &nbsp;•&nbsp; PHP &nbsp;•&nbsp; REST API design &amp; integration &nbsp;•&nbsp; Authentication, roles &amp; permissions &nbsp;•&nbsp; OAuth2 / Passport &nbsp;•&nbsp; MySQL &nbsp;•&nbsp; PostgreSQL &nbsp;•&nbsp; Relational modelling',
  },
  {
    title: 'Practice',
    items:
      'Front-end architecture &nbsp;•&nbsp; Code review &nbsp;•&nbsp; Agile / Scrum &nbsp;•&nbsp; Git, GitHub &amp; GitLab &nbsp;•&nbsp; Vite &nbsp;•&nbsp; Figma hand-off &nbsp;•&nbsp; Requirements &amp; SDLC collaboration &nbsp;•&nbsp; Technical mentoring',
  },
  {
    title: 'Domains',
    items:
      'ERP &amp; business operations &nbsp;•&nbsp; Higher-education systems &nbsp;•&nbsp; Research administration &nbsp;•&nbsp; Academic scheduling &amp; workload &nbsp;•&nbsp; Workflow &amp; approval systems &nbsp;•&nbsp; Public-sector web',
  },
]

const experience = [
  {
    title: 'Front-End Developer & Front-End Team Lead',
    company: 'Qelem Meda Technologies',
    location: 'Addis Ababa, Ethiopia',
    period: 'Jun 2024 – Present',
    summary:
      'Lead front-end development for enterprise-grade web applications and ERP platforms, while setting the architecture and standards the front-end team works to.',
    highlights: [
      'Lead front-end development for enterprise web applications and ERP platforms using Vue 3, TypeScript and Tailwind CSS.',
      'Serve as Front-End Team Lead on Haleta ERP, owning module architecture, the shared component library, development standards and cross-team coordination.',
      'Define and enforce the code-review workflow for the front-end team, and mentor developers through review.',
      'Build responsive, accessible interfaces against Laravel REST APIs, with particular attention to the performance of data-heavy tables and dashboards.',
      'Collaborate with designers, back-end developers and project stakeholders across the full SDLC, working in Agile sprints.',
      'Delivered eight products in this stack, from ERP modules to public-facing university and corporate sites.',
    ],
    stack: 'Vue 3, TypeScript, Tailwind CSS, PrimeVue, Pinia, Vue Router, Laravel, REST APIs, Git',
  },
  {
    title: 'Founder & Front-End Developer',
    company: 'Moseb Technologies',
    location: 'Ethiopia',
    period: '2019 – May 2024',
    summary:
      'Co-founded and ran Moseb Technologies as a self-started company, taking projects from the first client conversation through to delivery while building the front end.',
    highlights: [
      'Founded and ran the business, handling client relationships, scoping, estimation and delivery.',
      'Built the front end of the Castor Oil Data Management system, covering production records and reporting.',
      'Developed the IEEE Student Branch website for Kombolcha Institute of Technology, Wollo University.',
      'Developed responsive, cross-browser interfaces and integrated them with Laravel back ends.',
      'Handled the full delivery cycle single-handed on smaller engagements, from requirements through deployment.',
    ],
    stack: 'Vue.js, JavaScript, HTML5, CSS3, Tailwind CSS, Laravel',
  },
]

const teaching = [
  {
    title: 'Lecturer',
    institution: 'Wollo University',
    department: 'Kombolcha Institute of Technology, School of Software Engineering',
    period: '2022 – Present',
    points: [
      'Lecture undergraduate software engineering modules.',
      'Serve on the department’s exit exam task force, contributing to assessment design and review.',
      'Supervise student projects and advise on software design and implementation practice.',
    ],
  },
  {
    title: 'Assistant Lecturer',
    institution: 'Wollo University',
    department: 'Kombolcha Institute of Technology, School of Software Engineering',
    period: '2019 – 2022',
    points: [
      'Taught undergraduate classes and ran laboratory sessions alongside postgraduate study.',
      'Supported course delivery, assessment and student consultation across the software engineering curriculum.',
    ],
  },
]

/** Every delivered product, most substantial first. */
const projects = [
  {
    name: 'Haleta ERP',
    href: 'https://haleta.qelemmeda.et/',
    hrefLabel: 'haleta.qelemmeda.et',
    status: 'Live',
    role: 'Front-End Team Lead',
    tech: 'Vue 3, TypeScript, Tailwind CSS, PrimeVue, Pinia, Laravel',
    points: [
      'Commercial ERP platform built for large organisations, covering inventory management, sales, point of sale, stock operations, reporting and audit. All of it ships from one Vue 3 and TypeScript codebase.',
      'Designed the single-page-application architecture: module boundaries, the shared component library and the conventions that keep the twentieth release as maintainable as the first.',
      'Built data-heavy dashboard and table interfaces with Pinia state shared across modules, behind a server-driven permission model.',
      'Set the front-end coding standards and the review workflow the team works to.',
      'Coordinate with back-end developers and stakeholders to ship each module at scale.',
    ],
  },
  {
    name: 'Class & Exam Scheduling System',
    href: null,
    hrefLabel: null,
    status: 'Deployed; public URL offline',
    role: 'Front-End Developer',
    tech: 'Vue 3, TypeScript, Tailwind CSS, Pinia, Vue Router, Laravel',
    points: [
      'Academic scheduling and workload platform deployed for Wollo University: class timetabling with room and instructor allocation, teaching-load distribution and automatic conflict detection across a full academic calendar.',
      'Exam scheduling and invigilation assignment, alongside master-data and course-offering modules, behind a server-driven permission model.',
      'Data-heavy dashboards and charted reports with Excel and PDF export.',
      'Bilingual English and Amharic throughout, with light and dark themes.',
      'Pinia stores keep scheduling state shared across modules without the views slowing down.',
      'Configurable for any academic program rather than hard-coded to one institution.',
      'The public deployment is currently offline; a walkthrough is available on request.',
    ],
  },
  {
    name: 'Wollo University Research Repository',
    href: null,
    hrefLabel: null,
    status: 'Built, awaiting deployment',
    role: 'Front-End Developer',
    tech: 'Vue.js, Pinia, Laravel, OAuth2 / Passport, MySQL',
    points: [
      'Research management system covering research documents, student projects and the academic workflow around them, modelled across seven roles: admin, department head, project coordinator, advisor, student, research office and researcher.',
      'Multi-level approval workflow with submission, review, commenting, feedback and status tracking at every stage.',
      'Document management with upload, version control, format validation and controlled downloads.',
      'Announcements module plus a dashboard reporting user statistics, document metrics and activity.',
      'Authentication and role assignment through OAuth2 / Laravel Passport against a MySQL schema.',
      'The system is not yet public, so a code walkthrough or a local demonstration is available on request.',
    ],
  },
  {
    name: 'GIZE',
    href: 'https://gize.qmt.et/',
    hrefLabel: 'gize.qmt.et',
    status: 'Live',
    role: 'Front-End Developer',
    tech: 'Vue.js, Tailwind CSS, Laravel',
    points: [
      'Internal agile project-management tool with hierarchical epics, stories and tasks.',
      'Story-point-based estimation and tracking across the backlog.',
      'Workflow management, dashboards and performance analytics, now used company-wide.',
      'Data-dense backlog and dashboard views built as a Vue single-page application.',
    ],
  },
  {
    name: 'Ethiopian Public Service University',
    href: 'http://www.epsu.edu.et/',
    hrefLabel: 'epsu.edu.et',
    status: 'Live · Volunteer',
    role: 'Front-End Developer',
    tech: 'Vue.js, TypeScript, Tailwind CSS, Laravel',
    points: [
      'Public university website built mobile-first for students, staff and applicants across a wide range of devices and connection speeds.',
      'Keyboard access, heading structure and colour contrast handled during the build rather than retrofitted afterwards.',
      'Front-end modules integrated with back-end APIs for dynamic content delivery.',
      'Content maintained by university staff through the CMS without a developer in the loop.',
      'Designed, built and delivered at no cost as a contribution to public higher education in Ethiopia.',
    ],
  },
  {
    name: 'LyuHub',
    href: 'https://lyuhub.com/',
    hrefLabel: 'lyuhub.com',
    status: 'Live',
    role: 'Front-End Developer',
    tech: 'Vue.js, Tailwind CSS, PrimeVue, Laravel',
    points: [
      'Digital identity platform covering portfolio, résumé, digital business card and membership card services.',
      'Built responsive interfaces for every service in the product suite.',
      'Implemented a shared component set integrated cleanly with back-end APIs.',
    ],
  },
  {
    name: 'Wollo University Staff Portal',
    href: 'https://wustaff.edu.et',
    hrefLabel: 'wustaff.edu.et',
    status: 'Live · Volunteer',
    role: 'Front-End Developer',
    tech: 'Vue.js, TypeScript, Tailwind CSS, Laravel',
    points: [
      'University staff portal with responsive pages backed by content management.',
      'Delivered at no cost alongside the Ethiopian Public Service University site.',
    ],
  },
  {
    name: 'Lacomelza Enterprise',
    href: 'https://lacomelza.com/',
    hrefLabel: 'lacomelza.com',
    status: 'Live',
    role: 'Front-End Developer',
    tech: 'Vue.js, TypeScript, Tailwind CSS, Laravel',
    points: [
      'Corporate site for an Ethiopian construction, engineering and manufacturing enterprise, covering business units, projects, careers and news.',
      'Responsive layouts, multilingual support and a searchable content structure.',
    ],
  },
  {
    name: 'Ethio-East Investment Group',
    href: 'https://ethioeast.et',
    hrefLabel: 'ethioeast.et',
    status: 'Live',
    role: 'Front-End Developer',
    tech: 'Vue.js, Tailwind CSS, Laravel',
    points: [
      'Multilingual corporate website with dynamic content management.',
      'Localisation support, with product and service content maintained by the client.',
    ],
  },
  {
    name: 'Hyper Agency',
    href: null,
    hrefLabel: null,
    status: 'Delivered; site currently offline',
    role: 'Front-End Developer',
    tech: 'Vue.js, Tailwind CSS, Laravel',
    points: [
      'Corporate agency website with a modern, component-driven interface.',
      'Developed the responsive UI components and the site’s visual system, working directly with designers and back-end developers.',
    ],
  },
  {
    name: 'Zyoda Parking',
    href: 'http://zyodaparking.com/',
    hrefLabel: 'zyodaparking.com',
    status: 'Live',
    role: 'Full-Stack Developer',
    tech: 'Vue.js, Tailwind CSS, Laravel',
    points: [
      'Parking management system covering operations, vehicle tracking and administration.',
      'Worked across the stack, from Laravel endpoints through to the Vue front end.',
    ],
  },
]

const additional = [
  { key: 'Languages', value: 'English (professional working proficiency) &nbsp;•&nbsp; Amharic (native)' },
  { key: 'Location', value: 'Addis Ababa, Ethiopia. Available on site, hybrid or remote.' },
  {
    key: 'Code',
    value: `Public repositories at ${link(
      'https://github.com/samgit126',
      'github.com/samgit126',
    )}; commercial work is in private repositories on the company GitLab and can be walked through on request.`,
  },
  { key: 'References', value: 'Available on request.' },
]

/* --------------------------------------------------------------- markup -- */

const competenciesBlock = `<table class="compact"><tbody>${competencies
  .map((c) => `<tr><th>${esc(c.title)}</th><td>${esc(c.note)}</td></tr>`)
  .join('')}</tbody></table>`

const skillsBlock = `<table class="skills"><tbody>${skills
  .map((g) => `<tr><th>${esc(g.title)}</th><td>${g.items}</td></tr>`)
  .join('')}</tbody></table>`

const experienceBlock = experience
  .map(
    (r) => `<article class="entry">
      <div class="row">
        <p class="title"><strong>${esc(r.title)}</strong> <span class="org">| ${esc(r.company)}</span></p>
        <p class="date">${esc(r.period)}</p>
      </div>
      <p class="place">${esc(r.location)}</p>
      <p class="summary">${esc(r.summary)}</p>
      <ul>${r.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
      <p class="meta"><span class="lbl">Stack:</span> ${esc(r.stack)}</p>
    </article>`,
  )
  .join('')

const teachingBlock = teaching
  .map(
    (t) => `<article class="entry">
      <div class="row">
        <p class="title"><strong>${esc(t.title)}</strong> <span class="org">| ${esc(
          t.institution,
        )}</span></p>
        <p class="date">${esc(t.period)}</p>
      </div>
      <p class="place">${esc(t.department)}</p>
      <ul>${t.points.map((pt) => `<li>${esc(pt)}</li>`).join('')}</ul>
    </article>`,
  )
  .join('')

const projectsBlock = projects
  .map(
    (p) => `<article class="entry">
      <div class="row">
        <p class="title"><strong>${esc(p.name)}</strong>${
          p.href ? ` <span class="url">${link(p.href, p.hrefLabel)}</span>` : ''
        }</p>
        <p class="date">${esc(p.status)}</p>
      </div>
      <div class="row">
        <p class="place">Role: ${esc(p.role)}</p>
        <p class="tech">Tech: ${esc(p.tech)}</p>
      </div>
      <ul>${p.points.map((pt) => `<li>${esc(pt)}</li>`).join('')}</ul>
    </article>`,
  )
  .join('')

const reposBlock = `<table class="compact"><tbody>${repos
  .map(
    (r) => `<tr>
      <th>${esc(r.name)}<br /><span class="url">${link(
        r.href,
        r.href.replace(/^https?:\/\/(www\.)?github\.com\//, ''),
      )}</span></th>
      <td>${esc(r.description)}<br /><span class="tech-inline">${esc(r.tech)}</span></td>
    </tr>`,
  )
  .join('')}</tbody></table>`

const educationBlock = education
  .map(
    (e) => `<article class="entry">
      <div class="row">
        <p class="title"><strong>${esc(e.degree)}</strong> <span class="org">| ${esc(
          e.school,
        )}</span></p>
        <p class="cgpa">${esc(e.grade)}</p>
      </div>
      <p class="place">${esc(e.period)}</p>
      ${e.thesis ? `<p class="summary"><em>Thesis:</em> ${esc(e.thesis)}</p>` : ''}
      <p class="summary">${esc(e.note)}</p>
    </article>`,
  )
  .join('')

// Abstracts included: three papers is few enough that a reader can take them
// in, and the titles alone do not say what the work was.
const publicationsBlock = publications
  .map(
    (p, i) => `<article class="entry pub-entry">
      <div class="row">
        <p class="title"><span class="num">${i + 1}.</span> <strong class="pub">${esc(
          p.title,
        )}</strong></p>
        <p class="date">${esc(p.year)}</p>
      </div>
      <p class="place">${esc(p.venue)} &nbsp;•&nbsp; ${esc(p.type)}</p>
      <p class="summary">${esc(p.abstract)}</p>
    </article>`,
  )
  .join('')

const credentialsBlock = `<ul class="certs">${credentials
  .map((c) => `<li><strong>${esc(c.title)}</strong> (${esc(c.issuer)}, ${esc(c.meta)})</li>`)
  .join('')}</ul>`

const additionalBlock = `<table class="skills"><tbody>${additional
  .map((a) => `<tr><th>${esc(a.key)}</th><td>${a.value}</td></tr>`)
  .join('')}</tbody></table>`

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${esc(profile.name)}, Curriculum Vitae</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
<style>
  @page { size: A4; margin: 14mm 15mm; }

  :root {
    --brand: #2e74b5;   /* section headings, links */
    --rule: #1f3864;    /* the navy rules above each heading */
    --ink: #1a1a1a;
    --body: #333333;
    --muted: #5f6b76;
  }

  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  body {
    margin: 0;
    font-family: Inter, Arial, "Helvetica Neue", Helvetica, sans-serif;
    font-size: 9.3pt;
    line-height: 1.40;
    color: var(--body);
    background: #fff;
  }

  a { color: var(--brand); text-decoration: none; }
  strong { color: var(--ink); font-weight: 600; }

  /* ---------- header ---------- */
  header { display: flex; align-items: center; gap: 18px; padding-bottom: 10px; }
  .portrait {
    width: 70px; height: 70px; flex-shrink: 0;
    object-fit: cover;
    border-radius: 50%;
    border: 1pt solid #c9d2dc;
    display: block;
  }
  .identity { flex: 1; min-width: 0; }
  h1 {
    margin: 0;
    font-size: 21pt;
    font-weight: 700;
    letter-spacing: -0.015em;
    color: var(--ink);
  }
  .subtitle {
    margin: 2px 0 0;
    font-size: 11.5pt;
    font-weight: 500;
    color: var(--brand);
  }
  .contacts { margin: 6px 0 0; font-size: 8.8pt; color: var(--body); }
  /* Keep each contact atomic so the line wraps between links, not mid-URL. */
  .contacts a, .contacts .location { white-space: nowrap; }
  .contacts .bar { color: #b9c2cc; padding: 0 2px; }
  .location { color: var(--muted); }

  /* ---------- sections ---------- */
  section { margin-top: 11px; }
  section h2 {
    margin: 0 0 7px;
    padding-top: 8px;
    border-top: 2pt solid var(--rule);
    font-size: 10.2pt;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--brand);
    /* Never let a heading sit alone at the foot of a page */
    break-after: avoid;
    page-break-after: avoid;
  }

  .lead { margin: 0; }
  .lead + p, section p + p { margin-top: 6px; }

  /* ---------- entries ---------- */
  .entry { margin-bottom: 8px; break-inside: avoid; page-break-inside: avoid; }
  .entry:last-child { margin-bottom: 0; }

  .row { display: flex; justify-content: space-between; align-items: baseline; gap: 14px; }
  .title { margin: 0; font-size: 10.4pt; color: var(--ink); }
  .title .org { color: var(--brand); font-weight: 500; }
  .title .url { font-size: 8.7pt; font-weight: 400; }
  .title .num { color: var(--muted); font-weight: 400; }
  .date, .cgpa {
    margin: 0; flex-shrink: 0; white-space: nowrap;
    font-size: 9pt; font-style: italic; color: var(--muted);
  }
  .cgpa { font-style: normal; font-weight: 600; color: var(--brand); }
  .place { margin: 2px 0 0; font-size: 9pt; font-style: italic; color: var(--muted); }
  .tech { margin: 2px 0 0; font-size: 8.9pt; color: var(--brand); text-align: right; font-style: normal; }
  .summary { margin: 4px 0 0; }
  .pub-entry .pub { color: var(--brand); }

  .entry ul { margin: 5px 0 0; padding-left: 17px; }
  .entry li { margin-bottom: 2px; }
  .meta { margin: 5px 0 0; font-size: 8.9pt; color: var(--muted); }
  .meta .lbl { font-weight: 600; color: var(--ink); }

  /* ---------- label / value tables ---------- */
  table.skills { width: 100%; border-collapse: collapse; }
  table.skills th, table.skills td { text-align: left; vertical-align: top; padding: 3px 0; }
  table.skills th { width: 120px; font-weight: 600; color: var(--ink); padding-right: 10px; }
  table.skills td { color: var(--body); }

  table.compact { width: 100%; border-collapse: collapse; }
  table.compact tr { break-inside: avoid; page-break-inside: avoid; }
  table.compact th, table.compact td {
    text-align: left; vertical-align: top;
    padding: 6px 12px 6px 0;
    border-top: 0.5pt solid #dfe4ea;
    font-weight: 400;
  }
  table.compact th { width: 27%; font-weight: 600; color: var(--ink); }
  table.compact .url { font-size: 8.6pt; font-weight: 400; color: var(--brand); }
  .tech-inline { color: var(--brand); font-size: 8.9pt; }

  /* ---------- certs ---------- */
  .certs { margin: 0; padding-left: 18px; }
  .certs li { margin-bottom: 3px; }
</style>
</head>
<body>
  <header>
    ${photo ? `<img class="portrait" src="${photo}" alt="" />` : ''}
    <div class="identity">
      <h1>${esc(profile.name)}</h1>
      <p class="subtitle">${esc(profile.role)} &nbsp;|&nbsp; ${esc(profile.secondaryRole)}</p>
      <p class="contacts">${[...contacts, `<span class="location">${esc(
        profile.location,
      )}</span>`].join(' <span class="bar">|</span> ')}</p>
    </div>
  </header>

  ${section(
    'Professional summary',
    `<p class="lead">${esc(summary[0])}</p>${summary
      .slice(1)
      .map((p) => `<p>${esc(p)}</p>`)
      .join('')}`,
  )}
  ${section('Core competencies', competenciesBlock)}
  ${section('Technical skills', skillsBlock)}
  ${section('Professional experience', experienceBlock)}
  ${section('Teaching experience', teachingBlock)}
  ${section('Projects', projectsBlock)}
  ${section('Open-source & personal repositories', reposBlock)}
  ${section('Education', educationBlock)}
  ${section('Publications', publicationsBlock)}
  ${section('Certifications & recognition', credentialsBlock)}
  ${section('Additional information', additionalBlock)}
</body>
</html>
`


/* ------------------------------------------------------------- résumé --
 * The two-page version. Recruiters and matching engines read the first page
 * hardest, so it opens with title, summary and years per technology, then the
 * two roles with outcome bullets. Everything else is one line per item.
 */

const resumeTitle = 'Senior Front-End Engineer · Vue 3 / TypeScript · Front-End Team Lead'

const resumeSummary =
  'Front-end engineer with six years shipping enterprise web applications in Vue.js, TypeScript and Tailwind CSS on Laravel REST APIs, currently leading the front end of a commercial ERP platform. Eleven products delivered across ERP, higher education and public sector, including a multi-module single-page application whose architecture, component library and review process are mine. MSc in Software Engineering (CGPA 3.97) with three peer-reviewed IEEE papers on machine learning for software estimation. Remote-ready: UTC+3, overlapping European and US East Coast working hours.'

/** Years are counted from first production use to Nov 2026. */
const skillYears = [
  ['Vue.js (2 & 3, Composition API)', '6+', 'Primary framework since 2019; Vue 3 + TypeScript since 2022'],
  ['JavaScript (ES6+), HTML5, CSS3', '7', 'Every project, 2019 to date'],
  ['TypeScript', '4', 'Since 2022; strict TS across Haleta ERP and all current products'],
  ['Tailwind CSS', '4+', 'Design systems and component libraries'],
  ['PrimeVue, Pinia, Vue Router, Vite', '2–3', 'Data tables, shared state, SPA routing, builds'],
  ['Laravel & PHP, REST API design', '5+', 'Full-stack on smaller products; API integration on all'],
  ['MySQL, PostgreSQL', '6', 'Relational modelling, reporting queries'],
  ['Accessibility (WCAG), performance', '4+', 'Keyboard, contrast, heading order; Lighthouse-driven tuning'],
  ['Git, GitHub, GitLab, code review, Agile/Scrum', '7', 'Team lead on review workflow since 2024'],
  ['Python, TensorFlow / Keras, scikit-learn, BERT', '3', 'MSc research and the three published papers'],
]

const resumeExperience = [
  {
    ...experience[0],
    highlights: [
      'Lead the front end of Haleta ERP, a multi-module Vue 3 + TypeScript single-page application covering inventory, sales, point of sale, stock, reporting and audit, shipped from one codebase.',
      'Own the front-end architecture: module boundaries, shared component library, coding standards and the review workflow a team of front-end developers works to; mentor through review.',
      'Built the data-heavy table and dashboard layer (filtering, pagination, export) with Pinia state shared across modules, against a server-driven permission model.',
      'Delivered eight further products in the same stack, from an academic scheduling system with conflict detection to public-facing university and corporate sites.',
      'Work in Agile sprints with designers, Laravel back-end developers and stakeholders across the full SDLC.',
    ],
  },
  {
    ...experience[1],
    highlights: [
      'Founded and ran a small software company for five years: client relationships, scoping, estimation and delivery, plus the front-end build.',
      'Built the Castor Oil Data Management system (production records and reporting) and the IEEE Student Branch site for Kombolcha Institute of Technology.',
      'Delivered responsive, cross-browser Vue.js interfaces integrated with Laravel back ends, often as the sole engineer from requirements to deployment.',
    ],
  },
]

const resumeProjects = [
  ['Haleta ERP', 'https://haleta.qelemmeda.et/', 'Front-End Team Lead', 'Commercial ERP for large organisations; SPA architecture, design system, data-heavy dashboards.'],
  ['Class & Exam Scheduling System', null, 'Front-End Developer', 'Timetabling, room/instructor allocation and conflict detection for Wollo University; bilingual EN/AM; public URL currently offline, demo on request.'],
  ['Wollo University Research Repository', null, 'Front-End Developer', 'Research-administration workflow across seven roles with approvals, versioned documents and a reporting dashboard; OAuth2/Passport.'],
  ['Ethiopian Public Service University', 'http://www.epsu.edu.et/', 'Front-End Developer (volunteer)', 'Mobile-first, CMS-driven public university site built and delivered at no cost.'],
  ['GIZE', 'https://gize.qmt.et/', 'Front-End Developer', 'Agile project-management tool with epics, stories, story points and analytics.'],
  ['LyuHub', 'https://lyuhub.com/', 'Front-End Developer', 'Digital identity platform: portfolio, résumé, business card and membership card services.'],
]

const resumeSkillsBlock = `<table class="years"><tbody>${skillYears
  .map(
    ([name, yrs, note]) =>
      `<tr><th>${esc(name)}</th><td class="yrs">${esc(yrs)} yrs</td><td>${esc(note)}</td></tr>`,
  )
  .join('')}</tbody></table>`

const resumeExperienceBlock = resumeExperience
  .map(
    (r) => `<article class="entry">
      <div class="row">
        <p class="title"><strong>${esc(r.title)}</strong> <span class="org">| ${esc(r.company)}</span></p>
        <p class="date">${esc(r.period)}</p>
      </div>
      <p class="place">${esc(r.location)} &nbsp;•&nbsp; ${esc(r.stack)}</p>
      <ul>${r.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
    </article>`,
  )
  .join('')

const resumeProjectsBlock = `<table class="compact tight"><tbody>${resumeProjects
  .map(
    ([name, href, role, note]) => `<tr>
      <th>${href ? link(href, name) : esc(name)}<br /><span class="role">${esc(role)}</span></th>
      <td>${esc(note)}</td>
    </tr>`,
  )
  .join('')}</tbody></table>`

const resumeEducationBlock = `<ul class="lines">${education
  .map(
    (e) =>
      `<li><strong>${esc(e.degree)}</strong>, ${esc(e.school)}, ${esc(e.period)} &nbsp;•&nbsp; <span class="cgpa-inline">${esc(
        e.grade,
      )}</span>${e.note ? ` &nbsp;•&nbsp; ${esc(e.note)}` : ''}</li>`,
  )
  .join('')}</ul>`

const resumePublicationsBlock = `<ul class="lines">${publications
  .map((p) => `<li>${esc(p.title)}. <em>${esc(p.venue)}</em>, ${esc(p.year)}.</li>`)
  .join('')}</ul>`

const resumeMoreBlock = `<table class="skills"><tbody>
  <tr><th>Teaching</th><td>Lecturer in Software Engineering, Wollo University (Kombolcha Institute of Technology), 2019 to date; exit-exam task force.</td></tr>
  <tr><th>Open source</th><td>${link('https://github.com/samgit126', 'github.com/samgit126')}: internship management, admin panel starter, payroll and data-management systems in Laravel + Vue.</td></tr>
  <tr><th>Languages</th><td>English (professional working proficiency) &nbsp;•&nbsp; Amharic (native)</td></tr>
  <tr><th>Availability</th><td>Remote, UTC+3, with daily overlap for European and US East Coast teams. Open to contract and part-time engagements alongside the current lead role.</td></tr>
</tbody></table>`

const shortHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${esc(profile.name)}, Résumé</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
<style>
  @page { size: A4; margin: 12mm 14mm; }
  :root { --brand: #2e74b5; --rule: #1f3864; --ink: #1a1a1a; --body: #333; --muted: #5f6b76; }
  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { margin: 0; font-family: Inter, Arial, Helvetica, sans-serif; font-size: 9pt; line-height: 1.36; color: var(--body); }
  a { color: var(--brand); text-decoration: none; }
  strong { color: var(--ink); font-weight: 600; }
  h1 { margin: 0; font-size: 19pt; font-weight: 700; letter-spacing: -0.015em; color: var(--ink); }
  .subtitle { margin: 2px 0 0; font-size: 10.5pt; font-weight: 500; color: var(--brand); }
  .contacts { margin: 5px 0 0; font-size: 8.6pt; }
  .contacts a, .contacts .location { white-space: nowrap; }
  .contacts .bar { color: #b9c2cc; padding: 0 2px; }
  .location { color: var(--muted); }
  section { margin-top: 8px; }
  section h2 { margin: 0 0 5px; padding-top: 6px; border-top: 2pt solid var(--rule); font-size: 9.6pt; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: var(--brand); break-after: avoid; }
  .lead { margin: 0; }
  .entry { margin-bottom: 6px; break-inside: avoid; }
  .row { display: flex; justify-content: space-between; align-items: baseline; gap: 14px; }
  .title { margin: 0; font-size: 10pt; color: var(--ink); }
  .title .org { color: var(--brand); font-weight: 500; }
  .date { margin: 0; flex-shrink: 0; white-space: nowrap; font-size: 8.8pt; font-style: italic; color: var(--muted); }
  .place { margin: 1px 0 0; font-size: 8.6pt; font-style: italic; color: var(--muted); }
  .entry ul { margin: 4px 0 0; padding-left: 16px; }
  .entry li { margin-bottom: 1.5px; }
  table { width: 100%; border-collapse: collapse; }
  table th, table td { text-align: left; vertical-align: top; }
  table.years th, table.years td { padding: 2px 10px 2px 0; border-top: 0.5pt solid #e6eaef; }
  table.years th { width: 36%; font-weight: 600; color: var(--ink); }
  table.years .yrs { width: 48px; white-space: nowrap; font-weight: 600; color: var(--brand); }
  table tr { break-inside: avoid; page-break-inside: avoid; }
  table.compact th, table.compact td { padding: 4px 12px 4px 0; border-top: 0.5pt solid #e6eaef; font-weight: 400; }
  table.compact th { width: 30%; font-weight: 600; color: var(--ink); }
  table.compact .role { font-size: 8.3pt; font-weight: 400; color: var(--muted); font-style: italic; }
  table.skills th { width: 92px; font-weight: 600; color: var(--ink); padding: 2px 10px 2px 0; }
  table.skills td { padding: 2px 0; }
  ul.lines { margin: 0; padding-left: 16px; }
  ul.lines li { margin-bottom: 2px; }
  .cgpa-inline { font-weight: 600; color: var(--brand); }
</style>
</head>
<body>
  <header>
    <h1>${esc(profile.name)}</h1>
    <p class="subtitle">${esc(resumeTitle)}</p>
    <p class="contacts">${[...contacts, `<span class="location">${esc(profile.location)}</span>`].join(
      ' <span class="bar">|</span> ',
    )}</p>
  </header>
  ${section('Summary', `<p class="lead">${esc(resumeSummary)}</p>`)}
  ${section('Technical skills', resumeSkillsBlock)}
  ${section('Experience', resumeExperienceBlock)}
  ${section('Selected projects', resumeProjectsBlock)}
  ${section('Education', resumeEducationBlock)}
  ${section('Publications', resumePublicationsBlock)}
  ${section('Additional', resumeMoreBlock)}
</body>
</html>
`

mkdirSync(resolve(root, 'public'), { recursive: true })
const htmlPath = resolve(root, SHORT ? 'resume.html' : 'cv.html')
const pdfPath = resolve(
  root,
  SHORT ? 'public/samuel-temesgen-yimer-resume.pdf' : 'public/samuel-temesgen-yimer-cv.pdf',
)
writeFileSync(htmlPath, SHORT ? shortHtml : html)
console.log('wrote', htmlPath)

if (!CHROME) {
  console.error(`No Chrome/Chromium found — open ${htmlPath} and print to PDF manually.`)
  process.exit(1)
}

execFileSync(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--no-pdf-header-footer',
    '--run-all-compositor-stages-before-draw',
    '--virtual-time-budget=15000',
    `--print-to-pdf=${pdfPath}`,
    `file://${htmlPath}`,
  ],
  { stdio: 'pipe' },
)
console.log('wrote', pdfPath)
