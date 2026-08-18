<script setup lang="ts">
import SectionShell from './SectionShell.vue'
import { vReveal } from '../directives/reveal'
import { vSpotlight } from '../directives/spotlight'
import { about } from '../data/portfolio'
</script>

<template>
  <SectionShell id="about" index="01" eyebrow="About" title="Building interfaces teams can keep">
    <div class="grid gap-10 xl:grid-cols-[1.3fr_0.7fr] xl:gap-12">
      <div v-reveal.left>
        <p class="font-display text-xl font-medium leading-snug tracking-tight text-ink sm:text-2xl">
          {{ about.lead }}
        </p>

        <div class="mt-8 space-y-5 text-base leading-relaxed text-ink-2">
          <p v-for="(paragraph, i) in about.paragraphs" :key="i">{{ paragraph }}</p>
        </div>

        <!-- Unpaid public-sector work, pulled out of the prose -->
        <aside
          v-reveal:1
          v-spotlight
          class="card spotlight mt-10 overflow-hidden p-6 sm:p-8"
        >
          <span
            aria-hidden="true"
            class="absolute inset-y-0 left-0 w-1"
            style="background-image: linear-gradient(180deg, var(--brand), var(--brand-3))"
          />
          <p class="label text-accent">{{ about.highlight.label }}</p>
          <p class="mt-4 text-base leading-relaxed text-ink-2 sm:text-lg">
            <strong class="font-semibold text-ink">{{ about.highlight.strong }}</strong>
            {{ about.highlight.rest }}
          </p>
        </aside>
      </div>

      <!-- Spec sheet -->
      <aside v-reveal.right v-spotlight class="card spotlight h-fit p-6 sm:p-7">
        <h3 class="label mb-6 text-ink-3">Spec sheet</h3>
        <dl class="space-y-4">
          <div
            v-for="fact in about.facts"
            :key="fact.key"
            class="grid gap-1.5 border-b border-line pb-4 last:border-b-0 last:pb-0"
          >
            <dt class="label text-ink-3">{{ fact.key }}</dt>
            <dd class="text-sm leading-snug text-ink">{{ fact.value }}</dd>
          </div>
        </dl>
      </aside>
    </div>
  </SectionShell>
</template>
