<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue'
import NavIcon from './NavIcon.vue'
import { contactChannels, navItems, profile } from '../data/portfolio'
import { useScrollSpy } from '../composables/useScrollSpy'
import { useScrollProgress } from '../composables/useScrollProgress'
import { asset } from '../utils/asset'

/**
 * The fixed half of the split layout. On desktop it pins to the viewport and
 * never scrolls: identity above, section nav in the middle, links below. On
 * small screens it collapses to a normal block at the top of the page and the
 * nav moves into MobileTopBar, where a full-height rail has nowhere to live.
 */

const { activeId } = useScrollSpy(navItems.map((item) => item.id))
const { progress } = useScrollProgress()

const socials = contactChannels.filter((channel) => channel.external)
</script>

<template>
  <aside
    class="print-rail relative z-20 px-5 pt-24 pb-10 sm:px-8 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:overflow-y-auto lg:pb-6 lg:pl-0 lg:pr-10 lg:pt-10"
  >
    <!-- Reading progress, drawn on the rail's own edge instead of a top bar -->
    <div
      aria-hidden="true"
      class="absolute inset-y-6 right-0 hidden w-px bg-line lg:block print:hidden"
    >
      <div
        class="w-px origin-top"
        :style="{
          height: '100%',
          transform: `scaleY(${progress})`,
          backgroundImage: 'linear-gradient(180deg, var(--brand), var(--brand-2), var(--brand-3))',
        }"
      />
    </div>

    <!-- Identity -->
    <div class="flex items-center gap-5 lg:block">
      <div class="relative w-fit shrink-0">
        <span
          aria-hidden="true"
          class="absolute -inset-0.5 rounded-2xl opacity-40 blur-md"
          style="background-image: linear-gradient(135deg, var(--brand), var(--brand-3))"
        />
        <img
          :src="asset(profile.photo)"
          :alt="profile.photoAlt"
          width="128"
          height="128"
          fetchpriority="high"
          decoding="async"
          class="relative h-20 w-20 rounded-2xl border border-line object-cover sm:h-24 sm:w-24 lg:h-16 lg:w-16"
        />
      </div>

      <div class="min-w-0 lg:mt-5">
        <h1
          class="gradient-text font-display text-xl font-semibold leading-tight tracking-[-0.03em] xl:text-2xl"
        >
          {{ profile.name }}
        </h1>

        <p class="mt-2 text-sm text-ink-2 lg:mt-2.5">
          {{ profile.role }}
          <span class="text-ink-3" aria-hidden="true">·</span>
          Team Lead
        </p>
      </div>
    </div>

    <div class="mt-6 flex flex-wrap items-center gap-2 lg:mt-4">
      <span class="chip chip-accent">
        <span class="relative flex h-1.5 w-1.5" aria-hidden="true">
          <span class="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-accent" />
          <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
        </span>
        Available
      </span>
      <span class="chip">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-3.5 w-3.5"
          aria-hidden="true"
        >
          <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
        {{ profile.location }}
      </span>
    </div>

    <!-- Section nav. Desktop only: on mobile it lives in the top bar. -->
    <nav aria-label="Sections" class="mt-4 hidden shrink-0 lg:block print:hidden">
      <ul class="space-y-px">
        <li v-for="item in navItems" :key="item.id">
          <a
            :href="`#${item.id}`"
            class="group relative flex items-center gap-2.5 rounded-xl px-2 py-1 text-sm transition-colors duration-300"
            :class="
              activeId === item.id
                ? 'bg-surface-2 font-medium text-ink'
                : 'text-ink-3 hover:bg-surface-2/60 hover:text-ink-2'
            "
            :aria-current="activeId === item.id ? 'true' : undefined"
          >
            <span
              class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300"
              :class="
                activeId === item.id
                  ? 'border-transparent text-on-brand'
                  : 'border-line text-ink-3 group-hover:border-line-strong group-hover:text-ink-2'
              "
              :style="
                activeId === item.id
                  ? 'background-image: linear-gradient(135deg, var(--brand), var(--brand-3))'
                  : ''
              "
            >
              <NavIcon :id="item.id" />
            </span>
            {{ item.label }}
          </a>
        </li>
      </ul>
    </nav>

    <!-- Links & controls -->
    <div class="mt-9 shrink-0 lg:mt-auto lg:pt-8">
      <div class="flex flex-wrap items-center gap-2">
        <a
          v-for="social in socials"
          :key="social.id"
          :href="social.href"
          target="_blank"
          rel="noopener noreferrer"
          class="chip"
        >
          {{ social.label }}
        </a>
      </div>

      <div class="mt-3 flex items-center gap-2 print:hidden">
        <a :href="asset(profile.cv)" download class="btn btn-primary group flex-1 lg:flex-none">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
            aria-hidden="true"
          >
            <path d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14" />
          </svg>
          Download CV
        </a>
        <!-- On mobile the toggle lives in MobileTopBar instead -->
        <span class="hidden lg:inline-flex print:hidden">
          <ThemeToggle />
        </span>
      </div>
    </div>
  </aside>
</template>
