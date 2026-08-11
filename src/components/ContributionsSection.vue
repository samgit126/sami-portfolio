<script setup lang="ts">
import SectionShell from './SectionShell.vue'
import { vReveal } from '../directives/reveal'
import { contributions } from '../data/portfolio'
</script>

<template>
  <SectionShell
    id="activity"
    index="05"
    eyebrow="Activity"
    title="Where the commits live"
    intro="Public work sits on GitHub. Most of my day-to-day output is on the company GitLab in private repositories, so the contribution graph stands in for code you can't browse."
  >
    <div class="grid gap-5 lg:grid-cols-2">
      <article
        v-for="(source, i) in contributions"
        :key="source.id"
        v-reveal:[i]
        class="panel flex min-w-0 flex-col p-6 sm:p-7"
      >
        <!-- Platform header -->
        <div class="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
          <div>
            <h3 class="font-display text-xl font-medium tracking-tight text-ink">
              {{ source.platform }}
            </h3>
            <p class="label mt-2 text-accent">{{ source.handle }}</p>
          </div>

          <span class="label border border-line px-2.5 py-1.5 text-ink-3">
            {{ source.visibility }}
          </span>
        </div>

        <!-- Contribution graph, or the slot waiting for one -->
        <figure class="relative mt-6">
          <span
            aria-hidden="true"
            class="absolute -left-px -top-px h-2.5 w-2.5 border-l border-t border-accent/70"
          />
          <span
            aria-hidden="true"
            class="absolute -right-px -top-px h-2.5 w-2.5 border-r border-t border-accent/70"
          />
          <span
            aria-hidden="true"
            class="absolute -bottom-px -left-px h-2.5 w-2.5 border-b border-l border-accent/70"
          />
          <span
            aria-hidden="true"
            class="absolute -bottom-px -right-px h-2.5 w-2.5 border-b border-r border-accent/70"
          />

          <img
            v-if="source.image"
            :src="source.image"
            :alt="source.imageAlt"
            width="1280"
            height="320"
            loading="lazy"
            decoding="async"
            class="w-full border border-line bg-surface-2 object-cover"
          />

          <!-- Empty state: shows exactly where to drop the screenshot -->
          <div
            v-else
            class="blueprint flex min-h-40 flex-col items-center justify-center gap-3 border border-dashed border-line-strong bg-surface-2/50 px-5 py-10 text-center"
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

        <!-- Figures. Pushed to the bottom so both panels' stat rows align even
             when the notes above them differ in length. -->
        <dl class="mt-auto grid grid-cols-3 gap-px border border-line bg-line">
          <div v-for="stat in source.stats" :key="stat.label" class="bg-bg p-3.5">
            <dt class="sr-only">{{ stat.label }}</dt>
            <dd>
              <span class="block font-display text-lg font-medium tracking-tight text-ink">
                {{ stat.value }}
              </span>
              <span class="mt-1 block text-xs leading-snug text-ink-3">{{ stat.label }}</span>
            </dd>
          </div>
        </dl>

        <a
          :href="source.href"
          target="_blank"
          rel="noopener noreferrer"
          class="label mt-6 inline-flex items-center gap-2 self-start text-ink-3 transition-colors hover:text-accent"
        >
          Visit profile
          <span aria-hidden="true">↗</span>
        </a>
      </article>
    </div>
  </SectionShell>
</template>
