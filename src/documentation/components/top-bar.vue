<script setup>
defineProps({
  darkMode: Boolean
})

defineEmits(['update:dark-mode'])
</script>

<template lang="pug">
.top-bar
  .theme-switch(@click="$emit('update:dark-mode', !darkMode)")
    button.button.i-moon(:class="{ 'button--active': darkMode }")
    button.button.i-sun(:class="{ 'button--active': !darkMode }")
    .slider
</template>

<style lang="scss" scoped>
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 48px;
  background: rgba($page-bg-color-light, 0.3);
  backdrop-filter: blur(6px);
  z-index: 10;
  transition: $switch-mode-transition;
  @include backdrop-blur(6px, rgba($page-bg-color-light, 0.8), rgba(#fff, 0));
  box-shadow: 0 0 1px rgba($page-bg-color-light, 0.2);
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
.page.dark {
  .top-bar {
    @include backdrop-blur(6px, rgba($page-bg-color-light, 0.8), rgba(#fff, 0));
    box-shadow: 0 0 12px rgba($page-bg-color-dark, 0.15);
  }

  .theme-switch {
    box-shadow: 1px 1px 3px #403216 inset;

    .button {color: rgba(#000, 0.5);}
    .button--active {color: hsl(40, 30%, 53%)}
    .slider {background-color: $page-bg-color-dark;}
  }
}
</style>
