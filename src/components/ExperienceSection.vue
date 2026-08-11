<script setup lang="ts">
import SectionShell from './SectionShell.vue'
import { vReveal } from '../directives/reveal'
import { experience } from '../data/portfolio'
</script>

<template>
  <SectionShell
    id="experience"
    index="03"
    eyebrow="Experience"
    title="Where I've been building"
  >
    <div class="relative">
      <!-- Timeline rail -->
      <span
        class="absolute left-0 top-2 hidden h-[calc(100%-1rem)] w-px bg-line sm:block"
        aria-hidden="true"
      />

      <article
        v-for="(role, i) in experience"
        :key="`${role.company}-${role.title}`"
        v-reveal:[i]
        class="relative pb-16 last:pb-0 sm:pl-10"
      >
        <!-- Filled marker for the current role, hollow for past ones -->
        <span
          class="absolute left-[-3.5px] top-2 hidden h-2 w-2 rotate-45 border border-accent sm:block"
          :class="role.current ? 'bg-accent' : 'bg-bg'"
          aria-hidden="true"
        />

        <div class="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
          <div>
            <h3
              class="font-display text-xl font-medium leading-tight tracking-tight text-ink sm:text-2xl"
            >
              {{ role.title }}
            </h3>
            <p class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span class="text-base text-accent">{{ role.company }}</span>
              <span class="label text-ink-3" aria-hidden="true">·</span>
              <span class="label text-ink-3">{{ role.location }}</span>
            </p>
          </div>

          <span
            class="label shrink-0 border border-line bg-surface px-3 py-2 text-ink-2"
          >
            {{ role.period }}
          </span>
        </div>

        <p class="mt-6 max-w-3xl text-base leading-relaxed text-ink-2">{{ role.summary }}</p>

        <ul class="mt-7 grid gap-px border border-line bg-line sm:grid-cols-2">
          <li
            v-for="highlight in role.highlights"
            :key="highlight"
            class="flex items-start gap-3 bg-bg p-4 text-sm leading-relaxed text-ink-2 sm:[&:last-child:nth-child(odd)]:col-span-2"
          >
            <span class="label mt-0.5 shrink-0 text-accent" aria-hidden="true">→</span>
            {{ highlight }}
          </li>
        </ul>

        <ul class="mt-6 flex flex-wrap gap-2">
          <li
            v-for="tech in role.stack"
            :key="tech"
            class="label border border-line px-2.5 py-1.5 text-ink-3"
          >
            {{ tech }}
          </li>
        </ul>
      </article>
    </div>
  </SectionShell>
</template>
