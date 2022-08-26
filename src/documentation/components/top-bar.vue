<script setup>
const props = defineProps({
  darkMode: Boolean
})

const switchTheme = () => {
  document.body.classList.toggle('dark')
  emit('update:dark-mode', !props.darkMode)
}

const emit = defineEmits(['update:dark-mode'])
</script>

<template lang="pug">
.top-bar
  .theme-switch(
    @click="switchTheme"
    @keypress.enter="switchTheme"
    @keypress.space.prevent="switchTheme"
    tabindex="0"
    role="button")
    button.button.i-moon(:class="{ 'button--active': darkMode }" tabindex="-1")
    button.button.i-sun(:class="{ 'button--active': !darkMode }" tabindex="-1")
    .slider
</template>

<style lang="scss" scoped>
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 48px;
  background: rgba($light-main-bg-color, 0.3);
  backdrop-filter: blur(6px);
  z-index: 10;
  transition: $switch-mode-transition;
  @include backdrop-blur(6px, rgba($light-main-bg-color, 0.8), rgba(#fff, 0));
  box-shadow: 0 0 1px rgba($light-main-bg-color, 0.2);
}

.theme-switch {
  position: absolute;
  top: 10px;
  right: 10px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px;
  border-radius: 99rem;
  line-height: 0;
  background-color: rgba(#bf953f, 0.5);
  box-shadow: 1px 1px 3px #973 inset;
  cursor: pointer;
  outline: 1px solid transparent;
  transition: 0.3s ease-in-out;


  &:focus {box-shadow: 0 0 3px 2px #e1a116a3;}

  .button {
    display: inline-flex;
    font-size: 18px;
    line-height: 1;
    margin: 2px;
    border: none;
    background: none;
    z-index: 1;
    color: rgba(#fff, 1);
    cursor: pointer;
    transition: 0.3s ease-in-out;

    &--active {color: #bf953f;}
  }

  .slider {
    position: absolute;
    border-radius: 99rem;
    left: 2px;
    height: 22px;
    width: 22px;
    background-color: rgba(#fff, 1);
    box-shadow: 0 0 3px rgba(#000, 0.15);
    transition: 0.3s ease-in-out;
  }

  .i-sun.button--active ~ .slider {transform: translateX(100%);}
}

// Dark theme.
// --------------------------------------------------------
.dark {
  .top-bar {
    @include backdrop-blur(6px, rgba($light-main-bg-color, 0.8), rgba(#fff, 0));
    box-shadow: 0 0 12px rgba($dark-main-bg-color, 0.15);
  }

  .theme-switch {
    box-shadow: 1px 1px 3px #403216 inset;
    &:focus {outline-color: #b9a273;}

    .button {color: rgba(#000, 0.5);}
    .button--active {color: #ab9363;}
    .slider {background-color: $dark-main-bg-color;}
  }
}
</style>
