import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function readStored(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'dark' || value === 'light' ? value : null
  } catch {
    // Private mode / storage disabled — fall back to system preference.
    return null
  }
}

/** Whether the user has made an explicit choice (vs. following the system). */
const hasExplicitChoice = ref(readStored() !== null)
const isDark = ref(readStored() === 'dark' || (!hasExplicitChoice.value && systemPrefersDark()))

function apply(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark)
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
}

apply(isDark.value)

watch(isDark, (dark) => {
  apply(dark)
  if (!hasExplicitChoice.value) return
  try {
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
  } catch {
    // Ignore — the theme still applies for this session.
  }
})

// Keep following the OS until the user picks a side themselves.
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
  if (hasExplicitChoice.value) return
  isDark.value = event.matches
})

export function useTheme() {
  function toggleTheme() {
    hasExplicitChoice.value = true
    isDark.value = !isDark.value
  }

  return { isDark, toggleTheme }
}
