<script setup lang="ts">
/**
 * Stand-in artwork for the scheduling platform, which has no public deployment
 * to screenshot. Drawn in the site's own blueprint language so it reads as a
 * deliberate illustration rather than a missing image, and built from theme
 * tokens so it flips with light/dark like everything else.
 */

const days = ['MON', 'TUE', 'WED', 'THU', 'FRI']
const times = ['08', '10', '12', '14', '16']

const COL_X = 74
const COL_W = 76
const ROW_Y = 54
const ROW_H = 40

// col, row, span (in rows), and whether it reads as a highlighted session
// Index-only lists for the grid rules, so the template binds nothing it drops.
const rowIdx = times.map((_, i) => i)
const colIdx = days.map((_, i) => i)

const blocks: Array<{ c: number; r: number; s: number; on?: boolean }> = [
  { c: 0, r: 0, s: 2, on: true },
  { c: 1, r: 1, s: 1 },
  { c: 2, r: 0, s: 1 },
  { c: 2, r: 2, s: 2, on: true },
  { c: 3, r: 1, s: 2 },
  { c: 4, r: 0, s: 1, on: true },
  { c: 4, r: 3, s: 1 },
  { c: 1, r: 3, s: 1 },
]
</script>

<template>
  <svg
    viewBox="0 0 460 262"
    class="aspect-video w-full bg-surface-2/40"
    role="img"
    aria-label="Illustration of a weekly scheduling grid with sessions placed across five days"
  >
    <!-- Column and row rules -->
    <g stroke="currentColor" class="text-line" stroke-width="1" vector-effect="non-scaling-stroke">
      <line v-for="i in rowIdx" :key="`h${i}`" :x1="60" :y1="ROW_Y + i * ROW_H" :x2="450" :y2="ROW_Y + i * ROW_H" />
      <line :x1="60" :y1="ROW_Y + times.length * ROW_H" :x2="450" :y2="ROW_Y + times.length * ROW_H" />
      <line v-for="i in colIdx" :key="`v${i}`" :x1="COL_X + i * COL_W - 8" :y1="34" :x2="COL_X + i * COL_W - 8" :y2="ROW_Y + times.length * ROW_H" />
    </g>

    <!-- Day headings -->
    <g class="fill-current text-ink-3" style="font-family: var(--font-mono)" font-size="9" letter-spacing="1.4">
      <text v-for="(d, i) in days" :key="d" :x="COL_X + i * COL_W" y="26">{{ d }}</text>
    </g>

    <!-- Time gutter -->
    <g class="fill-current text-ink-3" style="font-family: var(--font-mono)" font-size="8" letter-spacing="1">
      <text v-for="(t, i) in times" :key="t" x="20" :y="ROW_Y + i * ROW_H + 15">{{ t }}:00</text>
    </g>

    <!-- Scheduled sessions -->
    <g>
      <template v-for="(b, i) in blocks" :key="i">
        <rect
          :x="COL_X + b.c * COL_W - 2"
          :y="ROW_Y + b.r * ROW_H + 6"
          :width="COL_W - 18"
          :height="b.s * ROW_H - 12"
          rx="2"
          class="fill-current"
          :class="b.on ? 'text-accent' : 'text-surface'"
          :opacity="b.on ? 0.9 : 1"
        />
        <rect
          :x="COL_X + b.c * COL_W - 2"
          :y="ROW_Y + b.r * ROW_H + 6"
          :width="COL_W - 18"
          :height="b.s * ROW_H - 12"
          rx="2"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          vector-effect="non-scaling-stroke"
          :class="b.on ? 'text-accent' : 'text-line-strong'"
        />
        <!-- two short rules standing in for the session label -->
        <line
          :x1="COL_X + b.c * COL_W + 4"
          :y1="ROW_Y + b.r * ROW_H + 18"
          :x2="COL_X + b.c * COL_W + 34"
          :y2="ROW_Y + b.r * ROW_H + 18"
          stroke="currentColor"
          stroke-width="2"
          class="text-bg"
          :class="b.on ? 'text-bg' : 'text-line-strong'"
          vector-effect="non-scaling-stroke"
        />
        <line
          :x1="COL_X + b.c * COL_W + 4"
          :y1="ROW_Y + b.r * ROW_H + 26"
          :x2="COL_X + b.c * COL_W + 22"
          :y2="ROW_Y + b.r * ROW_H + 26"
          stroke="currentColor"
          stroke-width="2"
          :class="b.on ? 'text-bg' : 'text-line'"
          vector-effect="non-scaling-stroke"
        />
      </template>
    </g>

    <!-- Sheet label -->
    <text
      x="20"
      y="18"
      class="fill-current text-accent"
      style="font-family: var(--font-mono)"
      font-size="8"
      letter-spacing="1.6"
    >
      TIMETABLE
    </text>
  </svg>
</template>
