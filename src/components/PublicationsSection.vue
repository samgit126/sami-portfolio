<script setup lang="ts">
import SectionShell from './SectionShell.vue'
import { vReveal } from '../directives/reveal'
import { publications } from '../data/portfolio'
</script>

<template>
  <SectionShell
    id="publications"
    index="06"
    eyebrow="Research"
    title="Peer-reviewed publications"
    intro="Three papers from my MSc research on applying machine learning to software size, effort and maintenance estimation."
  >
    <ol class="space-y-px border border-line bg-line">
      <li
        v-for="(paper, i) in publications"
        :key="paper.title"
        v-reveal:[i]
        class="group bg-bg p-6 transition-colors hover:bg-surface-2 sm:p-8"
      >
        <div class="grid gap-6 sm:grid-cols-[7rem_1fr] sm:gap-8">
          <div class="flex items-start gap-3 sm:flex-col sm:gap-2">
            <span class="font-display text-2xl font-medium tracking-tight text-accent">
              {{ paper.year }}
            </span>
            <span class="label border border-line px-2 py-1 text-ink-3">{{ paper.type }}</span>
          </div>

          <div>
            <h3 class="font-display text-lg font-medium leading-snug tracking-tight text-ink">
              {{ paper.title }}
            </h3>
            <p class="label mt-3 text-ink-3">
              {{ paper.venue }}
            </p>
            <p class="mt-4 max-w-2xl text-sm leading-relaxed text-ink-2">{{ paper.abstract }}</p>
          </div>
        </div>
      </li>
    </ol>
  </SectionShell>
</template>
