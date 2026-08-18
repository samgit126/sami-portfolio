import { onUnmounted, ref, type Ref } from 'vue'
import { onInView } from '../utils/inview'

/**
 * Counts a number up from zero once its element scrolls into view.
 *
 * Values on this site are written as display strings ("6+", "3.97", "11"), so
 * the caller passes the whole string and gets back a string of the same shape:
 * the numeric part animates, any prefix/suffix stays put, and the decimal
 * precision of the source is preserved so "3.97" never lands on "4".
 */
export function useCountUp(raw: string, duration = 1400) {
  const match = raw.match(/^(\D*)([\d.,]+)(.*)$/)
  // A year is a label, not a quantity — "On GitHub since 0…2022" reads as a bug.
  const isYear = match ? /^(19|20)\d{2}$/.test(match[2]) : false
  const el = ref<HTMLElement | null>(null)

  // Not a number we can animate (or motion is unwanted) — show it verbatim.
  const reduced =
    typeof window === 'undefined' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !match ||
    isYear

  const display: Ref<string> = ref(reduced ? raw : `${match![1]}0${match![3]}`)

  let cancel: (() => void) | undefined
  let frame = 0

  function start(target: number, prefix: string, suffix: string, decimals: number) {
    const startedAt = performance.now()

    const tick = (now: number) => {
      const t = Math.min((now - startedAt) / duration, 1)
      // easeOutExpo — fast off the line, long settle
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      display.value = `${prefix}${(target * eased).toFixed(decimals)}${suffix}`
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
  }

  function observe(node: HTMLElement | null) {
    el.value = node
    if (reduced || !node) return

    const [, prefix, digits, suffix] = match!
    const target = Number(digits.replace(/,/g, ''))
    if (Number.isNaN(target)) {
      display.value = raw
      return
    }
    const decimals = digits.includes('.') ? digits.split('.')[1].length : 0
    display.value = `${prefix}${(0).toFixed(decimals)}${suffix}`

    cancel = onInView(node, () => start(target, prefix, suffix, decimals))
  }

  onUnmounted(() => {
    cancel?.()
    cancelAnimationFrame(frame)
  })

  return { display, observe }
}
