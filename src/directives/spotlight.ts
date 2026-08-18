import type { Directive } from 'vue'

type SpotlightEl = HTMLElement & { _spotlightMove?: (event: PointerEvent) => void }

/**
 * `v-spotlight` — feeds the pointer position into `--mx` / `--my` so the
 * `.spotlight` class can paint a highlight that follows the cursor across a
 * card. Pointer-driven only: touch and keyboard users get the static card,
 * which is exactly what the CSS falls back to.
 */
export const vSpotlight: Directive<SpotlightEl, void> = {
  mounted(el) {
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    ) {
      return
    }

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`)
      el.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`)
    }

    el.addEventListener('pointermove', onMove)
    el._spotlightMove = onMove
  },

  unmounted(el) {
    if (el._spotlightMove) el.removeEventListener('pointermove', el._spotlightMove)
    delete el._spotlightMove
  },
}
