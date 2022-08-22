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
  darkMode.value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
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
        h2 Installation
        pre-ssh(language="shell") npm i richer-than-you

        p.mt2 Import in your component:
        pre-ssh(language="js" :dark="darkMode").
          import Richer from 'richer-than-you'
          import 'richer-than-you/dist/styles.css'

        p.mt2 Use in the template:
        pre-ssh(language="html-vue") &lt;richer&gt;&lt;/richer&gt;

    section.section.section--easy
      .container
        h2 Easy to use
        p Content coming soon.
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
              pre-ssh(language="html-vue" :dark="darkMode") &lt;richer&gt;&lt;/richer&gt;

    section.section.section--customizable
      .container
        h2 Highly customizable

        div
          h3.mt3 You pick your buttons
          .flex
            editor(
              model-value="I'm rich. $$"
              :dark-mode="darkMode"
              :buttons="['bold', 'underline', 'subscript', 'superscript']")
            pre-ssh(language="html-vue" :dark="darkMode").
              &lt;richer
                model-value="I'm rich. $$"
                :buttons="['bold', 'underline', 'subscript', 'superscript']"
              &gt;
              &lt;/richer&gt;

        div
          h3.mt3 Add your own custom buttons
          .flex
            editor(
              model-value="I'm rich. $$"
              :dark-mode="darkMode"
              :buttons="[{ name: 'dark', label: 'Dark theme', icon: 'i-moon' }, { name: 'light', label: 'Light theme', icon: 'i-sun' }]")
            pre-ssh(language="html-vue" :dark="darkMode").
              &lt;richer
                model-value="I'm rich. $$"
                :buttons="[
                  { name: 'dark', label: 'Dark theme', icon: 'i-moon' },
                  { name: 'light', label: 'Light theme', icon: 'i-sun' }
                ]"
              &gt;
              &lt;/richer&gt;
        div
          h3.mt3 Styles
          .flex
            editor.round-buttons(model-value="I'm rich. $$" :dark-mode="darkMode")
            p.
              The component is using the BEM nomenclature as well as easy selectors as much as possible.#[br]
              It should be a breeze to apply the style you want.
        div
          h3.mt3 Using slots
          .flex.align-center
            editor.slots(model-value="I'm rich. $$" :dark-mode="darkMode")
              template(#button="{ button, action }")
                button(@click="action") {{ button.label }}

            pre-ssh(language="html-vue" :dark="darkMode").
              &lt;richer model-value="I'm rich. $$"&gt;
                &lt;template #button="{ button, action }"&gt;
                  &lt;button @click="action"&gt;
                    {{ '\{\{ button.label \}\}' }}
                  &lt;/button&gt;
                &lt;/template&gt;
              &lt;/richer&gt;

    section.section.section--get-it
      button.cta(@click="copyCode" :class="{ copied }")
        span.wrap
          | Get it now:
          code(ref="codeToCopy") npm i richer-than-you
</template>


<style lang="scss">
.richer.round-buttons {
  background: none;
  border: none;
  box-shadow: none;
  transition: $switch-mode-transition;

  .richer__content {
    position: relative;
    border: none;
    border-radius: 8px;
    margin-top: 4px;
    z-index: 0;
    transition: inherit;

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 8px;
      background: linear-gradient(160deg, #99d5ff 10%, #c3a3ff 60%, #ffafff 87%);
      box-shadow: 0 0 0 3px rgba(#000, 0) inset;
      transition: 0.25s ease-in-out;
      opacity: 0.7;
      z-index: -1;
    }
    &:after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      right: 2px;
      bottom: 2px;
      border-radius: 7px;
      background-color: #fff;
      transition: $switch-mode-transition;
      z-index: -1;
    }
    &:hover:before, &:focus:before {opacity: 1;}
  }

  .richer__menu {
    background: none;
    border: none;
  }

  .richer__button {
    border-radius: 99em;
    background: linear-gradient(120deg, #99d5ff 10%, #c3a3ff 60%, #ffafff 87%);
    border: none;
    color: #fff;
    width: 24px;
    height: 24px;
    overflow: hidden;
    box-shadow: 0 0 1px rgb(255 255 255 / 68%) inset;
    text-shadow: 0 0 4px rgba(#000, 0.6);

    &:before {
      border-radius: 99em;
      transition: 0.25s ease-in-out;
    }
    &:hover:before {
      background-color: #fff0;
    }

    &:hover:after {
      border-radius: inherit;
      background-color: rgba(255, 255, 255, 0.25);
    }
  }

  .separator {background: none;}
}

.richer--dark.round-buttons {
  .richer__content {
    color: #fff;

    &:before {background: linear-gradient(160deg, #3451bc, #9c66ff, #ff75ff);}
    &:after {background-color: #242424;}
  }

  .richer__button {
    background: linear-gradient(120deg, #3451bc 10%, #9c66ff 60%, #ff75ff 87%);
    color: #fff;
    box-shadow: 0 0 1px rgb(255 255 255 / 68%) inset;
    text-shadow: 0 0 4px rgba(#000, 0.6);

    &:hover:before {
      background-color: #fff0;
    }

    &:hover:after {
      background-color: rgba(255, 255, 255, 0.25);
    }
  }
}

.richer.slots {
  button {
    margin: 2px;
    padding: 2px 4px;
  }

  .richer__separator {display: none;}
}
</style>
