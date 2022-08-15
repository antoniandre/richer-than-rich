<script setup>
import { ref, onMounted } from 'vue'
import Editor from '@/richer-than-you/editor.vue'
import TopBar from './components/top-bar.vue'
import Hero from './components/hero.vue'
import './scss/index.scss'

let darkMode = ref(true)
const buttons = [
  { name: 'font-size', label: 'Text size' },
  { name: 'font-family', label: 'Font' },
  '|',
  { name: 'text-color', label: 'Text color' }
]
const buttons2 = ['bold', 'italic', 'underline', 'subscript', 'superscript']
const buttons3 = ['bold', 'italic', 'underline', '|', 'subscript', 'superscript']

onMounted(() => {
  darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
})
</script>

<template lang="pug">
.page(:class="darkMode ? 'dark' : 'light'")
  top-bar(v-model:dark-mode="darkMode")

  hero(:dark-mode="darkMode")

  main
    section.section.section--why
      .container
        h2 Why it's cool.
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
          li Customizable
    section.section.section--install
      .container
        h2 Installation
    section.section.section--easy
      .container
        h2 Easy to use
        .grid.grid--2
          .grow
            h3 Simple markup
            p Only set the buttons you want as strings. Or get a common set by default.
            p separator is as easy as '|'
            .stack-box
              editor(:buttons="buttons2" model-value="Only set the buttons you want as strings.")
              editor(model-value="...Or get a common set by default.")
              editor(:buttons="buttons3" model-value="Separate buttons with a simple '|'.")
          .grow
            h3 Emit events
            .stack-box
              editor(:buttons="buttons")
              pre &lt;richer&gt;&lt;/richer&gt;
    section.section.section--customizable
      .container
        h2 Highly customizable
        .grid.grid--3
          .grow
            h3 Styles
            editor(:buttons="buttons")
          .grow
            h3 Using slots
            editor(:buttons="buttons2")
          .grow
            h3 custom buttons
            editor(:buttons="buttons2")
</template>
