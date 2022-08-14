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
  .header__content.container
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
  display: flex;
  place-items: center;
  position: relative;
  overflow: hidden;
  padding-bottom: 250px;

  &:before, &:after {
    content: "";
    position: absolute;
    bottom: -10vh;
    left: -5vw;
    right: -5vw;
    height: 32vh;
    border-radius: 0 80% 0 0;
    transform: rotate(-4deg);
    transition: $switch-mode-transition;
  }

  &:before {
    background: #bf953f linear-gradient(45deg, #bf953f, #fee49b);
    border-radius: 0 71% 0 0;
    transform: rotate(-2deg) translateY(-1%);
  }

  &:after {background: $page-bg-color-dark;}

  .header__content {
    height: 100vh;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }

  .wrap {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
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
  background-color: rgba($page-bg-color-light, 0.85);
  box-shadow: 2px 2px 6px rgba(#000, 0.05);

  &, .richer__menu {transition: $switch-mode-transition;}

  .button:focus, .button--active {
    border-color: #bf953f;
  }
  .button--active {
    color: #bf953f;

    &:after {display: none;}
  }
}

// Dark theme.
// --------------------------------------------------------
.page.dark {
  header:after {background: $page-bg-color-light;}

  .richer.hero {
    background-color: rgba(rgb(34, 34, 34), 0.8);
    box-shadow: 2px 2px 6px rgba(#000, 0.2);

    .button:focus, .button--active {border-color: #967738;}

    .button--active {color: #967738;}
  }
}
</style>
