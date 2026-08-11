import type { Directive } from 'vue'

/**
 * `v-reveal` — fades an element up once as it enters the viewport, then stops
 * observing. A numeric arg staggers it: `v-reveal:2` waits 2 × 70ms.
 * Under `prefers-reduced-motion` the element is simply shown as-is.
 */
export const vReveal: Directive<HTMLElement, void> = {
  mounted(el, binding) {
    if (
      typeof window === 'undefined' ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    const step = Number(binding.arg ?? 0)
    el.style.transitionDelay = step > 0 ? `${Math.min(step, 10) * 70}ms` : ''
    el.classList.add('reveal-init')

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          el.classList.add('reveal-in')
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )

    observer.observe(el)
    ;(el as HTMLElement & { _revealObserver?: IntersectionObserver })._revealObserver = observer
  },

  unmounted(el) {
    const target = el as HTMLElement & { _revealObserver?: IntersectionObserver }
    target._revealObserver?.disconnect()
    delete target._revealObserver
  },
}
