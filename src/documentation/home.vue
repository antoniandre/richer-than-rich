<script setup>
import { ref } from 'vue'
import Editor from '@/richer-than-rich/index.vue'

defineProps({
  darkMode: Boolean
})

const codeToCopy = ref(null)
let copied = ref(false)

const buttons = [
  { name: 'font-size', label: 'Text size' },
  { name: 'font-family', label: 'Font' },
  '|',
  { name: 'text-color', label: 'Text color' }
]

const log = (...args) => console.log(...args)

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
section.section.section--why
  .container
    h2 Why it's cool.
    ul.checklist
      li Free and open source
      li Designed for Vue 3
      li Designed for light and dark themes
      li Fully accessible
      li Lightweight
      li Modern technics using recent browsers powers. No legacy code
      li Modular
      li Clean HTML output
      li Plug and play, no dependency
      li Responsive
      li Customizable

section.section.section--install
  .container
    h2 Installation
    pre-ssh(language="shell") npm i richer-than-rich

    p.mt2 Import in your component:
    pre-ssh(language="js" :dark="darkMode").
      import Richer from 'richer-than-rich'
      import 'richer-than-rich/dist/style.css'

    p.mt2 Use in the template:
    pre-ssh(language="html-vue") &lt;richer&gt;&lt;/richer&gt;

section.section.section--easy
  .container
    h2 Easy to use
    .grid.grid--2
      .grow
        h3 Simple markup
        p.
          If you're after an easy plug &amp; play solution, just use the bare component.
          It will come with a set of common buttons.
        pre-ssh(language="html-vue" :dark="darkMode").
          &lt;richer&gt;&lt;/richer&gt;
        editor.mt1(:dark-mode="darkMode")

        p.mt2 You can also choose buttons by just giving an array of button names.
        pre-ssh(language="html-vue" :dark="darkMode").
          &lt;richer
            :buttons="['bold', 'underline', 'subscript', 'superscript']"
          &gt;
          &lt;/richer&gt;
        editor.mt1(
          :dark-mode="darkMode"
          :buttons="['bold', 'underline', 'subscript', 'superscript']")

        p.mt2 Adding separators between buttons is as easy as #[code |]
        pre-ssh(language="html-vue" :dark="darkMode").
          &lt;richer
            :buttons="['bold', 'underline', '|', 'subscript', 'superscript']"
          &gt;
          &lt;/richer&gt;
        editor.mt1(
          :dark-mode="darkMode"
          :buttons="['bold', 'underline', '|', 'subscript', 'superscript']")

        h3.mt2 Emitted events
        p Listen to events when interacting with the editor to trigger specific actions.

        editor.mt2(
          :dark-mode="darkMode"
          @button-click="log('button-click', $event)"
          @click="log('click', $event)"
          @keyup="log('keyup', $event)"
          @focus="log('focus', $event)"
          @blur="log('blur', $event)"
          @paste="log('paste', $event)")
        pre-ssh(language="html-vue" :dark="darkMode").
          &lt;richer
            @button-click="log('button-click', $event)"
            @click="log('click', $event)"
            @keyup="log('keyup', $event)"
            @focus="log('focus', $event)"
            @blur="log('blur', $event)"
            @paste="log('paste', $event)"
            :dark="darkMode"&gt;
          &lt;/richer&gt;

section.section.section--customizable
  .container
    h2 Highly customizable

    div
      h3.mt3 You pick your buttons
      p you can easily choose which button to use among a predefined list of common buttons.
      .flex
        .stack-box.grow
          editor(
            :dark-mode="darkMode"
            :buttons="['bold', 'underline', 'subscript', 'superscript']")
          editor(
            :dark-mode="darkMode"
            :buttons="['font-size', 'font-family', 'text-color', 'background-color', 'bold', 'italic', 'underline', 'strikethrough', 'list-ul', 'list-ol', 'align-left', 'align-center', 'align-right', 'align-justify', 'unindent', 'indent', 'subscript', 'superscript', 'link', 'image', 'table', 'code', 'undo', 'redo', 'clear-format']")
        pre-ssh.grow(language="html-vue" :dark="darkMode").
          &lt;richer
            :buttons="['bold', 'underline', 'subscript', 'superscript']"
          &gt;
          &lt;/richer&gt;

    div
      h3.mt3 Add your own custom buttons
      .flex
        editor(
          :dark-mode="darkMode"
          :buttons="[{ name: 'dark', label: 'Dark theme', icon: 'i-moon', action: log }, { name: 'light', label: 'Light theme', icon: 'i-sun', action: log }]")
        pre-ssh(language="html-vue" :dark="darkMode").
          &lt;richer
            :buttons="[
              { name: 'dark', label: 'Dark theme', icon: 'i-moon', action: log },
              { name: 'light', label: 'Light theme', icon: 'i-sun', action: log }
            ]"
          &gt;
          &lt;/richer&gt;
    div
      h3.mt3 Styles
      .flex
        editor.round-buttons(:dark-mode="darkMode")
        p.
          The component is using the BEM nomenclature as well as easy selectors as much as possible.#[br]
          It should be a breeze to apply the style you want.
    div
      h3.mt3 Using slots
      .flex.align-center
        editor.slots(:dark-mode="darkMode")
          template(#button="{ button, action }")
            button(@click="action") {{ button.label }}

        pre-ssh(language="html-vue" :dark="darkMode").
          &lt;richer&gt;
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
      code(ref="codeToCopy") npm i richer-than-rich
</template>


<style lang="scss">
// Main.
// --------------------------------------------------------
.section {
  position: relative;
  min-height: 450px;
  padding-top: 6rem;
  padding-bottom: 6rem;
  transition: $switch-mode-transition;

  .container {position: relative;}
  .richer {box-shadow: 1px 1px 4px rgba(#000, 0.07);}
}

.section--why {
  padding-top: 1rem;
  background:
    var(--theme-color-invert-bg)
    linear-gradient(170deg, var(--theme-color-invert-bg) 33%, rgba(var(--theme-color-main-bg-rgb), 7%));
  color: var(--theme-color-invert-fg);

  ::selection {background: $dark-gold-color;}

  .container {max-width: 700px;}

  .checklist {
    column-count: 2;
    column-gap: 2rem;
    justify-content: center;
  }
}

.section--install {
  padding-top: 4rem;

  &:before {
    content: '';
    position: absolute;
    bottom: 100%;
    left: -5vw;
    right: -5vw;
    height: 150px;
    border-radius: 0 80% 0 0;
    transform: rotate(-4deg) translateY(50%);
    background-color: var(--theme-color-main-bg);
    transition: inherit;
  }
}

.section--easy {
  background-color: rgba(var(--theme-color-invert-bg-rgb), 0.05);
}

.section--customizable {
  .flex {gap: 2rem;}

  .richer {
    width: 100%;
    max-width: 400px;
  }
}

.section--get-it {
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(170deg, transparent 20%, #fde9ae);

  .cta {
    position: relative;
    background: linear-gradient(110deg, #ebb447, #fcf6ba, #cc9a2e, #fbf5b7, #bf953f);
    background-size: 200%;
    border: none;
    border-radius: 99em;
    font-size: 1.2rem;
    font-family: 'Arial Black', Arial, Helvetica, sans-serif;
    color: #000;
    cursor: pointer;
    box-shadow: 3px 3px 12px rgba(#000, 0.25);

    span.wrap {
      display: block;
      position: relative;
      padding: 1rem 1.5rem;
      border-radius: inherit;
      overflow: hidden;
    }

    span.wrap:before {
      content: '';
      position: absolute;
      top: -120%;
      right: -200%;
      width: 50%;
      height: 300%;
      transform: rotate(30deg);
      background: linear-gradient( to right, rgba(255, 255, 255, 0.13), rgba(255, 255, 255, 0.13), rgba(255, 246, 198, 0.65), rgba(255, 255, 255, 0));
    }

    &:after {
      content: 'Copied!';
      position: absolute;
      top: 100%;
      margin-top: 0.5rem;
      font: italic 1rem Arial, Helvetica, sans-serif;
      opacity: 0;
      pointer-events: none;
      transform: translateX(-50%);
      transition: 0.3s ease-in-out;
      color: #bf953f;
    }

    code {
      margin-left: 0.5rem;
      background-color: #{$light-gold-color}9c;
      padding: 0.5rem;
    }

    span.wrap:hover:before {animation: shine 2s infinite;}

    &.copied:after {
      opacity: 1;
      transform: translate(-50%, 0.3rem);
    }
  }
}

// Specific Richer examples styles.
// --------------------------------------------------------
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
    box-shadow: 0 0 1px rgba(#fff, 0.68) inset;
    text-shadow: 0 0 4px rgba(#000, 0.6);

    &:before {
      border-radius: 99em;
      transition: 0.25s ease-in-out;
    }
    &:hover:before {background-color: transparent;}

    &:focus:after {
      transform: scale(1);
      opacity: 1;
      border-radius: inherit;
      border: 1px solid rgba(var(--theme-color-invert-bg-rgb), 0.6);
      background-color: transparent;
    }
    &:hover:after {
      border-radius: inherit;
      background-color: rgba(var(--theme-color-main-bg-rgb), 0.25);
    }
  }

  .richer__separator {background: none;}
}

.richer--dark.round-buttons {
  .richer__button {
    background: linear-gradient(120deg, #3451bc 10%, #9c66ff 60%, #ff75ff 87%);
    color: #fff;
    box-shadow: 0 0 1px rgb(255 255 255 / 68%) inset;
    text-shadow: 0 0 4px rgba(#000, 0.6);

    &:hover:after {background-color: rgba(255, 255, 255, 0.25);}
  }

  .richer__content {
    color: #fff;

    &:before {background: linear-gradient(160deg, #3451bc, #9c66ff, #ff75ff);}
    &:after {background-color: #242424;}
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
