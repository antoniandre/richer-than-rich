<script setup>
import { ref, onMounted } from 'vue'
import Editor from '@/richer-than-you/index.vue'
import TopBar from './components/top-bar.vue'
import Hero from './components/hero.vue'
import './scss/index.scss'

let darkMode = ref(true)
const codeToCopy = ref(null)
let copied = ref(false)

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

const copyCode = e => {
  e.target.insertAdjacentHTML(
    'afterend',
    `<textarea id="clipboard-textarea">${codeToCopy.value.innerText}</textarea>`
  )
  const textarea = document.getElementById('clipboard-textarea')

  textarea.select()
  textarea.setSelectionRange(0, 99999) // For mobile devices.
  document.execCommand('copy')
  textarea.remove()

  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

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
          li Free and open source
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
        h2 Installation:
        pre-ssh(language="shell") npm i richer-than-you

        p Use in your component:
        pre-ssh(language="html-vue") &lt;richer&gt;&lt;/richer&gt;

    section.section.section--easy
      .container
        h2 Easy to use
        p Content will be updated soon.
        //- .grid.grid--2
          .grow
            h3 Simple markup
            p Only set the buttons you want as strings. Or get a common set by default.
            p separator is as easy as '|'
            .stack-box
              editor(:dark-mode="darkMode" :buttons="buttons2" model-value="Only set the buttons you want as strings.")
              editor(:dark-mode="darkMode" model-value="...Or get a common set by default.")
              editor(:dark-mode="darkMode" :buttons="buttons3" model-value="Separate buttons with a simple '|'.")
          .grow
            h3 Emit events
            .stack-box
              editor.mt2(:dark-mode="darkMode" :buttons="buttons")
              pre-ssh(language="html-vue") &lt;richer&gt;&lt;/richer&gt;

    section.section.section--customizable
      .container
        h2 Highly customizable
        p Content will be updated soon.
        //- .grid.grid--3
          .grow
            h3 Styles
            editor(:dark-mode="darkMode" :buttons="buttons")
          .grow
            h3 Using slots
            editor(:dark-mode="darkMode" :buttons="buttons2")
          .grow
            h3 custom buttons
            editor(:dark-mode="darkMode" :buttons="buttons2")

    section.section.section--get-it
      button.cta(@click="copyCode" :class="{ copied }")
        span.wrap
          | Get it now:
          code(ref="codeToCopy") npm i richer-than-you
</template>
