import type { Directive } from 'vue'

interface MagneticEl extends HTMLElement {
  _magneticCleanup?: () => void
}

/**
 * `v-magnetic` — nudges a control a few pixels toward the cursor while it is
 * hovered, then releases it. Strength is tunable: `v-magnetic="10"`.
 *
 * Skipped entirely on touch/coarse pointers and under reduced motion, since
 * the effect only exists for a cursor to chase.
 */
export const vMagnetic: Directive<MagneticEl, number | undefined> = {
  mounted(el, binding) {
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    ) {
      return
    }

    const strength = binding.value ?? 8
    let frame = 0

    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
        const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
        el.style.transform = `translate(${dx * strength}px, ${dy * strength * 0.6}px)`
      })
    }

    const onLeave = () => {
      cancelAnimationFrame(frame)
      el.style.transform = ''
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)

    el._magneticCleanup = () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  },

  unmounted(el) {
    el._magneticCleanup?.()
    delete el._magneticCleanup
  },
}
