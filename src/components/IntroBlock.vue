<script setup lang="ts">
import ArchitectureDiagram from './ArchitectureDiagram.vue'
import StatCounter from './StatCounter.vue'
import { vMagnetic } from '../directives/magnetic'
import { profile, stats } from '../data/portfolio'

/**
 * Opens the scrolling column. The identity (photo, name, role) lives in the
 * rail, so this carries the argument instead of repeating the introduction.
 */
</script>

<template>
  <section id="top" class="scroll-mt-24 pb-20">
    <p class="animate-rise label text-accent" style="--i: 0">Currently</p>

    <h2
      class="animate-rise mt-4 font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-ink text-balance"
      style="--i: 1"
    >
      Leading front-end architecture on
      <span class="gradient-text">Haleta ERP</span>
    </h2>

    <p class="animate-rise mt-5 max-w-2xl text-base leading-relaxed text-ink-2" style="--i: 2">
      {{ profile.pitch }}
    </p>

    <div class="animate-rise mt-7 flex flex-wrap items-center gap-3 print:hidden" style="--i: 3">
      <a v-magnetic="10" href="#projects" class="btn btn-primary group">
        View projects
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        >
          <path d="M5 12h13M12 5l7 7-7 7" />
        </svg>
      </a>

      <a v-magnetic="6" href="#contact" class="btn btn-outline">Get in touch</a>
    </div>

    <!-- Figures count up the first time they reach the viewport -->
    <dl
      class="animate-rise card mt-10 grid grid-cols-2 divide-line p-2 sm:grid-cols-4 sm:divide-x"
      style="--i: 4"
    >
      <StatCounter
        v-for="stat in stats"
        :key="stat.label"
        :value="stat.value"
        :label="stat.label"
        size="md"
        class="p-4"
      />
    </dl>

    <div class="animate-rise mt-8 max-w-2xl print:mt-4 print:max-w-sm" style="--i: 5">
      <ArchitectureDiagram />
    </div>
  </section>
</template>
