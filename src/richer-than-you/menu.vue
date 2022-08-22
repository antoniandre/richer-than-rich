<script setup>
import { toRaw, inject } from 'vue'
import * as actions from './actions'
import * as utils from './dom-utils'

const { focus, process, wrapSelection, unwrapSelection, inputField } = inject('editor')
let { menuButtons } = inject('editor')

const props = defineProps({
  userButtons: { type: Object },
  shortcuts: { type: Object }
})

const emit = defineEmits(['button-click'])

// Default tag: span.
// Default icon: i-[button-name].
// Default icon size: 100%.
// Default shortcut: none, except for bold, italic, underline, strikethrough.
const availableButtons = {
  'font-size': { label: 'Text size' },
  'font-family': { label: 'Font' },
  'text-color': { label: 'Text color' },
  'background-color': { label: 'Background color' },
  bold: { tag: 'strong', label: 'Bold', shortcut: 'meta+b' },
  italic: { tag: 'em', label: 'Italic', shortcut: 'meta+i' },
  underline: { label: 'Underline', shortcut: 'meta+u' },
  strikethrough: { label: 'Strikethrough', size: 130, shortcut: 'meta+s' },
  'list-ul': { label: 'Bulleted list', action: 'list' },
  'list-ol': { label: 'Numbered list', action: 'list' },
  'align-left': { label: 'Align left', action: 'align' },
  'align-center': { label: 'Align center', action: 'align' },
  'align-right': { label: 'Align right', action: 'align' },
  'align-justify': { label: 'Align justify', action: 'align' },
  unindent: { label: 'Unindent', action: 'indent' },
  indent: { label: 'indent', action: 'indent' },
  subscript: { tag: 'sub', label: 'Subscript' },
  superscript: { tag: 'sup', label: 'Superscript' },
  link: { tag: 'a', label: 'Link' },
  image: { tag: 'img', label: 'Photo' },
  table: { tag: 'table', label: 'Table', action: 'table' },
  code: { tag: 'code', label: 'Code' },
  undo: { label: 'Undo' },
  redo: { label: 'Redo' },
  'clear-format': { code: 'x', label: 'Clear format' },
}

const defaultButtons = [
  'bold',
  'italic',
  'underline',
  'strikethrough',
  '|', // Add a '|' in the array to create a separator.
  'list-ul',
  'list-ol',
  '|',
  'align-left',
  'align-center',
  'align-right',
  'align-justify'
]

const initializeButtons = (() => {
  menuButtons = [] // Reset for HMR.

  let requestedButtons = props.userButtons.length ? props.userButtons : defaultButtons

  requestedButtons = requestedButtons.map(button => {
    if (typeof button === 'string') button = { name: button }
    return { ...availableButtons[button.name], ...button, name: button.name }
  })

  menuButtons.push(...requestedButtons.map(button => {
    // Populate the shortcuts map.
    if (button.shortcut) props.shortcuts[button.shortcut] = button.name

    return {
      ...button,
      active: false
    }
  }))
})()

/**
 * On button click, perform an action on the content by calling one of the above methods.
 *
 * @param {Object} e the event that triggered the action.
 * @param {Object} button the clicked button, or matched button from action shortcut.
 */
const action = (e, button) => {
  focus() // Focus the input field first.
  const sel = window.getSelection()

  emit('button-click', { e, button: toRaw(button) })

  button.active = !button.active // @todo: improve this rule.

  // Perform a specific action if any.
  if (button.action && typeof actions[button.action] === 'function') {
    let nearestBlockEl = utils.getNearestBlockNode(sel.baseNode, sel.baseOffset, inputField.value)
    actions[button.action]({ button, inputField: inputField.value, sel, e, nearestBlockEl })
    process()
  }

  // If no action found, just wrap the selection with the button tag if given or span otherwise.
  else {
    // No selection (isCollapsed), just a caret.
    if (sel.isCollapsed) {}

    // Selection with a range.
    else {
      if (button.active) wrapSelection(sel, button)
      else unwrapSelection(sel, button)
    }
  }

  focus() // Re-focus the editor after a button click.

  emit('button-click', { e, button: toRaw(button) })
}

defineExpose({ action })
</script>

<template lang="pug">
.richer__menu
  template(v-for="(button, i) in menuButtons" :key="i")
    span.richer__separator(v-if="button.name === '|'")
    slot(
      v-else
      name="button"
      :button="button"
      :action="() => action($event, button)"
      :classes="{ [`richer__button--${button.name} ${button.icon || `i-${button.name}`}`]: true, 'richer__button--active': button.active }")
      button.richer__button(
        @click="action($event, button)"
        type="button"
        :title="button.label"
        :class="{ [`richer__button--${button.name} ${button.icon || `i-${button.name}`}`]: true, 'richer__button--active': button.active }"
        :style="{ fontSize: button.size ? `${button.size}%` : null }")
        span {{ button.label }}
</template>

<style lang="scss">
.richer__menu {
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  border-bottom: 1px solid rgba(#fff, 0.05);
  background-color: rgba(#000, 0.05);
  padding: 4px 6px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  transition: 0.4s ease-in-out;
}

.richer__button {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 26px;
  width: 26px;
  color: rgba(#000, 0.65);
  font-size: 1rem;
  border: 1px solid rgba(#000, 0.1);
  border-radius: 4px;
  margin: 2px;
  cursor: pointer;
  background-color: transparent;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  transition: 0.15s ease-in-out;

  &:hover, &--active {border-color: rgba(#000, 0.06);}
  &:focus {
    border-color: rgba(#000, 0.4);
    outline: none;
  }
  &:active {
    border-color: rgba(#000, 0.06);
    background-color: rgba(#000, 0.1);
  }

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

.richer__separator {
  display: flex;
  align-self: stretch;
  width: 1px;
  margin: 6px 4px;
  background: rgba(#000, 0.15);
}

// Dark mode.
// --------------------------------------------------------
.richer--dark {
  .richer__menu {background-color: rgba(#fff, 0.05);}

  .richer__button {
    border-color: rgba(#fff, 0.1);
    color: rgba(#fff, 0.65);

    &:hover, &--active {border-color: rgba(#fff, 0.06);}
    &:focus {border-color: rgba(#fff, 0.4);}
    &:active {
      border-color: rgba(#fff, 0.06);
      background-color: rgba(#fff, 0.1);
    }

    &:after {background-color: rgba(#fff, 0.06);}
  }

  .richer__separator {background: rgba(#fff, 0.15);}
}
</style>
