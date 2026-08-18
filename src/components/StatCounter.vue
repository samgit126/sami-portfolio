<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCountUp } from '../composables/useCountUp'

const props = withDefaults(
  defineProps<{ value: string; label: string; size?: 'md' | 'lg' }>(),
  { size: 'lg' },
)

const root = ref<HTMLElement | null>(null)
const { display, observe } = useCountUp(props.value)

onMounted(() => observe(root.value))
</script>

<template>
  <div ref="root">
    <dt class="sr-only">{{ label }}</dt>
    <dd>
      <span
        class="block font-display font-semibold tracking-tight tabular-nums text-ink"
        :class="size === 'lg' ? 'text-3xl sm:text-4xl' : 'text-xl'"
      >
        {{ display }}
      </span>
      <span class="mt-2 block text-xs leading-snug text-ink-3">{{ label }}</span>
    </dd>
  </div>
</template>
