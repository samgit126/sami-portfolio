<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '../composables/useTheme'

const { isDark, toggleTheme } = useTheme()

const label = computed(() => (isDark.value ? 'Switch to light theme' : 'Switch to dark theme'))
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    :title="label"
    :aria-pressed="isDark"
    class="group relative inline-flex h-9 w-9 items-center justify-center border border-line bg-surface text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
    @click="toggleTheme"
  >
    <span class="relative block h-4 w-4" aria-hidden="true">
      <!-- Sun -->
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.7"
        stroke-linecap="round"
        class="absolute inset-0 h-4 w-4 transition-all duration-300"
        :class="isDark ? 'scale-50 opacity-0' : 'scale-100 opacity-100'"
      >
        <circle cx="12" cy="12" r="4.2" />
        <path
          d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"
        />
      </svg>
      <!-- Moon -->
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="absolute inset-0 h-4 w-4 transition-all duration-300"
        :class="isDark ? 'scale-100 opacity-100' : 'scale-50 opacity-0'"
      >
        <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2Z" />
      </svg>
    </span>
  </button>
</template>
