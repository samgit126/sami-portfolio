<script setup lang="ts">
import SectionShell from './SectionShell.vue'
import { vReveal } from '../directives/reveal'
import { vSpotlight } from '../directives/spotlight'
import { credentials, education } from '../data/portfolio'
</script>

<template>
  <SectionShell
    id="education"
    index="09"
    eyebrow="Education"
    title="Degrees, certifications & awards"
  >
    <div class="grid gap-10 xl:grid-cols-2 xl:gap-8">
      <!-- Degrees -->
      <div v-reveal.left>
        <h3 class="label mb-6 text-ink-3">Academic</h3>

        <div class="grid gap-5">
          <article
            v-for="item in education"
            :key="item.degree"
            v-spotlight
            class="card spotlight card-hover p-6"
          >
            <div class="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
              <h4 class="font-display text-lg font-semibold tracking-tight text-ink">
                {{ item.degree }}
              </h4>
              <span class="chip chip-accent">{{ item.grade }}</span>
            </div>

            <p class="mt-3 text-sm text-ink-2">{{ item.school }}</p>
            <p class="mt-2 text-sm text-ink-3">{{ item.period }}</p>
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
      <div v-reveal.right>
        <h3 class="label mb-6 text-ink-3">Certifications &amp; recognition</h3>

        <ul class="card divide-y divide-line overflow-hidden">
          <li
            v-for="(item, i) in credentials"
            :key="`${item.title}-${i}`"
            class="group flex items-start gap-4 p-5 transition-colors hover:bg-surface-2"
          >
            <span
              class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-ink-3 transition-colors group-hover:border-accent group-hover:bg-accent-soft group-hover:text-accent"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-4 w-4"
              >
                <circle cx="12" cy="9" r="5.5" />
                <path d="M8.5 13.5 7 21l5-2.5L17 21l-1.5-7.5" />
              </svg>
            </span>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium leading-snug text-ink">{{ item.title }}</p>
              <p class="mt-1.5 text-sm leading-snug text-ink-2">{{ item.issuer }}</p>
            </div>
            <span class="label shrink-0 pt-1 text-ink-3">{{ item.meta }}</span>
          </li>
        </ul>
      </div>
    </div>
  </SectionShell>
</template>
