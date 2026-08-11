<script setup lang="ts">
import SiteHeader from './components/SiteHeader.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import SkillsSection from './components/SkillsSection.vue'
import ExperienceSection from './components/ExperienceSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import ContributionsSection from './components/ContributionsSection.vue'
import PublicationsSection from './components/PublicationsSection.vue'
import TeachingSection from './components/TeachingSection.vue'
import EducationSection from './components/EducationSection.vue'
import ContactSection from './components/ContactSection.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<template>
  <a
    href="#main"
    class="label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:border focus:border-accent focus:bg-surface focus:px-4 focus:py-3 focus:text-ink"
  >
    Skip to content
  </a>

  <!-- Container margin lines. Only the two outer rules, so they frame the
       content column instead of cutting across the section grids. -->
  <div
    aria-hidden="true"
    class="pointer-events-none fixed inset-0 z-0 hidden justify-center lg:flex"
  >
    <div class="w-full max-w-6xl border-l border-r border-line/60 px-5 sm:px-8" />
  </div>

  <SiteHeader />

  <main id="main" class="relative z-10">
    <HeroSection />
    <AboutSection />
    <SkillsSection />
    <ExperienceSection />
    <ProjectsSection />
    <ContributionsSection />
    <PublicationsSection />
    <TeachingSection />
    <EducationSection />
    <ContactSection />
  </main>

  <SiteFooter />
</template>
