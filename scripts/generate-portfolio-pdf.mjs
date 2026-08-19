/**
 * Exports the whole portfolio site to application/portfolio.pdf.
 *
 *   npm run portfolio:pdf
 *
 * Serves dist/ over a throwaway local server (a Vue SPA cannot run from
 * file://), then prints it with headless Chrome. The npm script builds
 * first, so run it that way rather than calling this file directly. Layout
 * comes from the @media print block in src/style.css: light palette, every
 * scroll-reveal shown, the sticky rail flattened into a normal block.
 */
import { execFile, execFileSync } from 'node:child_process'
import { createReadStream, existsSync, mkdirSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const out = resolve(root, 'application/portfolio.pdf')

const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.pdf': 'application/pdf',
  '.json': 'application/json',
}

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

if (!CHROME) {
  console.error('No Chrome/Chromium found.')
  process.exit(1)
}

if (!existsSync(resolve(dist, 'index.html'))) {
  console.error('dist/ is empty — run `npm run build` first.')
  process.exit(1)
}

const server = createServer((req, res) => {
  const path = decodeURIComponent((req.url ?? '/').split('?')[0])
  let file = resolve(dist, `.${path}`)

  // Anything that is not a real file is the SPA entry point.
  if (!existsSync(file) || statSync(file).isDirectory()) file = join(dist, 'index.html')

  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' })
  createReadStream(file).pipe(res)
})

await new Promise((ok) => server.listen(0, '127.0.0.1', ok))
const { port } = server.address()

mkdirSync(dirname(out), { recursive: true })

/**
 * Chrome has to run asynchronously: execFileSync would block this process's
 * event loop, and the static server above would never accept the connection.
 */
function print(args) {
  return new Promise((ok, fail) => {
    execFile(CHROME, args, { timeout: 120_000 }, (err) => (err ? fail(err) : ok()))
  })
}

try {
  await print(
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--no-pdf-header-footer',
      // Enough for fonts, 13 images and the SVG diagram to settle. The print
      // stylesheet stops all animation, so nothing keeps the clock running.
      '--virtual-time-budget=15000',
      '--force-color-profile=srgb',
      `--print-to-pdf=${out}`,
      `http://127.0.0.1:${port}/`,
    ],
  )
  console.log('wrote', out)
} finally {
  // Chrome leaves keep-alive sockets behind; drop them so node can exit.
  server.closeAllConnections?.()
  server.close()
}
