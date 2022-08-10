<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: { String, default: '' },
  placeholder: { String, default: '' }
})

let inputField = ref(null)
const buttons = {
  bold: { code: 'b', tag: 'strong', label: 'Bold' },
  italic: { code: 'i', tag: 'em', label: 'Italic' },
  underline: { code: 'u', tag: 'span', label: 'Underline' },
  strikethrough: { code: 's', tag: 'span', label: 'Strikethrough' },
  'strikethrough-1': { code: 's', tag: 'span', label: 'Strikethrough' },
  'align-left': { code: '|<', tag: 'span', label: 'Align left' },
  'align-center': { code: '|-|', tag: 'span', label: 'Align center' },
  'align-right': { code: '>|', tag: 'span', label: 'Align right' },
  'align-justify': { code: '||', tag: 'span', label: 'Align justify' },
  indent: { code: '>', tag: 'span', label: 'indent' },
  unindent: { code: '<', tag: 'span', label: 'Unindent' },
  'font-size': { code: '||', tag: 'span', label: 'Text size' },
  'text-color': { code: '||', tag: 'span', label: 'Text color' },
  subscript: { code: '_', tag: 'span', label: 'Subscript' },
  superscript: { code: 'º', tag: 'span', label: 'Superscript' },
  code: { code: '</>', tag: 'span', label: 'Code' },
  link: { code: '∞', tag: 'span', label: 'Link' },
  'link-1': { code: '∞', tag: 'span', label: 'Link' },
  'list-ul': { code: '-', tag: 'span', label: 'Bulleted list' },
  'list-ol': { code: '.', tag: 'span', label: 'Numbered list' },
  table: { code: '[]', tag: 'span', label: 'Table' },
  undo: { code: '<-', tag: 'span', label: 'Undo' },
  redo: { code: '->', tag: 'span', label: 'Redo' },
  image: { code: '*', tag: 'span', label: 'Photo' },
  'clear-format': { code: 'x', tag: 'span', label: 'Clear format' },
}
const menuButtons = ref([])
const placeholder = ref(props.placeholder)
const content = ref({
  initial: props.modelValue,
  processed: props.modelValue
})

// Initialize the buttons.
menuButtons.value.push(...Object.entries(buttons).map(([name, button]) => ({
  ...button,
  name,
  active: false
})))

const action = button => {
  const sel = window.getSelection()
  console.log(sel, button)

  focus() // Re-focus the editor after a button click.
}

const process = e => {
  const sel = window.getSelection()
  console.log('process', { e, sel })

  // Process the HTML here.
  content.value.processed = inputField.value.innerHTML
}

const onClick = e => {
  const sel = window.getSelection()
  console.log('onClick', { e, sel })
}

const onKeyup = e => {
  const sel = window.getSelection()
  console.log('onKeyup', { e, sel })
}

const onFocus = e => {
  const sel = window.getSelection()
  console.log('onFocus', { e, sel })
}

const onBlur = e => {
  const sel = window.getSelection()
  console.log('onBlur', { e, sel })
}

const onPaste = e => {
  const sel = window.getSelection()
  console.log('onPaste', { e, sel })
}

// Public external method.
const focus = () => {
  inputField.value.focus()
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
      :title="button.label"
      :class="{ [`button--${button.name} i-${button.name}`]: true, 'button--active': button.active }")
      span {{ button.label }}
  .content-wrap
    .richer__content(
      ref="inputField"
      contenteditable
      @input="process"
      @click="onClick"
      @keyup="onKeyup"
      @focus="onFocus"
      @blur="onBlur"
      @paste="onPaste"
      v-html="content.initial")
    .richer__placeholder(v-if="placeholder && !content.processed") {{ props.placeholder }}
</template>

<style lang="scss">
$highlight-color: #bf953f;

.richer {
  display: flex;
  flex-direction: column;
  text-align: left;
  border: 1px solid rgba(#000, 0.05);
  border-radius: 8px;
  background: rgba(#fff, 0.85);
  color: #333;

  &__menu {
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
    border-bottom: 1px solid rgba(#fff, 0.05);
    background-color: rgba(#000, 0.05);
    padding: 4px 6px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    .button {
      position: relative;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      height: 26px;
      width: 26px;
      color: rgba(#000, 0.6);
      font-size: 1rem;
      border: 1px solid rgba(#000, 0.1);
      border-radius: 4px;
      margin: 2px;
      cursor: pointer;
      background-color: transparent;
      transition: background-color 0.2s ease-in-out;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      transition: 0.15s ease-in-out;

      &:hover, &--active {border-color: rgba(#000, 0.06);}
      &:focus {
        border-color: rgba(#000, 0.4);
        outline: none;
      }
      &:active {border-color: rgba(#000, 0.06);}

      &:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(#000, 0.06);
        border-radius: 99rem;
        transform: scale(0.3);
        opacity: 0;
        transition: inherit;
      }

      &:hover:after, &:active:after, &--active:after {
        opacity: 1;
        transform: scale(1);
        border-radius: 3px;
      }

      span {display: none;}
    }
  }

  .bold {font-weight: bold;}
  .italic {font-style: italic;}
  .underline {text-decoration: underline;}
  .strikethrough {text-decoration: line-through;}

  .content-wrap {
    position: relative;
    display: flex;
    flex-grow: 1;
    overflow: auto;
  }

  &__placeholder {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 12px;
    pointer-events: none;
    opacity: 0.5;
  }

  &__content {
    text-align-last: left;
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

    .button {
      border-color: rgba(#fff, 0.1);
      color: rgba(#fff, 0.6);

      &:hover, &--active {border-color: rgba(#fff, 0.06);}
      &:focus {
        border-color: rgba(#fff, 0.4);
        outline: none;
      }
      &:active {border-color: rgba(#fff, 0.06);}

      &:after {background-color: rgba(#fff, 0.06);}
    }
  }
}
</style>
