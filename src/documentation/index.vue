<script setup>
import { ref, onMounted } from 'vue'
import TopBar from './components/top-bar.vue'
import Hero from './components/hero.vue'
import Home from './home.vue'
import './scss/index.scss'

const darkMode = ref(false)

onMounted(() => {
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  if ((typeof prefersDark === 'string' && prefersDark === 'true') ||
      (typeof prefersDark === 'boolean' && prefersDark)) {
    document.body.classList.add('dark')
    darkMode.value = true
  }
  setTimeout(() => document.body.classList.add('ready'), 300)
})
</script>

<template lang="pug">
top-bar(v-model:dark-mode="darkMode")

hero(:dark-mode="darkMode")

main
  home(:dark-mode="darkMode")

  footer
    .gold-separator
    .container.
      Copyright © Antoni Andre {{ (new Date()).getFullYear() }}.
</template>
