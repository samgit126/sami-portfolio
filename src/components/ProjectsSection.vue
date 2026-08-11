<script setup lang="ts">
import { computed } from 'vue'
import SectionShell from './SectionShell.vue'
import { vReveal } from '../directives/reveal'
import ScheduleIllustration from './ScheduleIllustration.vue'
import { projects, repos } from '../data/portfolio'

const featured = computed(() => projects.filter((p) => p.featured))
const lead = computed(() => featured.value[0])
const secondary = computed(() => featured.value.slice(1))
const rest = computed(() => projects.filter((p) => !p.featured))
</script>

<template>
  <SectionShell
    id="projects"
    index="04"
    eyebrow="Projects"
    title="Products shipped and running"
    intro="Enterprise ERP modules, higher-education portals, agile tooling and public-sector websites. Most of them are live and in daily use, with deployment links you can open."
  >
    <!-- Lead project: image and detail side by side -->
    <article
      v-if="lead"
      v-reveal
      class="panel group relative grid lg:grid-cols-[1.1fr_1fr]"
    >
      <div class="relative overflow-hidden border-b border-line lg:border-b-0 lg:border-r">
        <img
          :src="lead.image!"
          :alt="`${lead.name} screenshot`"
          width="1280"
          height="720"
          decoding="async"
          class="h-full w-full object-cover object-top-left transition-transform duration-700 group-hover:scale-[1.02] lg:absolute lg:inset-0"
        />
      </div>

      <div class="flex flex-col justify-center p-7 sm:p-10">
        <div class="flex items-start justify-between gap-4">
          <div class="flex flex-wrap items-center gap-2">
            <span class="label text-ink-3">01</span>
            <span
              class="label px-1.5 py-0.5"
              :class="lead.href ? 'bg-accent-soft text-accent' : 'border border-line text-ink-3'"
            >
              {{ lead.status }}
            </span>
          </div>

          <svg
            v-if="lead.href"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4 shrink-0 text-ink-3 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
            aria-hidden="true"
          >
            <path d="M7 17 17 7M8 7h9v9" />
          </svg>
        </div>

        <h3
          class="mt-4 font-display text-2xl font-medium leading-tight tracking-tight text-ink sm:text-3xl"
        >
          <a
            v-if="lead.href"
            :href="lead.href"
            target="_blank"
            rel="noopener noreferrer"
            class="transition-colors hover:text-accent"
          >
            {{ lead.name }}<span class="absolute inset-0" aria-hidden="true" />
          </a>
          <template v-else>{{ lead.name }}</template>
        </h3>

        <p class="label mt-3 text-accent">{{ lead.role }}</p>

        <p class="mt-5 text-base leading-relaxed text-ink-2">{{ lead.description }}</p>

        <ul class="mt-4 space-y-2">
          <li
            v-for="point in lead.points"
            :key="point"
            class="flex items-start gap-2.5 text-sm leading-relaxed text-ink-2"
          >
            <span class="mt-[0.45rem] h-1 w-1 shrink-0 bg-accent" aria-hidden="true" />
            {{ point }}
          </li>
        </ul>

        <div class="mt-7">
          <p class="label text-ink-3">Capabilities</p>
          <p class="mt-2 text-sm leading-relaxed text-ink">
            {{ lead.capabilities.join(' · ') }}
          </p>
        </div>

        <ul class="mt-6 flex flex-wrap gap-1.5">
          <li
            v-for="tech in lead.tech"
            :key="tech"
            class="label border border-line px-2 py-1 text-ink-3"
          >
            {{ tech }}
          </li>
        </ul>

        <p v-if="lead.hrefLabel" class="label mt-6 flex items-center gap-2 text-ink-3">
          <span class="truncate">{{ lead.hrefLabel }}</span>
          <span
            class="transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            ↗
          </span>
        </p>
      </div>
    </article>

    <!-- Remaining featured work -->
    <div class="mt-5 grid gap-5 sm:grid-cols-2">
      <article
        v-for="(project, i) in secondary"
        :key="project.name"
        v-reveal:[i]
        class="panel group relative flex flex-col hover:-translate-y-0.5"
      >
        <div class="overflow-hidden border-b border-line">
          <img
            v-if="project.image"
            :src="project.image"
            :alt="`${project.name} screenshot`"
            width="1280"
            height="720"
            loading="lazy"
            decoding="async"
            class="aspect-video w-full object-cover object-top-left transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <ScheduleIllustration v-else-if="project.illustration === 'schedule'" />
          <!-- Nothing to screenshot yet: say so rather than leaving a gap -->
          <div
            v-else
            class="blueprint flex aspect-video w-full flex-col items-center justify-center gap-3 bg-surface-2/50"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.3"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-7 w-7 text-ink-3"
              aria-hidden="true"
            >
              <path d="M6 3h8l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
              <path d="M14 3v4h4M8.5 12h7M8.5 16h4" />
            </svg>
            <span class="label text-ink-2">{{ project.imageNote ?? 'No screenshot yet' }}</span>
          </div>
        </div>

        <div class="flex flex-1 flex-col p-6">
          <div class="flex items-start justify-between gap-4">
            <div class="flex flex-wrap items-center gap-2">
              <span class="label text-ink-3">{{ String(i + 2).padStart(2, '0') }}</span>
              <span
                class="label px-1.5 py-0.5"
                :class="project.href ? 'bg-accent-soft text-accent' : 'border border-line text-ink-3'"
              >
                {{ project.status }}
              </span>
            </div>

            <svg
              v-if="project.href"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-4 w-4 shrink-0 text-ink-3 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
              aria-hidden="true"
            >
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          </div>

          <h3 class="mt-3 font-display text-xl font-medium leading-tight tracking-tight text-ink">
            <a
              v-if="project.href"
              :href="project.href"
              target="_blank"
              rel="noopener noreferrer"
              class="transition-colors hover:text-accent"
            >
              {{ project.name }}<span class="absolute inset-0" aria-hidden="true" />
            </a>
            <template v-else>{{ project.name }}</template>
          </h3>

          <p class="label mt-2 text-accent">{{ project.role }}</p>

          <p class="mt-4 text-sm leading-relaxed text-ink-2">{{ project.description }}</p>

          <p class="mt-4 flex-1 text-sm leading-relaxed text-ink-3">
            {{ project.capabilities.join(' · ') }}
          </p>

          <ul class="mt-6 flex flex-wrap gap-1.5">
            <li
              v-for="tech in project.tech"
              :key="tech"
              class="label border border-line px-2 py-1 text-ink-3"
            >
              {{ tech }}
            </li>
          </ul>
        </div>
      </article>
    </div>

    <!-- Everything else, compact -->
    <div class="mt-16">
      <div v-reveal class="mb-6 flex items-center gap-3">
        <span class="h-1.5 w-1.5 shrink-0 bg-accent" aria-hidden="true" />
        <h3 class="label text-ink-2">Also delivered</h3>
        <span class="h-px min-w-6 flex-1 bg-line" aria-hidden="true" />
      </div>

      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="(project, i) in rest"
          :key="project.name"
          v-reveal:[i]
          class="panel group relative flex flex-col hover:-translate-y-0.5"
        >
          <div class="overflow-hidden border-b border-line">
            <img
              :src="project.image!"
              :alt="`${project.name} screenshot`"
              width="1280"
              height="720"
              loading="lazy"
              decoding="async"
              class="aspect-video w-full object-cover object-top-left transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </div>

          <div class="flex flex-1 flex-col p-5">
            <h4 class="font-display text-base font-medium leading-snug tracking-tight text-ink">
              <a
                :href="project.href!"
                target="_blank"
                rel="noopener noreferrer"
                class="transition-colors group-hover:text-accent"
              >
                {{ project.name }}<span class="absolute inset-0" aria-hidden="true" />
              </a>
            </h4>

            <p class="label mt-2 text-accent">{{ project.role }}</p>
            <p class="mt-3 text-sm leading-relaxed text-ink-2">{{ project.description }}</p>

            <p class="mt-3 flex-1 text-xs leading-relaxed text-ink-3">
              {{ project.capabilities.join(' · ') }}
            </p>

            <p class="label mt-5 flex items-center gap-2 text-ink-3">
              <span class="truncate">{{ project.hrefLabel }}</span>
              <span
                class="transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                ↗
              </span>
            </p>
          </div>
        </article>
      </div>
    </div>

    <!-- Public code: personal, academic and open-source work -->
    <div class="mt-16">
      <div v-reveal class="flex items-center gap-3">
        <span class="h-1.5 w-1.5 shrink-0 bg-accent" aria-hidden="true" />
        <h3 class="label text-ink-2">Open source & student work</h3>
        <span class="h-px min-w-6 flex-1 bg-line" aria-hidden="true" />
        <a
          href="https://github.com/samgit126"
          target="_blank"
          rel="noopener noreferrer"
          class="label shrink-0 text-ink-3 transition-colors hover:text-accent"
        >
          github.com/samgit126 ↗
        </a>
      </div>

      <ul class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="(repo, i) in repos" :key="repo.name" v-reveal:[i] class="panel">
          <a
            :href="repo.href"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex h-full flex-col p-5"
          >
            <div class="flex items-start justify-between gap-3">
              <span
                class="font-display text-base font-medium leading-snug tracking-tight text-ink transition-colors group-hover:text-accent"
              >
                {{ repo.name }}
              </span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="mt-1 h-3.5 w-3.5 shrink-0 text-ink-3 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                aria-hidden="true"
              >
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </div>

            <p class="mt-3 flex-1 text-sm leading-relaxed text-ink-2">{{ repo.description }}</p>
            <p class="label mt-4 text-ink-3">{{ repo.tech }}</p>
          </a>
        </li>
      </ul>
    </div>
  </SectionShell>
</template>
