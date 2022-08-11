<script setup>
import { ref, onMounted } from 'vue'
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Editor from './components/editor.vue'

let darkTheme = ref('dark')
const editorContent = ref('Hello, it\'s awesome.')

onMounted(() => {
  darkTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
})
</script>

<template lang="pug">
.page(:class="darkTheme ? 'dark' : 'light'")
  .top-bar
    .theme-switch(@click="darkTheme = !darkTheme")
      button.button.i-moon(:class="{ 'button--active': !darkTheme }")
      button.button.i-sun(:class="{ 'button--active': darkTheme }")
      .slider
  header
    .container
      h1
        | Richer than you
        sup.dollar $
      p.catchphrase $. Another modern rich text editor. This one's richer than you.

      editor.hero(
        v-model="editorContent"
        placeholder="Write something...")

  main
    .container
      ul.checklist
        li Designed for Vue 3
        li Designed for light and dark darkThemes
        li Fully accessible
        li Lightweight
        li Modern technics, supported by all recent browsers
        li Modular
        li Clean HTML output
        li Plug and play
        li Responsive

.particles
  - for (i = 1; i <= 100; i++)
    .c
</template>
