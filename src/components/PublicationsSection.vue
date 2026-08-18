<script setup lang="ts">
import SectionShell from './SectionShell.vue'
import { vReveal } from '../directives/reveal'
import { vSpotlight } from '../directives/spotlight'
import { publications } from '../data/portfolio'
</script>

<template>
  <SectionShell
    id="publications"
    index="07"
    eyebrow="Research"
    title="Peer-reviewed publications"
    intro="Three papers from my MSc research on applying machine learning to software size, effort and maintenance estimation."
  >
    <ol class="grid gap-5">
      <li
        v-for="(paper, i) in publications"
        :key="paper.title"
        v-reveal:[i]
        v-spotlight
        class="card spotlight card-hover p-6 sm:p-8"
      >
        <div class="grid gap-6 sm:grid-cols-[7rem_1fr] sm:gap-8">
          <div class="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-3">
            <span class="gradient-text font-display text-3xl font-semibold tracking-tight">
              {{ paper.year }}
            </span>
            <span class="chip">{{ paper.type }}</span>
          </div>

          <div>
            <h3 class="font-display text-lg font-semibold leading-snug tracking-tight text-ink">
              {{ paper.title }}
            </h3>
            <p class="mt-3 text-sm text-ink-3">{{ paper.venue }}</p>
            <p class="mt-4 max-w-2xl text-sm leading-relaxed text-ink-2">{{ paper.abstract }}</p>
          </div>
        </div>
      </li>
    </ol>
  </SectionShell>
</template>
