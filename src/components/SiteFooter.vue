<script setup lang="ts">
import { contactChannels, profile } from '../data/portfolio'
import { asset } from '../utils/asset'

const year = new Date().getFullYear()
const links = contactChannels.filter((channel) => channel.external)
</script>

<template>
  <footer class="border-t border-line py-10">
    <div
      class="mx-auto flex max-w-6xl flex-col gap-6 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8"
    >
      <div>
        <p class="font-display text-sm font-medium tracking-tight text-ink">
          {{ profile.name }}
        </p>
        <p class="label mt-2 text-ink-3">
          {{ profile.role }} · {{ profile.location }}
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
        <a
          v-for="link in links"
          :key="link.id"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="label text-ink-3 transition-colors hover:text-accent"
        >
          {{ link.label }}
        </a>
        <a
          :href="asset(profile.cv)"
          download
          class="label text-ink-3 transition-colors hover:text-accent"
        >
          Download CV ↓
        </a>
        <a href="#top" class="label text-ink-3 transition-colors hover:text-accent">
          Back to top ↑
        </a>
      </div>
    </div>

    <div class="mx-auto mt-8 max-w-6xl px-5 sm:px-8">
      <p class="label border-t border-line pt-6 text-ink-3">
        © {{ year }} · Built with Vue 3, TypeScript &amp; Tailwind CSS
      </p>
    </div>
  </footer>
</template>
