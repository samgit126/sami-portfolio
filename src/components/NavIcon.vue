<script setup lang="ts">
/**
 * One line-art glyph per section, keyed by the nav item's id. Kept out of the
 * data file because these are presentation, not content.
 */
defineProps<{ id: string }>()

const paths: Record<string, string> = {
  about: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20a7.5 7.5 0 0 1 15 0',
  skills: 'M8 17 3 12l5-5M16 7l5 5-5 5M14 4l-4 16',
  experience: 'M4 7h16v13H4zM9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M4 12h16',
  evidence: 'M9 12.5 11 14.5 15.5 10M20 6v6c0 4.5-3 7.5-8 9-5-1.5-8-4.5-8-9V6l8-3 8 3Z',
  projects: 'M3 8.5 12 4l9 4.5-9 4.5-9-4.5ZM3 13l9 4.5L21 13M3 17l9 4.5L21 17',
  activity: 'M3 17.5 8 11l4 3.5L21 5M21 5h-5m5 0v5',
  publications: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 1 6.5 18H19v3H6.5A2.5 2.5 0 0 1 4 20.5Z',
  teaching: 'M4 8h16v11H4zM4 8l8-4 8 4M9.5 19v-5h5v5',
  education: 'M12 4 2.5 9 12 14l9.5-5L12 4ZM6.5 11.5V17c0 1.5 2.6 3 5.5 3s5.5-1.5 5.5-3v-5.5',
  services: 'M4 7h16v4H4zM4 13h16v4H4zM8 7V5h8v2M12 17v2',
  contact: 'M4 6h16v12H4zM4.5 7l7.5 6 7.5-6',
}
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="h-4 w-4"
    aria-hidden="true"
  >
    <path :d="paths[id] ?? paths.about" />
  </svg>
</template>
