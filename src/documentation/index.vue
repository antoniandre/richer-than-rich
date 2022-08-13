<script setup>
import { ref, onMounted } from 'vue'
import Editor from '@/richer-than-you/editor.vue'
import TopBar from './components/top-bar.vue'
import Hero from './components/hero.vue'

let darkMode = ref(true)

onMounted(() => {
  darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
})
</script>

<template lang="pug">
.page(:class="darkMode ? 'dark' : 'light'")
  top-bar(v-model:dark-mode="darkMode")

  hero(:dark-mode="darkMode")

  main
    .container
      ul.checklist
        li Designed for Vue 3
        li Designed for light and dark themes
        li Fully accessible
        li Lightweight
        li Modern technics using recent browsers powers. No legacy-IE code
        li Modular
        li Clean HTML output
        li Plug and play, no dependency
        li Responsive
</template>
