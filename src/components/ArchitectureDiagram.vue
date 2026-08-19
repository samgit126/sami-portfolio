<script setup lang="ts">
import { computed } from 'vue'
import { useReducedMotion } from '../composables/useReducedMotion'

interface DiagramNode {
  id: string
  label: string
  x: number
  y: number
  w: number
  hub?: boolean
}

const { prefersReducedMotion } = useReducedMotion()

const NODE_H = 32
const CORNER = 8

const nodes: DiagramNode[] = [
  { id: 'vue', label: 'Vue 3', x: 8, y: 42, w: 104 },
  { id: 'ts', label: 'TypeScript', x: 138, y: 42, w: 104 },
  { id: 'tw', label: 'Tailwind', x: 268, y: 42, w: 104 },

  { id: 'core', label: 'Component Architecture', x: 60, y: 148, w: 260, hub: true },

  { id: 'prime', label: 'PrimeVue', x: 8, y: 254, w: 104 },
  { id: 'comp', label: 'Composables', x: 138, y: 254, w: 104 },
  { id: 'vite', label: 'Vite', x: 268, y: 254, w: 104 },

  { id: 'api', label: 'REST API · Laravel', x: 78, y: 352, w: 224 },

  { id: 'mysql', label: 'MySQL', x: 30, y: 446, w: 130 },
  { id: 'pg', label: 'PostgreSQL', x: 220, y: 446, w: 130 },
]

const layers = [
  { label: 'Interface', y: 42 },
  { label: 'Core', y: 148 },
  { label: 'Patterns', y: 254 },
  { label: 'Service', y: 352 },
  { label: 'Data', y: 446 },
]

const edges: Array<[string, string, number]> = [
  ['vue', 'core', 3.2],
  ['ts', 'core', 2.6],
  ['tw', 'core', 3.8],
  ['core', 'prime', 3.4],
  ['core', 'comp', 2.8],
  ['core', 'vite', 4.0],
  ['comp', 'api', 3.0],
  ['api', 'mysql', 3.6],
  ['api', 'pg', 4.2],
]

const byId = new Map(nodes.map((n) => [n.id, n]))

/** Orthogonal elbow with rounded corners — reads like a schematic trace. */
function elbowPath(from: DiagramNode, to: DiagramNode): string {
  const x1 = from.x + from.w / 2
  const y1 = from.y + NODE_H
  const x2 = to.x + to.w / 2
  const y2 = to.y
  const midY = (y1 + y2) / 2

  if (Math.abs(x1 - x2) < 1) return `M ${x1} ${y1} L ${x2} ${y2}`

  const dir = x2 > x1 ? 1 : -1
  return [
    `M ${x1} ${y1}`,
    `L ${x1} ${midY - CORNER}`,
    `Q ${x1} ${midY} ${x1 + dir * CORNER} ${midY}`,
    `L ${x2 - dir * CORNER} ${midY}`,
    `Q ${x2} ${midY} ${x2} ${midY + CORNER}`,
    `L ${x2} ${y2}`,
  ].join(' ')
}

const links = computed(() =>
  edges.map(([fromId, toId, duration], i) => {
    const from = byId.get(fromId)!
    const to = byId.get(toId)!
    return {
      id: `link-${i}`,
      d: elbowPath(from, to),
      // Negative begin so every pulse is already mid-flight on the first
      // frame — otherwise they all sit parked at the SVG origin until t=0.
      duration: `${duration}s`,
      delay: `${(-0.42 * (i + 1)).toFixed(2)}s`,
    }
  }),
)
</script>

<template>
  <figure class="card relative m-0 overflow-hidden">
    <!-- Faint brand wash so the diagram sits on its own plate -->
    <span
      aria-hidden="true"
      class="orb animate-float-slower -right-20 -top-20 h-56 w-56"
      style="background: radial-gradient(circle, var(--brand) 0%, transparent 70%); opacity: 0.18"
    />

    <div class="relative px-4 pb-4 pt-3 sm:px-6 sm:pb-6">
      <div class="mb-4 flex items-center justify-between border-b border-line pb-3">
        <span class="label text-ink-3">Fig. 01 · Front-end stack</span>
        <span class="chip chip-accent py-1">Haleta</span>
      </div>

      <svg
        viewBox="0 0 380 486"
        class="h-auto w-full"
        role="img"
        aria-labelledby="diagram-title diagram-desc"
      >
        <title id="diagram-title">Front-end architecture diagram</title>
        <desc id="diagram-desc">
          A layered stack: Vue 3, TypeScript and Tailwind feed a component architecture core, which
          fans out to PrimeVue, composables and Vite, then connects through a Laravel REST API to
          MySQL and PostgreSQL databases.
        </desc>

        <!-- Traces -->
        <g fill="none" stroke="currentColor" class="text-line-strong">
          <path
            v-for="link in links"
            :key="link.id"
            :id="link.id"
            :d="link.d"
            stroke-width="1"
            vector-effect="non-scaling-stroke"
          />
        </g>

        <!-- Dashed overlay that crawls along each trace -->
        <g
          v-if="!prefersReducedMotion"
          fill="none"
          stroke="currentColor"
          class="text-accent/45 print:hidden"
          aria-hidden="true"
        >
          <path
            v-for="link in links"
            :key="`dash-${link.id}`"
            :d="link.d"
            stroke-width="1"
            stroke-dasharray="4 20"
            vector-effect="non-scaling-stroke"
            :style="{ animation: `trace-dash ${link.duration} linear infinite` }"
          />
        </g>

        <!-- Layer rails and labels -->
        <g aria-hidden="true">
          <template v-for="layer in layers" :key="layer.label">
            <line
              :x1="60"
              :y1="layer.y - 14"
              :x2="380"
              :y2="layer.y - 14"
              stroke="currentColor"
              class="text-line"
              stroke-width="1"
              stroke-dasharray="2 6"
              vector-effect="non-scaling-stroke"
            />
            <text
              x="0"
              :y="layer.y - 11"
              class="fill-current text-ink-3"
              font-size="8"
              letter-spacing="1.6"
              style="font-family: var(--font-mono); text-transform: uppercase"
            >
              {{ layer.label.toUpperCase() }}
            </text>
          </template>
        </g>

        <!-- Nodes -->
        <g>
          <g v-for="node in nodes" :key="node.id">
            <rect
              v-if="node.hub && !prefersReducedMotion"
              :x="node.x - 6"
              :y="node.y - 6"
              :width="node.w + 12"
              :height="NODE_H + 12"
              rx="10"
              class="fill-current text-accent"
              style="animation: hub-breathe 3.6s ease-in-out infinite"
            />
            <rect
              :x="node.x"
              :y="node.y"
              :width="node.w"
              :height="NODE_H"
              rx="8"
              class="fill-current"
              :class="node.hub ? 'text-accent' : 'text-surface'"
            />
            <rect
              :x="node.x"
              :y="node.y"
              :width="node.w"
              :height="NODE_H"
              rx="8"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
              vector-effect="non-scaling-stroke"
              :class="node.hub ? 'text-accent' : 'text-line-strong'"
            />
            <text
              :x="node.x + node.w / 2"
              :y="node.y + NODE_H / 2"
              text-anchor="middle"
              dominant-baseline="central"
              :font-size="node.hub ? 11 : 10"
              class="fill-current"
              :class="node.hub ? 'text-bg' : 'text-ink-2'"
              style="font-family: var(--font-mono)"
            >
              {{ node.label }}
            </text>
          </g>
        </g>

        <!-- Data pulses travelling the traces -->
        <g v-if="!prefersReducedMotion" class="print:hidden" aria-hidden="true">
          <circle
            v-for="link in links"
            :key="`pulse-${link.id}`"
            r="2.6"
            class="fill-current text-accent-vivid"
          >
            <animateMotion
              :dur="link.duration"
              :begin="link.delay"
              repeatCount="indefinite"
              rotate="auto"
            >
              <mpath :href="`#${link.id}`" :xlink:href="`#${link.id}`" />
            </animateMotion>
          </circle>
        </g>
      </svg>

      <div
        class="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2"
      >
        <span class="label text-ink-3">Composition API · strict TS</span>
        <span class="label text-ink-3">
          {{ prefersReducedMotion ? 'Static view' : 'Live trace' }}
        </span>
      </div>
    </div>
  </figure>
</template>
