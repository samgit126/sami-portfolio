import { onMounted, onUnmounted, ref } from 'vue'

/**
 * Tracks which section id is currently in view so the header nav can mark it.
 * Picks the entry closest to the top of the viewport rather than the largest
 * one, which keeps short sections from being skipped.
 */
export function useScrollSpy(ids: string[], offset = 96) {
  // Starts empty: while the hero is in view no nav item should read as current.
  const activeId = ref<string>('')
  let observer: IntersectionObserver | null = null
  const visible = new Map<string, number>()

  function pickActive() {
    if (visible.size === 0) {
      activeId.value = ''
      return
    }

    let best = ''
    let bestTop = Number.POSITIVE_INFINITY

    for (const id of ids) {
      if (!visible.has(id)) continue
      const top = visible.get(id) ?? 0
      const distance = Math.abs(top)
      if (distance < bestTop) {
        bestTop = distance
        best = id
      }
    }

    if (best) activeId.value = best
  }

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id
          if (entry.isIntersecting) {
            visible.set(id, entry.boundingClientRect.top - offset)
          } else {
            visible.delete(id)
          }
        }
        pickActive()
      },
      { rootMargin: `-${offset}px 0px -55% 0px`, threshold: [0, 0.25, 0.5] },
    )

    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
  })

  return { activeId }
}
