<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import ThemeToggle from './ThemeToggle.vue'
import { navItems, profile } from '../data/portfolio'
import { useScrollSpy } from '../composables/useScrollSpy'
import { useScrollProgress } from '../composables/useScrollProgress'
import { asset } from '../utils/asset'

/**
 * Small-screen counterpart to IdentityRail: the section nav has to go
 * somewhere once there is no room for a full-height rail.
 */

const { activeId } = useScrollSpy(navItems.map((item) => item.id))
const { progress } = useScrollProgress()

const menuOpen = ref(false)

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') menuOpen.value = false
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

// Never leave the page scroll-locked behind a closed menu.
watch(menuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50 lg:hidden print:hidden">
    <div class="glass border-b border-line">
      <div class="flex items-center justify-between gap-3 px-5 py-3">
        <a href="#top" class="flex items-center gap-2.5" :aria-label="`${profile.name}, back to top`">
          <span
            class="flex h-8 w-8 items-center justify-center rounded-full font-display text-[11px] font-semibold text-on-brand"
            style="background-image: linear-gradient(135deg, var(--brand), var(--brand-3))"
          >
            {{ profile.initials }}
          </span>
          <span class="font-display text-sm font-semibold tracking-tight text-ink">
            {{ profile.shortName }}
          </span>
        </a>

        <div class="flex items-center gap-1.5">
          <a
            :href="asset(profile.cv)"
            download
            class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink-2"
            aria-label="Download CV as PDF"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14" />
            </svg>
          </a>

          <ThemeToggle />

          <button
            type="button"
            class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink-2"
            :aria-expanded="menuOpen"
            aria-controls="mobile-nav"
            :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
            @click="menuOpen = !menuOpen"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              class="h-4 w-4"
              aria-hidden="true"
            >
              <template v-if="menuOpen">
                <path d="M6 6l12 12M18 6L6 18" />
              </template>
              <template v-else>
                <path d="M4 8h16M4 16h16" />
              </template>
            </svg>
          </button>
        </div>
      </div>

      <!-- Reading progress sits on the bar's bottom edge -->
      <div aria-hidden="true" class="h-px bg-transparent">
        <div
          class="h-px origin-left"
          :style="{
            transform: `scaleX(${progress})`,
            backgroundImage: 'linear-gradient(90deg, var(--brand), var(--brand-2), var(--brand-3))',
          }"
        />
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-3"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="opacity-0 -translate-y-3"
    >
      <nav
        v-show="menuOpen"
        id="mobile-nav"
        aria-label="Sections"
        class="glass mx-4 mt-2 overflow-hidden rounded-3xl border border-line shadow-float"
      >
        <ul class="p-2">
          <li v-for="item in navItems" :key="item.id">
            <a
              :href="`#${item.id}`"
              class="flex items-center gap-4 rounded-2xl px-4 py-3 transition-colors"
              :class="activeId === item.id ? 'bg-accent-soft text-accent' : 'text-ink-2'"
              @click="menuOpen = false"
            >
              <span class="label text-ink-3">{{ item.index }}</span>
              <span class="font-display text-base font-medium tracking-tight">{{ item.label }}</span>
            </a>
          </li>
        </ul>
      </nav>
    </Transition>
  </header>
</template>
