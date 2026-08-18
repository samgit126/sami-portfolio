import { onMounted, onUnmounted, ref } from 'vue'

/** Fraction of the page scrolled, 0 → 1, updated on a rAF-throttled scroll. */
export function useScrollProgress() {
  const progress = ref(0)
  let frame = 0

  function measure() {
    const doc = document.documentElement
    const scrollable = doc.scrollHeight - window.innerHeight
    progress.value = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0
  }

  function onScroll() {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(measure)
  }

  onMounted(() => {
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
  })

  onUnmounted(() => {
    cancelAnimationFrame(frame)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  })

  return { progress }
}
