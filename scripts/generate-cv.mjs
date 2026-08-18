/**
 * Builds a print-ready CV from the same data the site renders, so the two can
 * never drift. Writes an HTML file, then prints it to PDF with headless Chrome
 * (no extra npm dependencies — Chrome is already on the machine).
 *
 *   npm run cv
 *   SITE_URL=https://example.com npm run cv   # also prints the site URL
 *
 * Layout follows Samuel's existing CV template: centred header, navy rules with
 * blue small-caps section headings, compact bullet entries. Enhancements over
 * that original: portrait, teaching section, a condensed table for the projects
 * that don't warrant full entries, and the contribution graphs at the end.
 *
 * Output: public/samuel-temesgen-yimer-cv.pdf — served by the site, so the
 * Download CV buttons always hand over the current build.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const {
  profile,
  about,
  skillGroups,
  experience,
  projects,
  evidence,
  domains,
  teaching,
  publications,
  education,
  credentials,
  contactChannels,
  contributions,
} = await import(resolve(root, 'src/data/portfolio.ts'))

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
const contacts = [
  byId.phone && link(byId.phone.href, byId.phone.value),
  byId.email && link(byId.email.href, byId.email.value),
  byId.linkedin && link(byId.linkedin.href, 'linkedin.com/in/samuel-temesgen'),
  byId.github && link(byId.github.href, byId.github.value),
  byId.gitlab && link(byId.gitlab.href, byId.gitlab.value),
  SITE_URL && link(SITE_URL, SITE_URL.replace(/^https?:\/\/(www\.)?/, '')),
].filter(Boolean)

const section = (title, body, cls = '') =>
  `<section${cls ? ` class="${cls}"` : ''}><h2>${esc(title)}</h2>${body}</section>`

const skillsBlock = `<table class="skills"><tbody>${skillGroups
  .map(
    (g) =>
      `<tr><th>${esc(g.title)}</th><td>${g.items
        .map(esc)
        .join(' &nbsp;•&nbsp; ')}</td></tr>`,
  )
  .join('')}</tbody></table>`

const experienceBlock = experience
  .map(
    (r) => `<article class="entry">
      <div class="row">
        <p class="title"><strong>${esc(r.title)}</strong> <span class="org">| ${esc(
          r.company,
        )}</span></p>
        <p class="date">${esc(r.period)}</p>
      </div>
      <p class="place">${esc(r.location)}</p>
      <p class="summary">${esc(r.summary)}</p>
      <ul>${r.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
      <p class="meta"><span class="lbl">Stack:</span> ${r.stack.map(esc).join(', ')}</p>
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
      <ul><li>${esc(t.summary)}</li></ul>
      ${
        t.courses.length
          ? `<p class="meta"><span class="lbl">Courses:</span> ${t.courses
              .map(esc)
              .join(', ')}</p>`
          : ''
      }
    </article>`,
  )
  .join('')

const featured = projects.filter((p) => p.featured)
const others = projects.filter((p) => !p.featured)

const featuredBlock = featured
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
        <p class="tech">Tech: ${p.tech.map(esc).join(', ')}</p>
      </div>
      <ul>${p.points.map((pt) => `<li>${esc(pt)}</li>`).join('')}</ul>
    </article>`,
  )
  .join('')

const othersBlock = `<table class="compact"><tbody>${others
  .map(
    (p) => `<tr>
      <th>${esc(p.name)}${
        p.href ? `<br /><span class="url">${link(p.href, p.hrefLabel)}</span>` : ''
      }</th>
      <td>${esc(p.description)}<br /><span class="tech">${p.tech
        .map(esc)
        .join(', ')}</span></td>
    </tr>`,
  )
  .join('')}</tbody></table>`

const evidenceBlock = `<table class="compact evidence"><tbody>${evidence
  .map(
    (e) => `<tr>
      <th>${esc(e.capability)}</th>
      <td>
        <strong>${esc(e.project)}</strong> — ${esc(e.role)}${
          e.href ? `<br /><span class="url">${link(e.href, e.hrefLabel)}</span>` : ''
        }
        <ul class="tight">${e.proof.map((pt) => `<li>${esc(pt)}</li>`).join('')}</ul>
      </td>
    </tr>`,
  )
  .join('')}</tbody></table>`

const domainsBlock = `<table class="compact"><tbody>${domains
  .map(
    (d) => `<tr>
      <th>${esc(d.domain)}<br /><span class="tech">${esc(d.status)}</span></th>
      <td>
        <strong>${esc(d.project)}</strong>${
          d.href ? ` &nbsp;•&nbsp; <span class="url">${link(d.href, d.hrefLabel)}</span>` : ''
        }
        <br />${esc(d.summary)}
      </td>
    </tr>`,
  )
  .join('')}</tbody></table>`

const publicationsBlock = `<ol class="pubs">${publications
  .map(
    (p) =>
      `<li><span class="pub">${esc(p.title)}</span> — ${esc(p.venue)}, ${esc(p.year)}</li>`,
  )
  .join('')}</ol>`

const educationBlock = education
  .map(
    (e) => `<article class="entry tight">
      <div class="row">
        <p class="title"><strong>${esc(e.degree)}</strong></p>
        <p class="cgpa">${esc(e.grade)}</p>
      </div>
      <p class="place">${esc(e.school)} &nbsp;•&nbsp; ${esc(e.period)}</p>
      ${e.thesis ? `<p class="summary"><em>Thesis:</em> ${esc(e.thesis)}</p>` : ''}
      <p class="summary">${esc(e.note)}</p>
    </article>`,
  )
  .join('')

const credentialsBlock = `<ul class="certs">${credentials
  .map(
    (c) => `<li><strong>${esc(c.title)}</strong> — ${esc(c.issuer)} (${esc(c.meta)})</li>`,
  )
  .join('')}</ul>`

// Contribution graphs, kept from the original CV's "in case the link can't show".
const graphs = contributions
  .map((c) => ({ ...c, uri: c.image ? dataUri(c.image, 'image/webp') : null }))
  .filter((c) => c.uri)

const graphsBlock = graphs.length
  ? section(
      'Development activity',
      `<p class="summary note">Contribution graphs, in case the profile links cannot be opened. Most
        day-to-day work is in private repositories on the company GitLab.</p>
       ${graphs
         .map(
           (g) => `<figure class="graph">
             <figcaption>${esc(g.platform)} — ${esc(g.handle)} (${esc(g.visibility)})</figcaption>
             <img src="${g.uri}" alt="${esc(g.imageAlt)}" />
           </figure>`,
         )
         .join('')}`,
      'appendix',
    )
  : ''

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${esc(profile.name)} — Curriculum Vitae</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
<style>
  @page { size: A4; margin: 13mm 14mm; }

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
    line-height: 1.4;
    color: var(--body);
    background: #fff;
  }

  a { color: var(--brand); text-decoration: none; }
  strong { color: var(--ink); font-weight: 600; }

  /* ---------- header ---------- */
  header { text-align: center; padding-bottom: 9px; }
  .portrait {
    width: 68px; height: 68px;
    object-fit: cover;
    border-radius: 50%;
    border: 1pt solid #c9d2dc;
    margin: 0 auto 7px;
    display: block;
  }
  h1 {
    margin: 0;
    font-size: 22pt;
    font-weight: 700;
    letter-spacing: -0.015em;
    color: var(--ink);
  }
  .subtitle {
    margin: 3px 0 0;
    font-size: 11.5pt;
    font-weight: 500;
    color: var(--brand);
  }
  .contacts { margin: 7px 0 0; font-size: 8.6pt; color: var(--body); }
  .contacts .bar { color: #b9c2cc; padding: 0 6px; }
  .location { margin: 2px 0 0; font-size: 8.6pt; color: var(--muted); }

  /* ---------- sections ---------- */
  section { margin-top: 11px; }
  section h2 {
    margin: 0 0 6px;
    padding-top: 7px;
    border-top: 1.9pt solid var(--rule);
    font-size: 10.2pt;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--brand);
    /* Never let a heading sit alone at the foot of a page */
    break-after: avoid;
    page-break-after: avoid;
  }

  .lead { margin: 0; }
  .lead + p { margin-top: 5px; }

  /* ---------- entries ---------- */
  .entry { margin-bottom: 9px; break-inside: avoid; page-break-inside: avoid; }
  .entry:last-child { margin-bottom: 0; }
  .entry.tight { margin-bottom: 6px; }

  .row { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
  .title { margin: 0; font-size: 10pt; color: var(--ink); }
  .title .org { color: var(--brand); font-weight: 500; }
  .title .url { font-size: 8.4pt; font-weight: 400; }
  .date, .cgpa {
    margin: 0; flex-shrink: 0; white-space: nowrap;
    font-size: 8.8pt; font-style: italic; color: var(--muted);
  }
  .cgpa { font-style: normal; font-weight: 600; color: var(--brand); }
  .place { margin: 1px 0 0; font-size: 8.8pt; font-style: italic; color: var(--muted); }
  .tech { margin: 1px 0 0; font-size: 8.6pt; color: var(--brand); text-align: right; }
  .summary { margin: 3px 0 0; }
  .summary.note { color: var(--muted); }

  .entry ul { margin: 3px 0 0; padding-left: 15px; }
  .entry li { margin-bottom: 1px; }
  .meta { margin: 3px 0 0; font-size: 8.6pt; color: var(--muted); }
  .meta .lbl { font-weight: 600; color: var(--ink); }

  /* ---------- skills ---------- */
  table.skills { width: 100%; border-collapse: collapse; }
  table.skills th, table.skills td { text-align: left; vertical-align: top; padding: 2px 0; }
  table.skills th { width: 108px; font-weight: 600; color: var(--ink); }
  table.skills td { color: var(--body); }

  /* ---------- condensed projects ---------- */
  table.compact { width: 100%; border-collapse: collapse; }
  table.compact tr { break-inside: avoid; page-break-inside: avoid; }
  table.compact th, table.compact td {
    text-align: left; vertical-align: top;
    padding: 4px 10px 4px 0;
    border-top: 0.5pt solid #dfe4ea;
    font-weight: 400; font-size: 8.9pt;
  }
  table.compact th { width: 31%; font-weight: 600; color: var(--ink); }
  table.compact .url { font-size: 8.2pt; font-weight: 400; }
  table.compact .tech { text-align: left; }

  /* ---------- publications & certs ---------- */
  .pubs { margin: 0; padding-left: 16px; }
  .pubs li { margin-bottom: 3px; break-inside: avoid; }
  .pubs .pub { color: var(--brand); font-weight: 500; }
  .evidence th { width: 32%; color: var(--ink); }
  ul.tight { margin: 3px 0 0; padding-left: 14px; }
  ul.tight li { margin-bottom: 1px; }
  .certs { margin: 0; padding-left: 16px; }
  .certs li { margin-bottom: 2px; }

  /* ---------- activity graphs ---------- */
  section.appendix { break-before: page; page-break-before: always; margin-top: 0; }
  section.appendix h2 { border-top: none; padding-top: 0; }
  .graph { margin: 7px 0 0; break-inside: avoid; page-break-inside: avoid; }
  .graph figcaption {
    font-size: 8.4pt; font-weight: 600; color: var(--ink); margin-bottom: 3px;
  }
  .graph img { width: 100%; border: 0.5pt solid #dfe4ea; display: block; }
</style>
</head>
<body>
  <header>
    ${photo ? `<img class="portrait" src="${photo}" alt="" />` : ''}
    <h1>${esc(profile.name)}</h1>
    <p class="subtitle">${esc(profile.role)} &nbsp;|&nbsp; ${esc(profile.secondaryRole)}</p>
    <p class="contacts">${contacts.join('<span class="bar">|</span>')}</p>
    <p class="location">${esc(profile.location)}</p>
  </header>

  ${section(
    'Professional summary',
    `<p class="lead">${esc(about.lead)}</p>
     <p>${esc(about.paragraphs[0])}</p>`,
  )}

  ${section('Selected work in production', evidenceBlock)}
  ${section('University systems delivered', domainsBlock)}
  ${section('Technical skills', skillsBlock)}
  ${section('Professional experience', experienceBlock)}
  ${section('Teaching experience', teachingBlock)}
  ${section('Featured projects', featuredBlock)}
  ${section('Additional projects', othersBlock)}
  ${section('Education', educationBlock)}
  ${section('Publications', publicationsBlock)}
  ${section('Certifications & recognition', credentialsBlock)}
  ${graphsBlock}
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
