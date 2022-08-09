<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Editor from './components/editor.vue'
</script>

<template lang="pug">
.page
  header
    h1
      | Richer than you
      sup.dollar $
    p.catchphrase $. Another modern rich text editor. This one's richer than you.

  main
    editor.hero

.particles
  - for (i = 1; i <= 100; i++)
    .c
</template>
