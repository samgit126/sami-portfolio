<script setup lang="ts">
import SectionShell from './SectionShell.vue'
import { vReveal } from '../directives/reveal'
import { vSpotlight } from '../directives/spotlight'
import StatCounter from './StatCounter.vue'
import { contributions } from '../data/portfolio'
import { asset } from '../utils/asset'
</script>

<template>
  <SectionShell
    id="activity"
    index="06"
    eyebrow="Activity"
    title="Where the commits live"
    intro="Public work sits on GitHub. Most of my day-to-day output is on the company GitLab in private repositories, so the contribution graph stands in for code you can't browse."
  >
    <div class="grid gap-5 xl:grid-cols-2">
      <article
        v-for="(source, i) in contributions"
        :key="source.id"
        v-reveal:[i]
        v-spotlight
        class="card spotlight card-hover flex min-w-0 flex-col p-6 sm:p-8"
      >
        <!-- Platform header -->
        <div class="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
          <div>
            <h3 class="font-display text-xl font-semibold tracking-tight text-ink">
              {{ source.platform }}
            </h3>
            <p class="mt-2 text-sm font-medium text-accent">{{ source.handle }}</p>
          </div>

          <span class="chip">{{ source.visibility }}</span>
        </div>

        <!-- Contribution graph, or the slot waiting for one -->
        <figure class="skeleton relative mt-6 overflow-hidden rounded-2xl border border-line">
          <img
            v-if="source.image"
            :src="asset(source.image!)"
            :alt="source.imageAlt"
            width="1280"
            height="320"
            decoding="async"
            class="w-full bg-surface-2 object-cover"
          />

          <!-- Empty state: shows exactly where to drop the screenshot -->
          <div
            v-else
            class="dotfield flex min-h-40 flex-col items-center justify-center gap-3 bg-surface-2/60 px-5 py-10 text-center"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-6 w-6 text-ink-3"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M3 15l4.5-4.5 3 3L15 9l6 6" />
              <circle cx="8.5" cy="8.5" r="1.2" />
            </svg>

            <p class="label text-ink-2">Contribution graph</p>
            <!-- A path is one long unbreakable token — let it wrap, and skip the
                 wide tracking so it stays readable at small sizes. -->
            <p class="max-w-full break-all font-mono text-[11px] leading-relaxed text-ink-3">
              {{ source.hint }}
            </p>
            <p class="max-w-xs text-xs leading-relaxed text-ink-3">
              Export the graph from your profile page and save it here at ~1280px wide.
            </p>
          </div>
        </figure>

        <p class="mt-6 mb-6 text-sm leading-relaxed text-ink-2">{{ source.note }}</p>

        <!-- Figures. Pushed to the bottom so both cards' stat rows align even
             when the notes above them differ in length. -->
        <dl class="mt-auto grid grid-cols-3 gap-3">
          <StatCounter
            v-for="stat in source.stats"
            :key="stat.label"
            :value="stat.value"
            :label="stat.label"
            size="md"
            class="rounded-2xl border border-line bg-surface-2/60 p-4"
          />
        </dl>

        <a
          :href="source.href"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-outline mt-6 self-start"
        >
          Visit profile
          <span aria-hidden="true">↗</span>
        </a>
      </article>
    </div>
  </SectionShell>
</template>
