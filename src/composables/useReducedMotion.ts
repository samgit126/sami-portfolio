import { onMounted, onUnmounted, ref } from 'vue'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Reactive `prefers-reduced-motion`. Components use this to skip animation
 * entirely rather than just shortening it — a moving diagram is the thing to
 * remove, not to speed up.
 */
export function useReducedMotion() {
  const prefersReducedMotion = ref(
    typeof window !== 'undefined' && window.matchMedia(QUERY).matches,
  )

  let media: MediaQueryList | null = null
  const onChange = (event: MediaQueryListEvent) => {
    prefersReducedMotion.value = event.matches
  }

  onMounted(() => {
    media = window.matchMedia(QUERY)
    prefersReducedMotion.value = media.matches
    media.addEventListener('change', onChange)
  })

  onUnmounted(() => {
    media?.removeEventListener('change', onChange)
  })

  return { prefersReducedMotion }
}
