<script setup>
import { ref } from 'vue'
import Editor from '@/richer-than-rich/index.vue'

defineProps({
  darkMode: Boolean
})

const editorContent = ref(`
  <h2 class="r-align-center">Hi. I\'m r$$$ch.</h2>
  <p class="r-align-center"><br><br>Wanna try me?</p>
`)
</script>

<template lang="pug">
header
  .header__content.container
    h1
      | Richer than rich
      img.dollar(src="/dollar.svg")
    p.catchphrase $. Another modern rich text editor. This one's Richer than rich.

    p.wip 🚧 &nbsp; WORK IN PROGRESS &nbsp; 🚧

    editor.hero(
      :model-value="editorContent"
      placeholder="Write something..."
      :dark-mode="darkMode")

  //- .particles
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

  &:after {background: $dark-main-bg-color;}

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
  position: relative;
  font-size: 3.2em;
  line-height: 1.1;
  margin-bottom: 4px;
  letter-spacing: 1.5px;
}

.dollar {
  position: absolute;
  top: -6px;
  left: 100%;
  width: 28px;
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
  background-color: rgba($light-main-bg-color, 0.85);
  box-shadow: 2px 2px 6px rgba(#000, 0.05);

  &, .richer__menu {transition: $switch-mode-transition;}

  :deep(.richer__separator) {
    margin: 0 0.5rem;
    width: 0;
  }
  :deep(.richer__button:focus), :deep(.richer__button--active) {border-color: #bf953f;}
  :deep(.richer__button--active) {
    color: #bf953f;

    &:after {display: none;}
  }
}

.wip {
  color: orange;
  margin-bottom: 3rem;
  font-size: 0.9rem;
}

// Dark theme.
// --------------------------------------------------------
.dark {
  header:after {background: $light-main-bg-color;}

  .richer.hero {
    background-color: rgba(rgb(34, 34, 34), 0.8);
    box-shadow: 2px 2px 6px rgba(#000, 0.2);

    :deep(.richer__button:focus), :deep(.richer__button--active) {border-color: #967738;}

    :deep(.richer__button--active) {color: #967738;}
  }
}
</style>
