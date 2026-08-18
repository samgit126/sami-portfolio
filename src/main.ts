import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { vReveal } from './directives/reveal'
import { vSpotlight } from './directives/spotlight'
import { vMagnetic } from './directives/magnetic'

createApp(App)
  .directive('reveal', vReveal)
  .directive('spotlight', vSpotlight)
  .directive('magnetic', vMagnetic)
  .mount('#app')
