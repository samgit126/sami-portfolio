/**
 * Builds a print-ready CV from the same data the site renders, so the two can
 * never drift. Writes an HTML file, then prints it to PDF with headless Chrome
 * (no extra npm dependencies — Chrome is already on the machine).
 *
 *   npm run cv
 *   SITE_URL=https://example.com npm run cv   # overrides the portfolio URL
 *
 * Two pages, in the order a reviewer actually reads:
 *   summary -> skills -> experience -> selected projects -> further delivery
 *   [page break] teaching -> education -> publications -> recognition
 *
 * Facts (contacts, skills, education, publications, credentials) come from
 * src/data/portfolio.ts so they cannot drift from the site. The project and
 * experience prose is local: the site can afford long-form copy, a CV cannot,
 * and the same sentence rarely works in both.
 *
 * Deliberately NOT included, having been tried and cut:
 *   - the same projects repeated across four sections
 *   - contribution-graph screenshots, which read as padding next to live URLs
 *
 * Output: public/samuel-temesgen-yimer-cv.pdf — served by the site, so the
 * Download CV buttons always hand over the current build.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const { profile, education, publications, credentials, contactChannels } = await import(
  resolve(root, 'src/data/portfolio.ts')
)

// The live portfolio, printed in the contact line. Override with SITE_URL=…
const SITE_URL = process.env.SITE_URL ?? 'https://sami-portfolio-gamma.vercel.app'

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
  'Front-End Developer and Software Engineer with six years building enterprise web applications in Vue 3, TypeScript and Tailwind CSS against Laravel REST APIs: ERP platforms, higher-education systems, scheduling and approval workflows, and public-sector websites.',
  'Currently Front-End Team Lead on the Haleta ERP platform at Qelem Meda Technologies, owning module architecture, the shared component library and the review standards the front-end team builds against. Eleven products delivered across the last six years.',
  'MSc in Software Engineering (CGPA 3.97), lecturer in software engineering at Wollo University since 2019, and three peer-reviewed publications including one in IEEE Access.',
]

/** Grouped for scanning, and ordered so the primary discipline comes first. */
const skills = [
  {
    title: 'Front-end',
    items:
      'Vue.js 3 / Composition API &nbsp;•&nbsp; TypeScript &nbsp;•&nbsp; JavaScript (ES6+) &nbsp;•&nbsp; Tailwind CSS &nbsp;•&nbsp; PrimeVue &nbsp;•&nbsp; Pinia &nbsp;•&nbsp; Vue Router &nbsp;•&nbsp; SPA architecture &nbsp;•&nbsp; Component library design &nbsp;•&nbsp; Responsive, mobile-first &nbsp;•&nbsp; Accessibility (WCAG) &nbsp;•&nbsp; Performance optimisation &nbsp;•&nbsp; HTML5 / CSS3',
  },
  {
    title: 'Back-end & data',
    items:
      'Laravel &nbsp;•&nbsp; PHP &nbsp;•&nbsp; REST API design &amp; integration &nbsp;•&nbsp; Authentication, roles &amp; permissions &nbsp;•&nbsp; MySQL &nbsp;•&nbsp; PostgreSQL &nbsp;•&nbsp; Relational modelling',
  },
  {
    title: 'Practice',
    items:
      'Front-end architecture &nbsp;•&nbsp; Code review &nbsp;•&nbsp; Agile / Scrum &nbsp;•&nbsp; Git, GitHub &amp; GitLab &nbsp;•&nbsp; Vite &nbsp;•&nbsp; Figma hand-off &nbsp;•&nbsp; Technical mentoring',
  },
  {
    title: 'Domains',
    items:
      'ERP &amp; business operations &nbsp;•&nbsp; Higher-education systems &nbsp;•&nbsp; Workflow &amp; approval systems &nbsp;•&nbsp; Public-sector web',
  },
  { title: 'Languages', items: 'English &nbsp;•&nbsp; Amharic' },
]

/**
 * Kept to what the role covered rather than what was built — the products
 * themselves get their own section, and repeating them here was what made the
 * previous version run to five pages.
 */
const experience = [
  {
    title: 'Front-End Developer & Front-End Team Lead',
    company: 'Qelem Meda Technologies',
    location: 'Addis Ababa, Ethiopia',
    period: 'Jun 2024 – Present',
    highlights: [
      'Lead front-end development for enterprise web applications and ERP platforms, setting the architecture and conventions the rest of the front-end team builds against.',
      'Own module boundaries, the shared component library, coding standards and the code-review workflow across a multi-module single-page application.',
      'Build responsive, accessible interfaces against Laravel REST APIs, with particular attention to the performance of data-heavy tables and dashboards.',
      'Work in Agile sprints with designers, back-end developers and project stakeholders across the full SDLC, and mentor developers through review.',
      'Delivered eight products in this stack, from ERP modules to public-facing university and corporate sites.',
    ],
    stack: 'Vue 3, TypeScript, Tailwind CSS, PrimeVue, Pinia, Vue Router, Laravel, REST APIs, Git',
  },
  {
    title: 'Founder & Front-End Developer',
    company: 'Moseb Technologies',
    location: 'Ethiopia',
    period: '2019 – May 2024',
    highlights: [
      'Founded and ran the company, taking projects from first client conversation through scoping to delivery while building the front end.',
      'Built the front end of the Castor Oil Data Management system, covering production records and reporting.',
      'Developed the IEEE Student Branch website for Kombolcha Institute of Technology, Wollo University, and delivered responsive, cross-browser interfaces integrated with Laravel back ends.',
    ],
    stack: 'Vue.js, JavaScript, HTML5, CSS3, Tailwind CSS, Laravel',
  },
]

/**
 * The five that show range: an ERP, a scheduling system, an approval workflow,
 * an internal tool and a public site. The rest are one-liners below.
 */
const projects = [
  {
    name: 'Haleta ERP',
    href: 'https://haleta.qelemmeda.et/',
    hrefLabel: 'haleta.qelemmeda.et',
    status: 'Live',
    role: 'Front-End Team Lead',
    tech: 'Vue 3, TypeScript, Tailwind CSS, PrimeVue, Pinia, Laravel',
    points: [
      'Commercial ERP platform for large organisations: inventory, sales, point of sale, stock operations, reporting and audit, all shipping from one Vue 3 and TypeScript codebase.',
      'Designed the single-page-application architecture: module boundaries, shared component library and the conventions that keep the twentieth release as maintainable as the first.',
      'Built data-heavy dashboard and table interfaces with Pinia state shared across modules, behind a server-driven permission model.',
    ],
  },
  {
    name: 'Class & Exam Scheduling System',
    href: 'https://schedule.hyperagencyet.com/',
    hrefLabel: 'schedule.hyperagencyet.com',
    status: 'Live',
    role: 'Front-End Developer',
    tech: 'Vue 3, TypeScript, Tailwind CSS, Pinia, Vue Router, Laravel',
    points: [
      'Academic scheduling platform deployed for Wollo University: class timetabling with room and instructor allocation, teaching-load distribution and automatic conflict detection across a full academic calendar.',
      'Exam scheduling and invigilation assignment, alongside master-data and course-offering modules.',
      'Charted dashboards and reports with Excel and PDF export; bilingual English and Amharic throughout, with light and dark themes.',
      'Configurable for any academic program rather than hard-coded to one institution.',
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
      'Research management system for research documents and student projects, modelled across seven roles from student and advisor to department head and research office.',
      'Multi-level approval workflow with submission, review, commenting, feedback and status tracking at every stage.',
      'Document management with upload, version control, format validation and controlled downloads, plus a reporting dashboard.',
      'Not yet public — a code walkthrough or local demonstration is available on request.',
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
      'Agile project-management tool with hierarchical epics, stories and tasks and story-point estimation.',
      'Data-dense backlog, workflow and performance-analytics views built as a Vue single-page application, now used company-wide.',
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
      'Content maintained by university staff through the CMS without a developer in the loop; designed, built and delivered at no cost.',
    ],
  },
]

const alsoDelivered = [
  {
    name: 'LyuHub',
    href: 'https://lyuhub.com/',
    hrefLabel: 'lyuhub.com',
    note: 'Digital identity platform covering portfolio, résumé, digital business card and membership card services.',
  },
  {
    name: 'Wollo University Staff Portal',
    href: 'https://wustaff.edu.et',
    hrefLabel: 'wustaff.edu.et',
    note: 'Staff portal with responsive pages and content management, delivered at no cost.',
  },
  {
    name: 'Corporate & operations sites',
    href: null,
    hrefLabel: 'lacomelza.com · ethioeast.et · hyperagencyet.com · zyodaparking.com',
    note: 'Lacomelza Enterprise, Ethio-East Investment Group, Hyper Agency and Zyoda Parking — multilingual, CMS-driven sites and a parking-operations system, all Vue.js against Laravel back ends.',
  },
]

const teaching = [
  {
    title: 'Lecturer',
    institution: 'Wollo University',
    department: 'Kombolcha Institute of Technology, School of Software Engineering',
    period: '2022 – Present',
    summary:
      'Lecture undergraduate software engineering modules and serve on the department’s exit exam task force.',
  },
  {
    title: 'Assistant Lecturer',
    institution: 'Wollo University',
    department: 'Kombolcha Institute of Technology, School of Software Engineering',
    period: '2019 – 2022',
    summary: 'Taught undergraduate classes and lab sessions alongside postgraduate study.',
  },
]

/* --------------------------------------------------------------- markup -- */

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
      <ul>${r.highlights.map((h) => `<li>${h}</li>`).join('')}</ul>
      <p class="meta"><span class="lbl">Stack:</span> ${r.stack}</p>
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
        <p class="place">${esc(p.role)}</p>
        <p class="tech">${p.tech}</p>
      </div>
      <ul>${p.points.map((pt) => `<li>${pt}</li>`).join('')}</ul>
    </article>`,
  )
  .join('')

const alsoBlock = `<table class="compact"><tbody>${alsoDelivered
  .map(
    (p) => `<tr>
      <th>${esc(p.name)}${
        p.hrefLabel
          ? `<br /><span class="url">${
              p.href ? link(p.href, p.hrefLabel) : esc(p.hrefLabel)
            }</span>`
          : ''
      }</th>
      <td>${p.note}</td>
    </tr>`,
  )
  .join('')}</tbody></table>`

const teachingBlock = teaching
  .map(
    (t) => `<article class="entry tight">
      <div class="row">
        <p class="title"><strong>${esc(t.title)}</strong> <span class="org">| ${esc(
          t.institution,
        )}</span></p>
        <p class="date">${esc(t.period)}</p>
      </div>
      <p class="place">${esc(t.department)}</p>
      <p class="summary">${esc(t.summary)}</p>
    </article>`,
  )
  .join('')

const educationBlock = education
  .map(
    (e) => `<article class="entry tight">
      <div class="row">
        <p class="title"><strong>${esc(e.degree)}</strong> <span class="org">| ${esc(
          e.school,
        )}</span></p>
        <p class="cgpa">${esc(e.grade)}</p>
      </div>
      <p class="place">${esc(e.period)}</p>
      <p class="summary">${esc(e.note)}</p>
    </article>`,
  )
  .join('')

const publicationsBlock = `<ol class="pubs">${publications
  .map(
    (p) => `<li><span class="pub">${esc(p.title)}</span> — ${esc(p.venue)}, ${esc(p.year)}</li>`,
  )
  .join('')}</ol>`

const credentialsBlock = `<ul class="certs">${credentials
  .map((c) => `<li><strong>${esc(c.title)}</strong> — ${esc(c.issuer)} (${esc(c.meta)})</li>`)
  .join('')}</ul>`

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${esc(profile.name)} — Curriculum Vitae</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
<style>
  @page { size: A4; margin: 11mm 13mm; }

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
    font-size: 9.1pt;
    line-height: 1.37;
    color: var(--body);
    background: #fff;
  }

  a { color: var(--brand); text-decoration: none; }
  strong { color: var(--ink); font-weight: 600; }

  /* ---------- header ---------- */
  header { display: flex; align-items: center; gap: 14px; padding-bottom: 8px; }
  .portrait {
    width: 62px; height: 62px; flex-shrink: 0;
    object-fit: cover;
    border-radius: 50%;
    border: 1pt solid #c9d2dc;
    display: block;
  }
  .identity { flex: 1; min-width: 0; }
  h1 {
    margin: 0;
    font-size: 19pt;
    font-weight: 700;
    letter-spacing: -0.015em;
    color: var(--ink);
  }
  .subtitle {
    margin: 1px 0 0;
    font-size: 10.6pt;
    font-weight: 500;
    color: var(--brand);
  }
  .contacts { margin: 5px 0 0; font-size: 8.4pt; color: var(--body); }
  /* Keep each contact atomic so the line wraps between links, not mid-URL. */
  .contacts a, .contacts .location { white-space: nowrap; }
  .contacts .bar { color: #b9c2cc; padding: 0 5px; }
  .location { color: var(--muted); }

  /* ---------- sections ---------- */
  section { margin-top: 9px; }
  section h2 {
    margin: 0 0 4px;
    padding-top: 5px;
    border-top: 1.9pt solid var(--rule);
    font-size: 9.9pt;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--brand);
    /* Never let a heading sit alone at the foot of a page */
    break-after: avoid;
    page-break-after: avoid;
  }

  /* Deliberate split: page one is the work, page two the credentials behind
     it. Breaking on a section boundary beats breaking wherever text runs out. */
  section.break { break-before: page; page-break-before: always; margin-top: 0; }
  section.break h2 { border-top: none; padding-top: 0; }

  .lead { margin: 0; }
  .lead + p { margin-top: 4px; }

  /* ---------- entries ---------- */
  .entry { margin-bottom: 7px; break-inside: avoid; page-break-inside: avoid; }
  .entry:last-child { margin-bottom: 0; }
  .entry.tight { margin-bottom: 4px; }

  .row { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
  .title { margin: 0; font-size: 9.8pt; color: var(--ink); }
  .title .org { color: var(--brand); font-weight: 500; }
  .title .url { font-size: 8.3pt; font-weight: 400; }
  .date, .cgpa {
    margin: 0; flex-shrink: 0; white-space: nowrap;
    font-size: 8.6pt; font-style: italic; color: var(--muted);
  }
  .cgpa { font-style: normal; font-weight: 600; color: var(--brand); }
  .place { margin: 1px 0 0; font-size: 8.6pt; font-style: italic; color: var(--muted); }
  .tech { margin: 1px 0 0; font-size: 8.4pt; color: var(--brand); text-align: right; }
  .summary { margin: 2px 0 0; }

  .entry ul { margin: 3px 0 0; padding-left: 14px; }
  .entry li { margin-bottom: 1px; }
  .meta { margin: 3px 0 0; font-size: 8.4pt; color: var(--muted); }
  .meta .lbl { font-weight: 600; color: var(--ink); }

  /* ---------- skills ---------- */
  table.skills { width: 100%; border-collapse: collapse; }
  table.skills th, table.skills td { text-align: left; vertical-align: top; padding: 2px 0; }
  table.skills th { width: 96px; font-weight: 600; color: var(--ink); }
  table.skills td { color: var(--body); }

  /* ---------- condensed projects ---------- */
  table.compact { width: 100%; border-collapse: collapse; }
  table.compact tr { break-inside: avoid; page-break-inside: avoid; }
  table.compact th, table.compact td {
    text-align: left; vertical-align: top;
    padding: 3.5px 10px 3.5px 0;
    border-top: 0.5pt solid #dfe4ea;
    font-weight: 400; font-size: 8.7pt;
  }
  table.compact th { width: 29%; font-weight: 600; color: var(--ink); }
  table.compact .url { font-size: 8.1pt; font-weight: 400; color: var(--brand); }

  /* ---------- publications & certs ---------- */
  .pubs { margin: 0; padding-left: 15px; }
  .pubs li { margin-bottom: 2px; break-inside: avoid; }
  .pubs .pub { color: var(--brand); font-weight: 500; }
  .certs { margin: 0; padding-left: 15px; }
  .certs li { margin-bottom: 1.5px; }
</style>
</head>
<body>
  <header>
    ${photo ? `<img class="portrait" src="${photo}" alt="" />` : ''}
    <div class="identity">
      <h1>${esc(profile.name)}</h1>
      <p class="subtitle">${esc(profile.role)} &nbsp;|&nbsp; ${esc(profile.secondaryRole)}</p>
      <p class="contacts">${contacts.join(
        '<span class="bar">|</span>',
      )}<span class="bar">|</span><span class="location">${esc(profile.location)}</span></p>
    </div>
  </header>

  ${section(
    'Professional summary',
    `<p class="lead">${summary[0]}</p><p>${summary[1]}</p><p>${summary[2]}</p>`,
  )}
  ${section('Technical skills', skillsBlock)}
  ${section('Professional experience', experienceBlock)}
  ${section('Selected projects', projectsBlock)}
  ${section('Further delivery', alsoBlock)}
  ${section('Teaching experience', teachingBlock, 'break')}
  ${section('Education', educationBlock)}
  ${section('Publications', publicationsBlock)}
  ${section('Certifications & recognition', credentialsBlock)}
</body>
</html>
`

mkdirSync(resolve(root, 'public'), { recursive: true })
const htmlPath = resolve(root, 'cv.html')
const pdfPath = resolve(root, 'public/samuel-temesgen-yimer-cv.pdf')
writeFileSync(htmlPath, html)
console.log('wrote', htmlPath)

if (!CHROME) {
  console.error('No Chrome/Chromium found — open cv.html and print to PDF manually.')
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
