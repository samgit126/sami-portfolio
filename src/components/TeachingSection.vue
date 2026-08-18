<script setup lang="ts">
import SectionShell from './SectionShell.vue'
import { vReveal } from '../directives/reveal'
import { vSpotlight } from '../directives/spotlight'
import { teaching } from '../data/portfolio'
</script>

<template>
  <SectionShell
    id="teaching"
    index="08"
    eyebrow="Teaching"
    title="Academic appointments"
    intro="Alongside building software I teach it. I still lecture undergraduate software engineering at Wollo University's Kombolcha Institute of Technology."
  >
    <div class="grid gap-5 xl:grid-cols-2">
      <article
        v-for="(role, i) in teaching"
        :key="`${role.title}-${role.period}`"
        v-reveal:[i]
        v-spotlight
        class="card spotlight card-hover flex flex-col p-6 sm:p-8"
      >
        <div class="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
          <h3 class="font-display text-xl font-semibold tracking-tight text-ink">
            {{ role.title }}
          </h3>
          <span class="chip" :class="role.current ? 'chip-accent' : ''">{{ role.period }}</span>
        </div>

        <p class="mt-3 text-base font-medium text-accent">{{ role.institution }}</p>
        <p class="mt-2 text-sm text-ink-3">{{ role.department }}</p>

        <p class="mt-5 border-t border-line pt-5 text-sm leading-relaxed text-ink-2">
          {{ role.summary }}
        </p>

        <div v-if="role.courses.length" class="mt-5">
          <p class="label mb-3 text-ink-3">Courses taught</p>
          <ul class="flex flex-wrap gap-1.5">
            <li v-for="course in role.courses" :key="course" class="chip">{{ course }}</li>
          </ul>
        </div>
      </article>
    </div>
  </SectionShell>
</template>
