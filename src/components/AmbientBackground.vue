<script setup lang="ts">
/**
 * Fixed colour wash behind everything: two slow-drifting orbs plus a faint dot
 * field. Purely decorative, so it is hidden from assistive tech and frozen by
 * the reduced-motion rules in the stylesheet.
 */
</script>

<template>
  <div aria-hidden="true" class="pointer-events-none fixed inset-0 -z-10 overflow-hidden print:hidden">
    <div
      class="orb animate-float-slow -left-40 -top-40 h-[34rem] w-[34rem]"
      style="background: radial-gradient(circle, var(--brand) 0%, transparent 68%); opacity: 0.16"
    />
    <div
      class="orb animate-float-slower right-[-14rem] top-[22rem] h-[30rem] w-[30rem]"
      style="background: radial-gradient(circle, var(--brand-3) 0%, transparent 68%); opacity: 0.14"
    />
    <div
      class="orb animate-float-slow bottom-[-16rem] left-1/3 h-[28rem] w-[28rem]"
      style="
        background: radial-gradient(circle, var(--brand-2) 0%, transparent 68%);
        opacity: 0.1;
        animation-delay: -6s;
      "
    />
    <div
      class="dotfield absolute inset-0"
      style="
        mask-image: radial-gradient(ellipse 100% 60% at 50% 0%, black 0%, transparent 75%);
        -webkit-mask-image: radial-gradient(ellipse 100% 60% at 50% 0%, black 0%, transparent 75%);
      "
    />
  </div>
</template>
