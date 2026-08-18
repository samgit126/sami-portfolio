import { onMounted, onUnmounted, ref } from 'vue'

/**
 * Tracks which section is currently in view so the rail nav can mark it.
 *
 * Measured on a rAF-throttled scroll rather than with an IntersectionObserver:
 * an observer reports threshold *crossings*, so a single large jump — an anchor
 * link, Page Down — can leave the marker on a section that scrolled by long
 * ago. Re-measuring from scroll position is always right, whatever the jump.
 *
 * The active section is the last one whose top edge has passed `offset`.
 */
export function useScrollSpy(ids: string[], offset = 140) {
  // Starts empty: while the intro is in view no nav item should read as current.
  const activeId = ref<string>('')
  let frame = 0

  function measure() {
    frame = 0
    let best = ''
    let bestTop = Number.NEGATIVE_INFINITY

    for (const id of ids) {
      const el = document.getElementById(id)
      if (!el) continue

      const top = el.getBoundingClientRect().top - offset
      if (top <= 0 && top > bestTop) {
        bestTop = top
        best = id
      }
    }

    // The last section is often too short to ever reach the offset line, so
    // hand it the marker once the page cannot scroll any further.
    const doc = document.documentElement
    if (window.scrollY + window.innerHeight >= doc.scrollHeight - 4) {
      best = ids[ids.length - 1] ?? best
    }

    activeId.value = best
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(measure)
  }

  onMounted(() => {
    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
  })

  onUnmounted(() => {
    cancelAnimationFrame(frame)
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
  })

  return { activeId }
}
