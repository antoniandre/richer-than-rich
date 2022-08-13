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
