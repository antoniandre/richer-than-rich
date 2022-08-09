<script setup>
import { ref } from 'vue'

defineProps({
  modelValue: { String, default: '' }
})

let inputField = ref(null)
const buttons = {
  bold: { code: 'b', tag: 'strong', label: 'b' },
  italic: { code: 'i', tag: 'em', label: 'i' },
  underline: { code: 'u', tag: 'span', label: 'u' },
  strikethrough: { code: 's', tag: 'span', label: 's' }
}
const menuButtons = ref([])

// Initialize the buttons.
menuButtons.value.push(...Object.entries(buttons).map(([name, button]) => ({
  ...button,
  name,
  active: false
})))

const action = button => {
  const sel = window.getSelection()
  console.log(sel, button)

  inputField.value.focus() // Re-focus the editor after a button click.
}
</script>

<template lang="pug">
.richer
  .richer__menu
    button.button(
      v-for="(button, i) in menuButtons"
      :key="i"
      @click="action(button)"
      type="button"
      :class="{ [`button--${button.name} ${button.name}`]: true, 'button--active': button.active }").
      {{ button.label }}
  .richer__content(ref="inputField" contenteditable)
</template>

<style lang="scss">
$highlight-color: #bf953f;

.richer {
  border: 1px solid rgba(#000, 0.05);
  border-radius: 4px;
  background: rgba(#fff, 0.85);
  color: #333;
  display: flex;
  flex-direction: column;
  text-align: left;

  &__menu {
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
    border-bottom: 1px solid rgba(#fff, 0.05);
    background-color: rgba(#000, 0.05);
    padding: 4px 8px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    .button {
      font-size: 1rem;
      height: 100%;
      width: 1.8rem;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-left: 4px;
      cursor: pointer;
      background-color: transparent;
      transition: background-color 0.2s ease-in-out;
      -webkit-tap-highlight-color: transparent;
      user-select: none;

      &:first-child {margin-left: 0;}
      &:hover {
        background-color: rgba(0, 0, 0, 0.04);
      }
      &:active, &--active {
        background-color: rgba(0, 0, 0, 0.08);
      }
      &--active {
        background-color: rgba(0, 0, 0, 0.04);
        border-color: $highlight-color;
      }
    }
  }

  &__content {
    padding: 12px;
    outline: none;
    flex-grow: 1;
  }
}

@media (prefers-color-scheme: dark) {
  .richer {
    color: #ccc;
    border-color: rgba(#fff, 0.05);
    background-color: rgba(#000, 0.05);

    &__menu {
      background-color: rgba(#fff, 0.05);
    }
  }
}
</style>
