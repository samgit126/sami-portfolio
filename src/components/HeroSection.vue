<script setup lang="ts">
import ArchitectureDiagram from './ArchitectureDiagram.vue'
import { vReveal } from '../directives/reveal'
import { profile, stats } from '../data/portfolio'
import { asset } from '../utils/asset'
</script>

<template>
  <section id="top" class="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
    <!-- Blueprint field, fading out toward the fold -->
    <div
      aria-hidden="true"
      class="blueprint pointer-events-none absolute inset-x-0 top-0 h-[130%]"
      style="
        mask-image: linear-gradient(to bottom, black 0%, black 45%, transparent 92%);
        -webkit-mask-image: linear-gradient(to bottom, black 0%, black 45%, transparent 92%);
      "
    />

    <div class="relative mx-auto grid max-w-6xl gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
      <!-- Copy -->
      <div>
        <div v-reveal class="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span class="flex items-center gap-2 border border-line bg-surface/70 px-2.5 py-1.5">
            <span class="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span class="absolute inline-flex h-full w-full animate-ping bg-accent opacity-70" />
              <span class="relative inline-flex h-1.5 w-1.5 bg-accent" />
            </span>
            <span class="label text-ink-2">{{ profile.availability }}</span>
          </span>
          <span class="label text-ink-3">{{ profile.location }}</span>
        </div>

        <!-- Portrait + one-line identification, framed like an ID plate -->
        <div v-reveal:1 class="mt-7 flex items-center gap-4">
          <div class="relative shrink-0">
            <img
              :src="asset(profile.photo)"
              :alt="profile.photoAlt"
              width="128"
              height="128"
              fetchpriority="high"
              decoding="async"
              class="h-26 w-26 border border-line-strong object-cover grayscale-[0.15] sm:h-32 sm:w-32"
            />
            <span
              aria-hidden="true"
              class="absolute -bottom-1 -right-1 h-3 w-3 border-b border-r border-accent"
            />
          </div>

          <div class="min-w-0 border-l border-line pl-4">
            <p v-for="line in profile.card" :key="line" class="text-sm leading-snug text-ink-2">
              {{ line }}
            </p>
          </div>
        </div>

        <h1
          v-reveal:2
          class="mt-7 font-display text-[clamp(2.5rem,7.2vw,4.25rem)] font-medium leading-[0.98] tracking-[-0.03em] text-ink"
        >
          Samuel<br />Temesgen Yimer
        </h1>

        <p v-reveal:3 class="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span class="label text-accent">{{ profile.role }}</span>
          <span class="label text-ink-3" aria-hidden="true">//</span>
          <span class="label text-accent">{{ profile.secondaryRole }}</span>
          <span class="animate-caret text-accent" aria-hidden="true">▌</span>
        </p>

        <p v-reveal:4 class="mt-7 max-w-xl text-lg leading-relaxed text-ink-2">
          {{ profile.pitch }}
        </p>

        <div v-reveal:5 class="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#projects"
            class="group inline-flex items-center gap-2.5 bg-ink px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-bg transition-opacity hover:opacity-90"
          >
            View projects
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              <path d="M5 12h13M12 5l7 7-7 7" />
            </svg>
          </a>

          <a
            href="#contact"
            class="inline-flex items-center gap-2.5 border border-line-strong px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-ink transition-colors hover:border-accent hover:text-accent"
          >
            Get in touch
          </a>

          <a
            :href="asset(profile.cv)"
            download
            class="group inline-flex items-center gap-2.5 px-2 py-3 font-mono text-xs uppercase tracking-[0.16em] text-ink-3 transition-colors hover:text-accent"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5"
              aria-hidden="true"
            >
              <path d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14" />
            </svg>
            Download CV
          </a>
        </div>

        <!-- Stat strip -->
        <dl
          v-reveal:6
          class="mt-12 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4"
        >
          <div v-for="stat in stats" :key="stat.label" class="bg-bg p-4">
            <dt class="sr-only">{{ stat.label }}</dt>
            <dd>
              <span class="block font-display text-2xl font-medium tracking-tight text-ink">
                {{ stat.value }}
              </span>
              <span class="mt-1.5 block text-xs leading-snug text-ink-3">{{ stat.label }}</span>
            </dd>
          </div>
        </dl>
      </div>

      <!-- Signature diagram -->
      <div v-reveal:2 class="mx-auto w-full max-w-md lg:max-w-none">
        <ArchitectureDiagram />
      </div>
    </div>
  </section>
</template>
