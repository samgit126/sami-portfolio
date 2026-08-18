<script setup lang="ts">
import SectionShell from './SectionShell.vue'
import { vReveal } from '../directives/reveal'
import { vSpotlight } from '../directives/spotlight'
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
    <div class="grid items-start gap-4 sm:grid-cols-2">
      <article
        v-for="(group, i) in skillGroups"
        :key="group.id"
        v-reveal:[i]
        v-spotlight
        class="card card-hover spotlight ring-gradient group flex flex-col p-6"
      >
        <div class="flex items-start justify-between gap-3">
          <h3 class="font-display text-lg font-semibold tracking-tight text-ink">
            {{ group.title }}
          </h3>
          <span
            class="label rounded-full border border-line px-2 py-1.5 text-ink-3 transition-colors group-hover:border-accent group-hover:text-accent"
          >
            {{ String(i + 1).padStart(2, '0') }}
          </span>
        </div>

        <!-- Fixed height keeps the rules below aligned across all four cards -->
        <p class="label mt-2.5 min-h-4 text-ink-3">{{ group.note }}</p>

        <!-- Hairline that fills with the brand gradient on hover -->
        <span class="relative mt-5 block h-px w-full bg-line" aria-hidden="true">
          <span
            class="absolute inset-0 origin-left scale-x-0 transition-transform duration-700 ease-out group-hover:scale-x-100"
            style="background-image: linear-gradient(90deg, var(--brand), var(--brand-3))"
          />
        </span>

        <ul class="mt-5 flex flex-wrap gap-1.5">
          <li v-for="item in group.items" :key="item" class="chip py-1.5 text-[0.75rem]">
            {{ item }}
          </li>
        </ul>
      </article>
    </div>
  </SectionShell>
</template>
