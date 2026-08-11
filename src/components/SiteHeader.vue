<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import ThemeToggle from './ThemeToggle.vue'
import { navItems, profile } from '../data/portfolio'
import { useScrollSpy } from '../composables/useScrollSpy'

const { activeId } = useScrollSpy(navItems.map((item) => item.id))

const scrolled = ref(false)
const menuOpen = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 12
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') menuOpen.value = false
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
})

// Never leave the page scroll-locked behind a closed menu.
watch(menuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-all duration-300"
    :class="
      scrolled
        ? 'border-b border-line bg-bg/85 backdrop-blur-md'
        : 'border-b border-transparent bg-transparent'
    "
  >
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
      <!-- Mark -->
      <a
        href="#top"
        class="group flex shrink-0 items-center gap-3"
        :aria-label="`${profile.name}, back to top`"
      >
        <span
          class="relative flex h-8 w-8 items-center justify-center border border-line-strong font-mono text-[11px] font-medium tracking-wider text-ink transition-colors group-hover:border-accent group-hover:text-accent"
        >
          {{ profile.initials }}
        </span>
        <span
          class="hidden whitespace-nowrap font-display text-sm font-medium tracking-tight text-ink sm:block"
        >
          {{ profile.shortName }}
        </span>
      </a>

      <!-- Desktop nav -->
      <nav aria-label="Sections" class="hidden xl:block">
        <ul class="flex items-center gap-1">
          <li v-for="item in navItems" :key="item.id">
            <a
              :href="`#${item.id}`"
              class="label relative block px-2 py-2 transition-colors"
              :class="
                activeId === item.id
                  ? 'text-accent'
                  : 'text-ink-3 hover:text-ink'
              "
              :aria-current="activeId === item.id ? 'true' : undefined"
            >
              {{ item.label }}
              <span
                class="absolute inset-x-2 -bottom-px h-px origin-left bg-accent transition-transform duration-300"
                :class="activeId === item.id ? 'scale-x-100' : 'scale-x-0'"
                aria-hidden="true"
              />
            </a>
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-2">
        <!-- Always-visible CV download, next to the theme toggle -->
        <a
          :href="profile.cv"
          download
          class="group inline-flex h-9 items-center gap-2 border border-line bg-surface px-2.5 text-ink-2 transition-colors hover:border-accent hover:text-accent sm:px-3"
          aria-label="Download CV as PDF"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
            aria-hidden="true"
          >
            <path d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14" />
          </svg>
        </a>

        <ThemeToggle />

        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center border border-line bg-surface text-ink-2 transition-colors hover:border-line-strong hover:text-ink xl:hidden"
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
              <path d="M4 7h16M4 12h16M4 17h16" />
            </template>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile nav -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <nav
        v-show="menuOpen"
        id="mobile-nav"
        aria-label="Sections"
        class="border-t border-line bg-bg/95 backdrop-blur-md xl:hidden"
      >
        <ul class="mx-auto max-w-6xl px-5 py-3 sm:px-8">
          <li v-for="item in navItems" :key="item.id">
            <a
              :href="`#${item.id}`"
              class="flex items-baseline gap-4 border-b border-line py-3 last:border-b-0"
              :class="activeId === item.id ? 'text-accent' : 'text-ink-2'"
              @click="menuOpen = false"
            >
              <span class="label text-ink-3">{{ item.index }}</span>
              <span class="font-display text-lg tracking-tight">{{ item.label }}</span>
            </a>
          </li>
          <li>
            <a
              :href="profile.cv"
              download
              class="mt-3 flex items-center justify-center gap-2.5 border border-accent/50 bg-accent-soft px-4 py-3 font-mono text-xs uppercase tracking-[0.16em] text-accent"
              @click="menuOpen = false"
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
              Download CV
            </a>
          </li>
        </ul>
      </nav>
    </Transition>
  </header>
</template>
