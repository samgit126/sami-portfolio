<script setup lang="ts">
import { ref } from 'vue'
import SectionShell from './SectionShell.vue'
import { vReveal } from '../directives/reveal'
import { vSpotlight } from '../directives/spotlight'
import { vMagnetic } from '../directives/magnetic'
import { contactChannels, profile } from '../data/portfolio'
import { asset } from '../utils/asset'

const copiedId = ref<string | null>(null)
let resetTimer: ReturnType<typeof setTimeout> | undefined

async function copy(id: string, value: string) {
  try {
    await navigator.clipboard.writeText(value)
    copiedId.value = id
    clearTimeout(resetTimer)
    resetTimer = setTimeout(() => (copiedId.value = null), 1800)
  } catch {
    // Clipboard blocked — the value is still visible and the link still works.
  }
}
</script>

<template>
  <SectionShell
    id="contact"
    index="10"
    eyebrow="Contact"
    title="Let's build something"
    :intro="`${profile.availability}. The fastest way to reach me is email, and I read everything.`"
  >
    <div class="grid gap-5 sm:grid-cols-2">
      <div
        v-for="(channel, i) in contactChannels"
        :key="channel.id"
        v-reveal:[i]
        v-spotlight
        class="card spotlight card-hover group relative flex items-center justify-between gap-4 p-6"
      >
        <div class="min-w-0">
          <p class="label text-ink-3">{{ channel.label }}</p>
          <a
            :href="channel.href"
            :target="channel.external ? '_blank' : undefined"
            :rel="channel.external ? 'noopener noreferrer' : undefined"
            class="mt-3 block truncate font-display text-base font-semibold tracking-tight text-ink transition-colors hover:text-accent sm:text-lg"
          >
            {{ channel.value }}
          </a>
        </div>

        <button
          v-if="channel.copyable"
          type="button"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-ink-3 transition-all duration-300 hover:border-accent hover:bg-accent-soft hover:text-accent"
          :aria-label="`Copy ${channel.label.toLowerCase()} to clipboard`"
          @click="copy(channel.id, channel.value)"
        >
          <svg
            v-if="copiedId === channel.id"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4 text-accent"
            aria-hidden="true"
          >
            <path d="M4 12.5 9.5 18 20 6.5" />
          </svg>
          <svg
            v-else
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4"
            aria-hidden="true"
          >
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
          </svg>
        </button>

        <svg
          v-else
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4 shrink-0 text-ink-3 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
          aria-hidden="true"
        >
          <path d="M7 17 17 7M8 7h9v9" />
        </svg>
      </div>
    </div>

    <p aria-live="polite" class="sr-only">
      {{ copiedId ? 'Copied to clipboard' : '' }}
    </p>

    <!-- Closing call to action, on a gradient plate -->
    <div v-reveal:2 class="card relative mt-8 overflow-hidden p-8 sm:p-10">
      <span
        aria-hidden="true"
        class="absolute inset-0 opacity-[0.07]"
        style="background-image: linear-gradient(120deg, var(--brand), var(--brand-2), var(--brand-3))"
      />
      <span
        aria-hidden="true"
        class="orb animate-float-slow -right-24 -top-24 h-72 w-72"
        style="background: radial-gradient(circle, var(--brand-3) 0%, transparent 70%); opacity: 0.28"
      />

      <div
        class="relative flex flex-col items-start justify-between gap-7 sm:flex-row sm:items-center"
      >
        <div>
          <p class="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            Have a front-end that needs an owner?
          </p>
          <p class="mt-3 max-w-lg text-sm leading-relaxed text-ink-2">
            Architecture reviews, Vue 3 migrations, design-system work, or leading a front-end team.
            Happy to talk through any of it.
          </p>
        </div>

        <div class="flex shrink-0 flex-wrap items-center gap-3">
          <a
            v-magnetic="10"
            :href="`mailto:${contactChannels[0].value}`"
            class="btn btn-primary group"
          >
            Email me
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

          <a :href="asset(profile.cv)" download class="btn btn-outline group">
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
        </div>
      </div>
    </div>
  </SectionShell>
</template>
