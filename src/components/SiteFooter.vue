<script setup lang="ts">
import { contactChannels, profile } from '../data/portfolio'
import { asset } from '../utils/asset'

const year = new Date().getFullYear()
const links = contactChannels.filter((channel) => channel.external)
</script>

<template>
  <footer class="relative px-5 pb-12 pt-10 sm:px-8 lg:px-0">
    <div
      aria-hidden="true"
      class="absolute inset-x-5 top-0 h-px sm:inset-x-8 lg:inset-x-0"
      style="background: linear-gradient(90deg, var(--line-strong), transparent 85%)"
    />

    <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="font-display text-sm font-semibold tracking-tight text-ink">
          {{ profile.name }}
        </p>
        <p class="mt-1.5 text-xs text-ink-3">{{ profile.role }} · {{ profile.location }}</p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <a
          v-for="link in links"
          :key="link.id"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="chip"
        >
          {{ link.label }}
        </a>
        <a :href="asset(profile.cv)" download class="chip">CV ↓</a>
        <a href="#top" class="chip">Top ↑</a>
      </div>
    </div>

    <p class="mt-8 text-xs text-ink-3">
      © {{ year }} · Built with Vue 3, TypeScript &amp; Tailwind CSS
    </p>
  </footer>
</template>
