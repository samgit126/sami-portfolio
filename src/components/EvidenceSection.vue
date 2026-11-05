<script setup lang="ts">
import SectionShell from './SectionShell.vue'
import { vReveal } from '../directives/reveal'
import { vSpotlight } from '../directives/spotlight'
import { domains, evidence } from '../data/portfolio'

/**
 * The short answer to "what have you actually done": three capabilities, the
 * system behind each one, and a link to open. Detail lives in Projects; this
 * is the index into it.
 */
</script>

<template>
  <SectionShell
    id="evidence"
    index="04"
    eyebrow="Track record"
    title="What I build, and where it is running"
    intro="Three things I am asked about most often, each with the system behind it and a link you can open. All of it is in real use, none of it is a demo."
  >
    <ol class="grid gap-5">
      <li
        v-for="(item, i) in evidence"
        :key="item.id"
        v-reveal:[i]
        v-spotlight
        class="card spotlight card-hover ring-gradient group p-6 sm:p-8"
      >
        <div class="grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-10">
          <!-- What is being asked for -->
          <div>
            <div class="flex items-center gap-3">
              <span
                class="flex h-7 items-center rounded-full px-2.5 font-mono text-[11px] font-medium tracking-wider text-on-brand"
                style="background-image: linear-gradient(120deg, var(--brand), var(--brand-2))"
              >
                {{ String(i + 1).padStart(2, '0') }}
              </span>
              <span class="label text-ink-3">Strength</span>
            </div>

            <h3
              class="mt-4 font-display text-lg font-semibold leading-snug tracking-tight text-ink sm:text-xl"
            >
              {{ item.capability }}
            </h3>

            <p class="mt-3 text-sm leading-relaxed text-ink-2">{{ item.requirement }}</p>
          </div>

          <!-- What proves it -->
          <div class="rounded-2xl border border-line bg-surface-2/60 p-5">
            <p class="label text-ink-3">Where to see it</p>

            <p class="mt-3 font-display text-base font-semibold tracking-tight text-ink">
              <a
                v-if="item.href"
                :href="item.href"
                target="_blank"
                rel="noopener noreferrer"
                class="transition-colors hover:text-accent"
              >
                {{ item.project }}
              </a>
              <template v-else>{{ item.project }}</template>
            </p>
            <p class="mt-1.5 text-sm text-accent">{{ item.role }}</p>

            <ul class="mt-4 space-y-2.5">
              <li
                v-for="point in item.proof"
                :key="point"
                class="flex items-start gap-2.5 text-sm leading-relaxed text-ink-2"
              >
                <span
                  class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style="background-image: linear-gradient(135deg, var(--brand), var(--brand-3))"
                  aria-hidden="true"
                />
                {{ point }}
              </li>
            </ul>

            <div
              v-if="item.outcome"
              class="mt-5 flex items-baseline gap-3 rounded-xl border border-line bg-surface px-4 py-3"
            >
              <span class="gradient-text font-display text-2xl font-semibold tracking-tight tabular-nums">
                {{ item.outcome.value }}
              </span>
              <span class="text-sm leading-snug text-ink-2">{{ item.outcome.label }}</span>
            </div>

            <a
              v-if="item.href"
              :href="item.href"
              target="_blank"
              rel="noopener noreferrer"
              class="chip chip-accent mt-5"
            >
              {{ item.hrefLabel }}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </li>
    </ol>

    <!-- Domain systems already built -->
    <div class="mt-14">
      <div v-reveal class="mb-6 flex items-center gap-3">
        <h3 class="label text-ink-2">Built inside universities</h3>
        <span
          class="h-px min-w-6 flex-1"
          style="background: linear-gradient(90deg, var(--line-strong), transparent)"
          aria-hidden="true"
        />
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <article
          v-for="(domain, i) in domains"
          :key="domain.id"
          v-reveal:[i]
          v-spotlight
          class="card spotlight card-hover flex flex-col p-6"
        >
          <div class="flex flex-wrap items-start justify-between gap-3">
            <span class="chip chip-accent">{{ domain.tag }}</span>
            <span class="chip">{{ domain.status }}</span>
          </div>

          <h4 class="mt-4 font-display text-lg font-semibold leading-snug tracking-tight text-ink">
            {{ domain.domain }}
          </h4>

          <p class="mt-2.5 text-sm font-medium text-accent">{{ domain.project }}</p>
          <p class="mt-4 flex-1 text-sm leading-relaxed text-ink-2">{{ domain.summary }}</p>

          <a
            v-if="domain.href"
            :href="domain.href"
            target="_blank"
            rel="noopener noreferrer"
            class="chip mt-5 self-start"
          >
            {{ domain.hrefLabel }}
            <span aria-hidden="true">↗</span>
          </a>
        </article>
      </div>
    </div>
  </SectionShell>
</template>
