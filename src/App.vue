<script setup>
import { ref } from 'vue'
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Editor from './components/editor.vue'

const editorContent = ref('Hello, it\'s awesome.')
</script>

<template lang="pug">
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
      li Designed for light and dark themes
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
