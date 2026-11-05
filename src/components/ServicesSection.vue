<script setup lang="ts">
import SectionShell from './SectionShell.vue'
import { vReveal } from '../directives/reveal'
import { vSpotlight } from '../directives/spotlight'
import { vMagnetic } from '../directives/magnetic'
import { contactChannels, engagement, services } from '../data/portfolio'

/**
 * The hire-me-this-week section. Three fixed-scope offers with price and
 * turnaround, then the terms that apply to all of them, then how an
 * engagement runs. Everything a client needs to decide without a call.
 */

const email = contactChannels[0].value

function mailto(subject: string) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`
}

const terms = [
  { key: 'Hourly', value: engagement.hourly, note: engagement.hourlyNote },
  { key: 'Capacity', value: engagement.capacity, note: engagement.capacityNote },
  { key: 'Time zone', value: engagement.timezone, note: engagement.timezoneNote },
]
</script>

<template>
  <SectionShell
    id="services"
    index="10"
    eyebrow="Services"
    title="Fixed-scope work you can book this week"
    intro="Three engagements I run alongside the day job, each scoped so you know the deliverable, the date and the price before we talk. Larger projects start from one of these."
  >
    <ol class="grid gap-5">
      <li
        v-for="(service, i) in services"
        :key="service.id"
        v-reveal:[i]
        v-spotlight
        class="card spotlight card-hover ring-gradient group p-6 sm:p-8"
      >
        <div class="grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-10">
          <!-- The offer -->
          <div>
            <div class="flex items-center gap-3">
              <span
                class="flex h-7 items-center rounded-full px-2.5 font-mono text-[11px] font-medium tracking-wider text-on-brand"
                style="background-image: linear-gradient(120deg, var(--brand), var(--brand-2))"
              >
                {{ String(i + 1).padStart(2, '0') }}
              </span>
              <span class="label text-ink-3">Offer</span>
            </div>

            <h3
              class="mt-4 font-display text-lg font-semibold leading-snug tracking-tight text-ink sm:text-xl"
            >
              {{ service.name }}
            </h3>

            <p class="mt-3 text-sm leading-relaxed text-ink-2">{{ service.fit }}</p>

            <dl class="mt-6 grid grid-cols-2 gap-4">
              <div>
                <dt class="label text-ink-3">Price</dt>
                <dd class="mt-1.5 font-display text-base font-semibold tracking-tight text-ink">
                  {{ service.price }}
                </dd>
              </div>
              <div>
                <dt class="label text-ink-3">Turnaround</dt>
                <dd class="mt-1.5 font-display text-base font-semibold tracking-tight text-ink">
                  {{ service.turnaround }}
                </dd>
              </div>
            </dl>

            <a
              v-magnetic="8"
              :href="mailto(`${service.name} — enquiry`)"
              class="btn btn-primary group/cta mt-6 print:hidden"
            >
              Ask about this
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1"
                aria-hidden="true"
              >
                <path d="M5 12h13M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <!-- What is included -->
          <div class="rounded-2xl border border-line bg-surface-2/60 p-5">
            <p class="label text-ink-3">What you get</p>

            <ul class="mt-4 space-y-2.5">
              <li
                v-for="point in service.scope"
                :key="point"
                class="flex items-start gap-2.5 text-sm leading-relaxed text-ink-2"
              >
                <span
                  class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style="background-image: linear-gradient(135deg, var(--brand), var(--brand-3))"
                  aria-hidden="true"
                />
                {{ point }}
              </li>
            </ul>

            <p class="mt-5 border-t border-line pt-4 text-sm leading-relaxed text-ink">
              <span class="font-semibold">Deliverable:&nbsp;</span>
              <span class="text-ink-2">{{ service.deliverable }}</span>
            </p>

            <div class="mt-5">
              <p class="label text-ink-3">Already done at</p>
              <a
                :href="service.proof.href"
                target="_blank"
                rel="noopener noreferrer"
                class="chip chip-accent mt-2.5"
              >
                {{ service.proof.label }}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </li>
    </ol>

    <!-- Terms that apply to every engagement -->
    <div class="mt-14">
      <div v-reveal class="mb-6 flex items-center gap-3">
        <h3 class="label text-ink-2">Terms for everything above</h3>
        <span
          class="h-px min-w-6 flex-1"
          style="background: linear-gradient(90deg, var(--line-strong), transparent)"
          aria-hidden="true"
        />
      </div>

      <dl class="card grid divide-line p-2 sm:grid-cols-3 sm:divide-x">
        <div v-for="(term, i) in terms" :key="term.key" v-reveal:[i] class="p-5">
          <dt class="label text-ink-3">{{ term.key }}</dt>
          <dd class="mt-2 font-display text-base font-semibold tracking-tight text-ink sm:text-lg">
            {{ term.value }}
          </dd>
          <dd class="mt-1.5 text-sm leading-relaxed text-ink-2">{{ term.note }}</dd>
        </div>
      </dl>
    </div>

    <!-- How an engagement runs -->
    <div class="mt-14">
      <div v-reveal class="mb-6 flex items-center gap-3">
        <h3 class="label text-ink-2">How it works</h3>
        <span
          class="h-px min-w-6 flex-1"
          style="background: linear-gradient(90deg, var(--line-strong), transparent)"
          aria-hidden="true"
        />
      </div>

      <ol class="grid gap-5 lg:grid-cols-3">
        <li
          v-for="(step, i) in engagement.steps"
          :key="step.title"
          v-reveal:[i]
          v-spotlight
          class="card spotlight card-hover flex flex-col p-6"
        >
          <span
            class="flex h-7 w-fit items-center rounded-full px-2.5 font-mono text-[11px] font-medium tracking-wider text-on-brand"
            style="background-image: linear-gradient(120deg, var(--brand), var(--brand-2))"
          >
            {{ String(i + 1).padStart(2, '0') }}
          </span>
          <h4 class="mt-4 font-display text-base font-semibold tracking-tight text-ink">
            {{ step.title }}
          </h4>
          <p class="mt-2 text-sm leading-relaxed text-ink-2">{{ step.text }}</p>
        </li>
      </ol>
    </div>
  </SectionShell>
</template>
