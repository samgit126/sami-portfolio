<script setup lang="ts">
import SectionShell from './SectionShell.vue'
import { vReveal } from '../directives/reveal'
import { credentials, education } from '../data/portfolio'
</script>

<template>
  <SectionShell
    id="education"
    index="08"
    eyebrow="Education"
    title="Degrees, certifications & awards"
  >
    <div class="grid gap-12 lg:grid-cols-2 lg:gap-16">
      <!-- Degrees -->
      <div v-reveal>
        <h3 class="label mb-6 text-ink-3">Academic</h3>

        <div class="space-y-px border border-line bg-line">
          <article v-for="item in education" :key="item.degree" class="bg-bg p-6">
            <div class="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
              <h4 class="font-display text-lg font-medium tracking-tight text-ink">
                {{ item.degree }}
              </h4>
              <span class="label border border-accent/40 px-2 py-1 text-accent">
                {{ item.grade }}
              </span>
            </div>

            <p class="mt-3 text-sm text-ink-2">{{ item.school }}</p>
            <p class="label mt-2 text-ink-3">{{ item.period }}</p>
            <div class="mt-4 space-y-3 border-t border-line pt-4">
              <p v-if="item.thesis" class="text-sm leading-relaxed text-ink">
                <span class="label mr-2 text-ink-3">Thesis</span>{{ item.thesis }}
              </p>
              <p class="text-sm leading-relaxed text-ink-2">{{ item.note }}</p>
            </div>
          </article>
        </div>
      </div>

      <!-- Certifications & recognition -->
      <div v-reveal:1>
        <h3 class="label mb-6 text-ink-3">Certifications & recognition</h3>

        <ul class="space-y-px border border-line bg-line">
          <li
            v-for="(item, i) in credentials"
            :key="`${item.title}-${i}`"
            class="group flex items-start gap-4 bg-bg p-5 transition-colors hover:bg-surface-2"
          >
            <span
              class="mt-1 h-2 w-2 shrink-0 rotate-45 border border-line-strong transition-colors group-hover:border-accent"
              aria-hidden="true"
            />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium leading-snug text-ink">{{ item.title }}</p>
              <p class="mt-1.5 text-sm leading-snug text-ink-2">{{ item.issuer }}</p>
            </div>
            <span class="label shrink-0 text-ink-3">{{ item.meta }}</span>
          </li>
        </ul>
      </div>
    </div>
  </SectionShell>
</template>
