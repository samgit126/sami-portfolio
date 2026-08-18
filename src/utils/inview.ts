/**
 * Fires a callback the first time an element reaches the viewport.
 *
 * Deliberately not an IntersectionObserver: an observer only reports threshold
 * *crossings*, so a single large scroll jump — an anchor link, Page Down, a
 * restored scroll position — can move an element from below the fold to above
 * it between two frames without ever intersecting. The callback then never
 * runs and the element stays in its hidden pre-reveal state for good.
 *
 * Instead every registered element is swept on a rAF-throttled scroll, which
 * catches "already past it" as readily as "just came into view". One listener
 * serves the whole page, and it detaches once nothing is left to watch.
 */

type Entry = { el: HTMLElement; run: () => void }

const pending = new Set<Entry>()
let frame = 0
let listening = false

/** Reveal a little before the element's top edge reaches the bottom. */
const MARGIN = 0.94

function sweep() {
  frame = 0
  const limit = window.innerHeight * MARGIN

  for (const entry of pending) {
    const rect = entry.el.getBoundingClientRect()
    if (rect.top < limit) {
      pending.delete(entry)
      entry.run()
    }
  }

  if (pending.size === 0) stopListening()
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(sweep)
}

function startListening() {
  if (listening) return
  listening = true
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
}

function stopListening() {
  if (!listening) return
  listening = false
  window.removeEventListener('scroll', schedule)
  window.removeEventListener('resize', schedule)
}

/** Returns a cancel function for components that unmount before firing. */
export function onInView(el: HTMLElement, run: () => void): () => void {
  const entry: Entry = { el, run }
  pending.add(entry)
  startListening()
  schedule()

  return () => {
    pending.delete(entry)
    if (pending.size === 0) stopListening()
  }
}
