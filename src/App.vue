<script setup lang="ts">
import AmbientBackground from './components/AmbientBackground.vue'
import IdentityRail from './components/IdentityRail.vue'
import MobileTopBar from './components/MobileTopBar.vue'
import IntroBlock from './components/IntroBlock.vue'
import AboutSection from './components/AboutSection.vue'
import SkillsSection from './components/SkillsSection.vue'
import ExperienceSection from './components/ExperienceSection.vue'
import EvidenceSection from './components/EvidenceSection.vue'
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
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-surface focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-ink focus:shadow-float"
  >
    Skip to content
  </a>

  <AmbientBackground />
  <MobileTopBar />

  <!-- Split layout: the rail is pinned for the whole page, the column scrolls. -->
  <div
    class="print-shell mx-auto grid w-full max-w-[110rem] items-start px-0 lg:grid-cols-[21rem_minmax(0,1fr)] lg:gap-14 lg:px-10 xl:grid-cols-[24rem_minmax(0,1fr)] xl:gap-20 2xl:px-16"
  >
    <IdentityRail />

    <div class="min-w-0">
      <main id="main" class="px-5 sm:px-8 lg:px-0 lg:pt-10">
        <IntroBlock />
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <EvidenceSection />
        <ProjectsSection />
        <ContributionsSection />
        <PublicationsSection />
        <TeachingSection />
        <EducationSection />
        <ContactSection />
      </main>

      <SiteFooter />
    </div>
  </div>
</template>
