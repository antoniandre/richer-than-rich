<script setup>
import { ref, onMounted } from 'vue'
import Editor from '@/richer-than-you/editor.vue'
import TopBar from './components/top-bar.vue'

let darkTheme = ref(true)
const editorContent = ref('<div style="text-align: center"><br><h2>Hi. I\'m r$$$ch.</h2><p><br><br>Wanna try me?</p></div>')

const cl = (...args) => console.log(...args)

onMounted(() => {
  darkTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
})
</script>

<template lang="pug">
.page(:class="darkTheme ? 'dark' : 'light'")
  top-bar(v-model:dark-theme="darkTheme")

  header
    .container
      h1
        | Richer than you
        sup.dollar $
      p.catchphrase $. Another modern rich text editor. This one's richer than you.

      editor.hero(
        :model-value="editorContent"
        placeholder="Write something..."
        :dark-mode="darkTheme"
        @button-click="cl('button-click', $event)"
        @click="cl('click', $event)"
        @keyup="cl('keyup', $event)"
        @focus="cl('focus', $event)"
        @blur="cl('blur', $event)"
        @paste="cl('paste', $event)")

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

.particles
  - for (i = 1; i <= 100; i++)
    .c
</template>
