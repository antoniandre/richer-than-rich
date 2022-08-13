<script setup>
import { ref } from 'vue'
import Editor from '@/richer-than-you/editor.vue'

defineProps({
  darkMode: Boolean
})

const editorContent = ref('<div style="text-align: center"><br><h2>Hi. I\'m r$$$ch.</h2><p><br><br>Wanna try me?</p></div>')

const cl = (...args) => console.log(...args)
</script>

<template lang="pug">
header
  .container
    h1
      | Richer than you
      sup.dollar $
    p.catchphrase $. Another modern rich text editor. This one's richer than you.

    editor.hero(
      :model-value="editorContent"
      placeholder="Write something..."
      :dark-mode="darkMode"
      @button-click="cl('button-click', $event)"
      @click="cl('click', $event)"
      @keyup="cl('keyup', $event)"
      @focus="cl('focus', $event)"
      @blur="cl('blur', $event)"
      @paste="cl('paste', $event)")

  .particles
    - for (i = 1; i <= 100; i++)
      .c
</template>

<style lang="scss" scoped>
header {
  height: 100vh;
  display: flex;
  place-items: center;
}

h1, .dollar, .catchphrase {
  background: linear-gradient(120deg, #bf953f, #fee49b, #b38728, #fbf5b7, #aa771c);
  color: transparent;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  user-select: none;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
  margin-bottom: 4px;
  letter-spacing: 1.5px;
}

.dollar {
  position: absolute;
  font-size: 2rem;
  font-weight: bold;
  background-size: 600%;
}

.catchphrase {
  position: relative;
  margin-bottom: 7rem;
  letter-spacing: -0.5px;
  font-size: 0.95rem;

  &:after {
    content: '';
    position: absolute;
    top: 100%;
    margin-top: 2rem;
    left: 50%;
    width: 8rem;
    height: 0.5px;
    transform: translateX(-50%);
    background: linear-gradient(120deg, #bf953f, #fee49b, #b38728);
  }
}

.richer.hero {
  position: relative;
  height: 260px;
  z-index: 1;
  background-color: rgba(#fff, 0.85);
  box-shadow: 2px 2px 6px rgba(#000, 0.05);

  .button:focus, .button--active {
    border-color: #bf953f;
  }
  .button--active {
    color: #bf953f;

    &:after {display: none;}
  }

  .page.dark & {
    background-color: rgba(rgb(34, 34, 34), 0.8);
    box-shadow: 2px 2px 6px rgba(#000, 0.2);

    .button:focus, .button--active {
      border-color: #967738;
    }

    .button--active {color: #967738;}
  }
}
</style>
