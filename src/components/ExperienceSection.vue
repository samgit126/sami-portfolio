<script setup lang="ts">
import SectionShell from './SectionShell.vue'
import { vReveal } from '../directives/reveal'
import { vSpotlight } from '../directives/spotlight'
import { experience } from '../data/portfolio'
</script>

<template>
  <SectionShell id="experience" index="03" eyebrow="Experience" title="Where I've been building">
    <div class="relative">
      <!-- Timeline rail, fading out at the tail -->
      <span
        class="absolute left-[7px] top-3 hidden h-[calc(100%-2rem)] w-px sm:block"
        style="background: linear-gradient(180deg, var(--brand), var(--brand-3), transparent)"
        aria-hidden="true"
      />

      <article
        v-for="(role, i) in experience"
        :key="`${role.company}-${role.title}`"
        v-reveal:[i]
        class="group relative pb-14 last:pb-0 sm:pl-14"
      >
        <!-- Filled marker for the current role, hollow for past ones -->
        <span
          class="absolute left-0 top-2.5 hidden h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-bg sm:flex"
          :class="role.current ? 'bg-accent' : 'bg-line-strong'"
          aria-hidden="true"
        >
          <span
            v-if="role.current"
            class="animate-pulse-ring absolute h-full w-full rounded-full bg-accent"
          />
        </span>

        <div v-spotlight class="card spotlight card-hover p-6 sm:p-8">
          <div class="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
            <div>
              <h3
                class="font-display text-xl font-semibold leading-tight tracking-tight text-ink sm:text-2xl"
              >
                {{ role.title }}
              </h3>
              <p class="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span class="text-base font-medium text-accent">{{ role.company }}</span>
                <span class="h-1 w-1 rounded-full bg-ink-3" aria-hidden="true" />
                <span class="text-sm text-ink-3">{{ role.location }}</span>
              </p>
            </div>

            <span
              class="label shrink-0 rounded-full px-3 py-2"
              :class="role.current ? 'chip-accent border' : 'border border-line text-ink-2'"
            >
              {{ role.period }}
            </span>
          </div>

          <p class="mt-5 max-w-3xl text-base leading-relaxed text-ink-2">{{ role.summary }}</p>

          <ul class="mt-6 grid gap-3 sm:grid-cols-2">
            <li
              v-for="highlight in role.highlights"
              :key="highlight"
              class="flex items-start gap-3 rounded-2xl border border-line bg-surface-2/60 p-4 text-sm leading-relaxed text-ink-2 transition-colors hover:border-accent/40 sm:[&:last-child:nth-child(odd)]:col-span-2"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="mt-0.5 h-4 w-4 shrink-0 text-accent"
                aria-hidden="true"
              >
                <path d="M4 12.5 9.5 18 20 6.5" />
              </svg>
              {{ highlight }}
            </li>
          </ul>

          <ul class="mt-6 flex flex-wrap gap-1.5">
            <li v-for="tech in role.stack" :key="tech" class="chip">{{ tech }}</li>
          </ul>
        </div>
      </article>
    </div>
  </SectionShell>
</template>
