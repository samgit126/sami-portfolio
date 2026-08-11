<script setup lang="ts">
import SectionShell from './SectionShell.vue'
import { vReveal } from '../directives/reveal'
import { about } from '../data/portfolio'
</script>

<template>
  <SectionShell id="about" index="01" eyebrow="About" title="Building interfaces teams can keep">
    <div class="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
      <div v-reveal>
        <p class="font-display text-xl leading-snug tracking-tight text-ink sm:text-2xl">
          {{ about.lead }}
        </p>

        <div class="mt-8 space-y-5 text-base leading-relaxed text-ink-2">
          <p v-for="(paragraph, i) in about.paragraphs" :key="i">{{ paragraph }}</p>
        </div>

        <!-- Unpaid public-sector work, pulled out of the prose -->
        <aside
          v-reveal:1
          class="mt-10 border border-line border-l-2 border-l-accent bg-surface-2/60 p-6 sm:p-7"
        >
          <p class="label text-accent">{{ about.highlight.label }}</p>
          <p class="mt-4 text-base leading-relaxed text-ink-2 sm:text-lg">
            <strong class="font-semibold text-ink">{{ about.highlight.strong }}</strong>
            {{ about.highlight.rest }}
          </p>
        </aside>
      </div>

      <!-- Spec sheet -->
      <aside v-reveal:2 class="panel h-fit p-5 sm:p-6">
        <h3 class="label mb-5 text-ink-3">Spec sheet</h3>
        <dl class="space-y-4">
          <div
            v-for="fact in about.facts"
            :key="fact.key"
            class="grid gap-1 border-b border-line pb-4 last:border-b-0 last:pb-0"
          >
            <dt class="label text-ink-3">{{ fact.key }}</dt>
            <dd class="text-sm leading-snug text-ink">{{ fact.value }}</dd>
          </div>
        </dl>
      </aside>
    </div>
  </SectionShell>
</template>
