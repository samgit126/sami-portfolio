<script setup lang="ts">
import { vReveal } from '../directives/reveal'

/**
 * Wrapper for every section in the scrolling column. Width and horizontal
 * padding come from the layout shell, so this only owns rhythm and the header.
 */
defineProps<{
  id: string
  index: string
  eyebrow: string
  title: string
  intro?: string
}>()
</script>

<template>
  <section :id="id" class="relative scroll-mt-24 py-16 sm:py-20 lg:py-24">
    <!-- Hairline that fades out toward the right instead of a hard full rule -->
    <div
      aria-hidden="true"
      class="absolute inset-x-0 top-0 h-px"
      style="background: linear-gradient(90deg, var(--line-strong), transparent 85%)"
    />

    <header v-reveal class="mb-10 sm:mb-12">
      <div class="flex items-center gap-3">
        <span
          class="flex h-7 items-center rounded-full px-2.5 font-mono text-[11px] font-medium tracking-wider text-on-brand"
          style="background-image: linear-gradient(120deg, var(--brand), var(--brand-2))"
        >
          {{ index }}
        </span>
        <span class="label text-ink-3">{{ eyebrow }}</span>
      </div>

      <h2
        class="mt-5 max-w-2xl font-display text-[clamp(1.6rem,3vw,2.35rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink text-balance"
      >
        {{ title }}
      </h2>

      <p v-if="intro" class="mt-4 max-w-2xl text-base leading-relaxed text-ink-2">
        {{ intro }}
      </p>
    </header>

    <slot />
  </section>
</template>
