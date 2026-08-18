#!/usr/bin/env python3
"""
Builds the EOI application letter as both PDF and .docx from one source.

The letter body lives in PARAGRAPHS below — edit there, re-run, and both files
regenerate together so they can never drift:

    python3 scripts/generate-letter.py

PDF is printed with headless Chrome (already on the machine, no dependencies).
The .docx is written as minimal OOXML with the standard library's zipfile, so
Samuel can edit it in Word before sending.
"""
import re
import shutil
import subprocess
import zipfile
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "application"
OUT.mkdir(exist_ok=True)

STEM = "Samuel-Temesgen-Yimer-Application-Letter"

NAME = "Samuel Temesgen Yimer"
TITLE = "Front-End Developer & Front-End Team Lead"
CONTACT = [
    "Addis Ababa, Ethiopia",
    "+251 92 122 1326  |  samueltemesgen158@gmail.com",
    "linkedin.com/in/samuel-temesgen  |  github.com/samgit126",
]
DATE = "18 August 2026"
RECIPIENT = [
    "Ethio Serve Trade and Consultancy Enterprise",
    "Addis Ababa, Ethiopia",
]
SUBJECT = "Subject: Application for Frontend Developer — RMIS and ATWMS Projects"
GREETING = "Dear Sir or Madam,"

# (kind, text) — kind is one of: body, close, sign
PARAGRAPHS = [
    ("body",
     "I would like to apply for the Frontend Developer position advertised for the "
     "Research Management Information System and the Academic Task and Workload "
     "Management System at the Ethiopian Public Service University. I am applying "
     "because I have already built both kinds of system for a university, not "
     "something adjacent to them."),

    ("body",
     "For research management, I built the research repository at Wollo University: "
     "research documents, student projects and the approval chain around them, across "
     "seven roles from student and advisor through to department head and research "
     "office. It handles submission, review, commenting and status tracking at every "
     "stage, with document version control and a reporting dashboard. The system is "
     "complete but not yet deployed publicly, so I am happy to walk you through the "
     "code or run it locally for you."),

    ("body",
     "For academic task and workload, I built the Class & Exam Scheduling System now "
     "running for Wollo University at https://schedule.hyperagencyet.com. It covers "
     "class timetables, room and instructor allocation, teaching load distribution, "
     "conflict detection and exam invigilation, and it is configurable for any "
     "academic program rather than hard-coded to one institution."),

    ("body",
     "I also have some history with the University itself: I built the public EPSU "
     "website at www.epsu.edu.et as a volunteer, at no cost, because a university "
     "serving the country's civil service deserves a site that works as well as any "
     "commercial one."),

    ("body",
     "My current role is Front-End Team Lead at Qelem Meda Technologies on the Haleta "
     "ERP platform, haleta.qelemmeda.et, where I own the front-end architecture: "
     "module boundaries, the shared component library, coding standards and review "
     "process. For six years my daily work has been Vue 3 and TypeScript with Tailwind "
     "CSS and PrimeVue against Laravel REST APIs, with real attention to responsive "
     "layouts, keyboard access and the performance of data-heavy screens."),

    ("body",
     "I hold an MSc in Software Engineering with a CGPA of 3.97 and a BSc in the same "
     "field, I work in Agile sprints inside a multidisciplinary team, and I am based in "
     "Addis Ababa and available on site as the hybrid arrangement requires. I have "
     "lectured software engineering at Wollo University's Kombolcha Institute of "
     "Technology since 2019 and published three peer-reviewed papers, one of them in "
     "IEEE Access. University systems are the environment I both teach in and build for."),

    ("body",
     "My CV, copies of my academic and professional credentials, and my portfolio with "
     "live deployment links for each project above are attached. Thank you for "
     "considering my application; I am available for an interview or a technical review "
     "at any time."),

    ("close", "Sincerely,"),
    ("sign", NAME),
]

# --------------------------------------------------------------------------- #
# Inline links
# --------------------------------------------------------------------------- #

LINK_RE = re.compile(
    r"(?P<email>[\w.+-]+@[\w-]+\.[\w.-]+)"
    r"|(?P<url>(?:https?://|www\.)[^\s,;]+"
    r"|(?:[a-z0-9-]+\.)+(?:com|et|org|net|io|edu)(?:/[^\s,;]*)?)"
)


def inline_runs(text: str):
    """Split a paragraph into ('text'|'link', shown, href) runs.

    Bare domains are written as they should read on the page, so the href is
    reconstructed here rather than cluttering the letter source.
    """
    runs, pos = [], 0
    for m in LINK_RE.finditer(text):
        shown = m.group(0)
        trail = ""
        while shown and shown[-1] in ".,;:":  # sentence punctuation, not the URL
            trail, shown = shown[-1] + trail, shown[:-1]
        if not shown:
            continue

        if m.start() > pos:
            runs.append(("text", text[pos:m.start()], None))

        if m.group("email"):
            href = f"mailto:{shown}"
        elif shown.startswith("http"):
            href = shown
        else:
            href = f"https://{shown}"

        runs.append(("link", shown, href))
        if trail:
            runs.append(("text", trail, None))
        pos = m.end()

    if pos < len(text):
        runs.append(("text", text[pos:], None))
    return runs


# --------------------------------------------------------------------------- #
# PDF
# --------------------------------------------------------------------------- #

def html_inline(text: str) -> str:
    out = []
    for kind, shown, href in inline_runs(text):
        if kind == "link":
            out.append(f'<a href="{escape(href, quote=True)}">{escape(shown)}</a>')
        else:
            out.append(escape(shown))
    return "".join(out)


def build_html() -> str:
    body = "".join(
        f'<p class="{kind}">{html_inline(text)}</p>' for kind, text in PARAGRAPHS
    )
    contact = "<br />".join(html_inline(line) for line in CONTACT)
    recipient = "<br />".join(escape(line) for line in RECIPIENT)
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>{escape(NAME)} — Application Letter</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
<style>
  @page {{ size: A4; margin: 15mm 18mm; }}
  * {{ box-sizing: border-box; }}
  html {{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
  body {{
    margin: 0;
    font-family: Inter, Calibri, Arial, sans-serif;
    font-size: 9.5pt;
    line-height: 1.5;
    color: #262626;
  }}
  a {{ color: #2e74b5; text-decoration: none; border-bottom: 0.4pt solid #a9c6e4; }}
  header {{ border-bottom: 1.6pt solid #1f3864; padding-bottom: 9px; }}
  h1 {{ margin: 0; font-size: 15pt; font-weight: 700; color: #1a1a1a; letter-spacing: -0.01em; }}
  .role {{ margin: 2px 0 5px; font-size: 9.6pt; font-weight: 500; color: #2e74b5; }}
  .contact {{ margin: 0; font-size: 8.7pt; color: #5f6b76; line-height: 1.5; }}
  .date {{ margin: 13px 0 0; font-size: 9pt; color: #5f6b76; }}
  .recipient {{ margin: 12px 0 0; font-size: 9.5pt; }}
  .subject {{ margin: 13px 0 0; font-weight: 600; color: #1a1a1a; }}
  .greeting {{ margin: 12px 0 0; }}
  p.body {{ margin: 8px 0 0; text-align: justify; }}
  p.close {{ margin: 12px 0 0; }}
  p.sign {{ margin: 18px 0 0; font-weight: 600; color: #1a1a1a; }}
</style>
</head>
<body>
  <header>
    <h1>{escape(NAME)}</h1>
    <p class="role">{escape(TITLE)}</p>
    <p class="contact">{contact}</p>
  </header>

  <p class="date">{escape(DATE)}</p>
  <p class="recipient">{recipient}</p>
  <p class="subject">{escape(SUBJECT)}</p>
  <p class="greeting">{escape(GREETING)}</p>
  {body}
</body>
</html>
"""


def write_pdf(html_path: Path, pdf_path: Path) -> bool:
    chrome = next(
        (b for b in ("google-chrome", "google-chrome-stable", "chromium", "chromium-browser")
         if shutil.which(b)),
        None,
    )
    if not chrome:
        print("No Chrome found — open the HTML and print to PDF manually.")
        return False
    subprocess.run(
        [chrome, "--headless=new", "--disable-gpu", "--no-sandbox",
         "--no-pdf-header-footer", "--run-all-compositor-stages-before-draw",
         "--virtual-time-budget=12000", f"--print-to-pdf={pdf_path}",
         f"file://{html_path}"],
        check=True, capture_output=True,
    )
    return True


# --------------------------------------------------------------------------- #
# DOCX — minimal OOXML, no third-party packages
# --------------------------------------------------------------------------- #

W = ('xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" '
     'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"')

# Filled while paragraphs are built; each entry becomes a document relationship.
HYPERLINKS: list[str] = []


def _run(text: str, rpr: str) -> str:
    return f'<w:r>{rpr}<w:t xml:space="preserve">{escape(text)}</w:t></w:r>'


def _link_run(shown: str, href: str) -> str:
    HYPERLINKS.append(href)
    rid = f"rId{len(HYPERLINKS) + 1}"  # rId1 is styles.xml
    rpr = '<w:rPr><w:color w:val="2E74B5"/><w:u w:val="single"/></w:rPr>'
    return f'<w:hyperlink r:id="{rid}">{_run(shown, rpr)}</w:hyperlink>'


def para(text: str, *, bold=False, size=None, color=None, align=None,
         space_before=0, space_after=120) -> str:
    """One <w:p>. Sizes are half-points, spacing is twentieths of a point."""
    rpr = ""
    if bold:
        rpr += "<w:b/>"
    if size:
        rpr += f'<w:sz w:val="{size}"/><w:szCs w:val="{size}"/>'
    if color:
        rpr += f'<w:color w:val="{color}"/>'
    rpr = f"<w:rPr>{rpr}</w:rPr>" if rpr else ""

    ppr = f'<w:spacing w:before="{space_before}" w:after="{space_after}"/>'
    if align:
        ppr += f'<w:jc w:val="{align}"/>'

    runs = "".join(
        _link_run(shown, href) if kind == "link" else _run(shown, rpr)
        for kind, shown, href in inline_runs(text)
    )
    return f"<w:p><w:pPr>{ppr}</w:pPr>{runs}</w:p>"


def build_docx(path: Path) -> None:
    parts = [
        para(NAME, bold=True, size=30, color="1A1A1A", space_after=40),
        para(TITLE, bold=True, size=19, color="2E74B5", space_after=60),
    ]
    for line in CONTACT:
        parts.append(para(line, size=17, color="5F6B76", space_after=0))

    parts.append(para(DATE, size=18, color="5F6B76", space_before=320, space_after=160))
    for line in RECIPIENT:
        parts.append(para(line, space_after=0))

    parts.append(para(SUBJECT, bold=True, color="1A1A1A", space_before=320, space_after=200))
    parts.append(para(GREETING, space_after=160))

    for kind, text in PARAGRAPHS:
        if kind == "body":
            parts.append(para(text, align="both", space_after=200))
        elif kind == "close":
            parts.append(para(text, space_before=200, space_after=0))
        else:
            parts.append(para(text, bold=True, color="1A1A1A", space_before=440))

    sect = ('<w:sectPr><w:pgSz w:w="11906" w:h="16838"/>'
            '<w:pgMar w:top="1021" w:right="1134" w:bottom="1021" w:left="1134"/></w:sectPr>')

    document = (f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
                f'<w:document {W}><w:body>{"".join(parts)}{sect}</w:body></w:document>')

    styles = (f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
              f'<w:styles {W}><w:docDefaults><w:rPrDefault><w:rPr>'
              f'<w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>'
              f'<w:sz w:val="19"/><w:szCs w:val="19"/><w:color w:val="262626"/>'
              f'</w:rPr></w:rPrDefault><w:pPrDefault><w:pPr>'
              f'<w:spacing w:line="276" w:lineRule="auto"/>'
              f'</w:pPr></w:pPrDefault></w:docDefaults></w:styles>')

    content_types = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        '<Default Extension="xml" ContentType="application/xml"/>'
        '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
        '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>'
        '</Types>')

    root_rels = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>'
        '</Relationships>')

    links = "".join(
        f'<Relationship Id="rId{i + 2}" '
        f'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" '
        f'Target="{escape(href, quote=True)}" TargetMode="External"/>'
        for i, href in enumerate(HYPERLINKS)
    )
    doc_rels = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
        f'{links}'
        '</Relationships>')

    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", content_types)
        z.writestr("_rels/.rels", root_rels)
        z.writestr("word/_rels/document.xml.rels", doc_rels)
        z.writestr("word/document.xml", document)
        z.writestr("word/styles.xml", styles)


html_path = OUT / f"{STEM}.html"
html_path.write_text(build_html(), encoding="utf-8")
print("wrote", html_path)

if write_pdf(html_path, OUT / f"{STEM}.pdf"):
    print("wrote", OUT / f"{STEM}.pdf")

build_docx(OUT / f"{STEM}.docx")
print("wrote", OUT / f"{STEM}.docx")
