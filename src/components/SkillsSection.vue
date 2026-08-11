<script setup lang="ts">
import SectionShell from './SectionShell.vue'
import { vReveal } from '../directives/reveal'
import { skillGroups } from '../data/portfolio'
</script>

<template>
  <SectionShell
    id="skills"
    index="02"
    eyebrow="Skills"
    title="The stack, grouped by layer"
    intro="Front-end is where I go deep. Everything else is what I need to know to integrate cleanly and ship without waiting on someone else."
  >
    <div class="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
      <article
        v-for="(group, i) in skillGroups"
        :key="group.id"
        v-reveal:[i]
        class="group relative bg-bg p-6 transition-colors hover:bg-surface-2"
      >
        <div class="flex items-baseline justify-between gap-3">
          <h3 class="font-display text-lg font-medium tracking-tight text-ink">
            {{ group.title }}
          </h3>
          <span class="label text-accent">{{ String(i + 1).padStart(2, '0') }}</span>
        </div>

        <!-- Fixed height keeps the rules below aligned across all four cards -->
        <p class="label mt-2 min-h-4 text-ink-3">{{ group.note }}</p>

        <span
          class="mt-5 block h-px w-full bg-line transition-colors group-hover:bg-accent"
          aria-hidden="true"
        />

        <ul class="mt-5 space-y-2.5">
          <li
            v-for="item in group.items"
            :key="item"
            class="flex items-start gap-2.5 text-sm leading-snug text-ink-2"
          >
            <span
              class="mt-[0.45rem] h-1 w-1 shrink-0 bg-ink-3 transition-colors group-hover:bg-accent"
              aria-hidden="true"
            />
            {{ item }}
          </li>
        </ul>
      </article>
    </div>
  </SectionShell>
</template>
