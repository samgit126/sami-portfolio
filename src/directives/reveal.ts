import type { Directive } from 'vue'
import { onInView } from '../utils/inview'

type RevealEl = HTMLElement & { _revealCancel?: () => void }

/**
 * `v-reveal` — fades an element up (and un-blurs it) once it reaches the
 * viewport.
 *
 *   v-reveal          plain fade-up
 *   v-reveal:3        staggered — waits 3 × 80ms
 *   v-reveal.left     slides in from the left instead of from below
 *   v-reveal.right    slides in from the right
 *
 * Under `prefers-reduced-motion` the element is simply shown as-is.
 */
export const vReveal: Directive<RevealEl, void> = {
  mounted(el, binding) {
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    const step = Number(binding.arg ?? 0)
    el.style.transitionDelay = step > 0 ? `${Math.min(step, 12) * 80}ms` : ''

    el.classList.add('reveal-init')
    if (binding.modifiers.left) el.classList.add('reveal-init-left')
    if (binding.modifiers.right) el.classList.add('reveal-init-right')

    el._revealCancel = onInView(el, () => el.classList.add('reveal-in'))
  },

  unmounted(el) {
    el._revealCancel?.()
    delete el._revealCancel
  },
}
