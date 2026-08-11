<script setup lang="ts">
import SectionShell from './SectionShell.vue'
import { vReveal } from '../directives/reveal'
import { teaching } from '../data/portfolio'
</script>

<template>
  <SectionShell
    id="teaching"
    index="07"
    eyebrow="Teaching"
    title="Academic appointments"
    intro="Alongside building software I teach it. I still lecture undergraduate software engineering at Wollo University's Kombolcha Institute of Technology."
  >
    <div class="grid gap-5 lg:grid-cols-2">
      <article
        v-for="(role, i) in teaching"
        :key="`${role.title}-${role.period}`"
        v-reveal:[i]
        class="panel flex flex-col p-6 sm:p-7"
      >
        <div class="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <h3 class="font-display text-xl font-medium tracking-tight text-ink">
            {{ role.title }}
          </h3>
          <span
            class="label border px-2.5 py-1.5"
            :class="role.current ? 'border-accent/50 bg-accent-soft text-accent' : 'border-line text-ink-2'"
          >
            {{ role.period }}
          </span>
        </div>

        <p class="mt-3 text-base text-accent">{{ role.institution }}</p>
        <p class="label mt-2 text-ink-3">{{ role.department }}</p>

        <p class="mt-5 border-t border-line pt-5 text-sm leading-relaxed text-ink-2">
          {{ role.summary }}
        </p>

        <div v-if="role.courses.length" class="mt-5">
          <p class="label mb-3 text-ink-3">Courses taught</p>
          <ul class="flex flex-wrap gap-1.5">
            <li
              v-for="course in role.courses"
              :key="course"
              class="label border border-line px-2 py-1 text-ink-3"
            >
              {{ course }}
            </li>
          </ul>
        </div>
      </article>
    </div>
  </SectionShell>
</template>
