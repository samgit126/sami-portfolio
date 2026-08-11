<script setup lang="ts">
import { vReveal } from '../directives/reveal'

defineProps<{
  id: string
  index: string
  eyebrow: string
  title: string
  intro?: string
}>()
</script>

<template>
  <section :id="id" class="scroll-mt-24 border-t border-line py-20 sm:py-28">
    <div class="mx-auto w-full max-w-6xl px-5 sm:px-8">
      <header v-reveal class="mb-12 sm:mb-16">
        <div class="flex items-center gap-3">
          <span class="h-1.5 w-1.5 shrink-0 bg-accent" aria-hidden="true" />
          <span class="label text-accent">{{ index }}</span>
          <span class="label text-ink-3" aria-hidden="true">/</span>
          <span class="label text-ink-3">{{ eyebrow }}</span>
          <span class="h-px min-w-6 flex-1 bg-line" aria-hidden="true" />
        </div>

        <h2
          class="mt-5 font-display text-[clamp(1.75rem,4.5vw,2.75rem)] font-medium leading-[1.1] tracking-tight text-ink"
        >
          {{ title }}
        </h2>

        <p v-if="intro" class="mt-4 max-w-2xl text-base leading-relaxed text-ink-2 sm:text-lg">
          {{ intro }}
        </p>
      </header>

      <slot />
    </div>
  </section>
</template>
