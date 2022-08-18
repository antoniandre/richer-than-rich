<script setup>
import { toRaw, inject } from 'vue'
import * as actions from './actions'

const { focus, wrapSelection, unwrapSelection, inputField } = inject('editor')
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
    return { ...availableButtons[button.name], name: button.name }
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

  // Notes:
  // = multi-ranges are only supported on Firefox for now.
  // - no range means the content has never been focused.
  if (sel.rangeCount !== 1) return focus() // Not handled.

  button.active = !button.active

  // Perform a specific action if any.
  if (button.action && typeof actions[button.action] === 'function') {
    actions[button.action]({ button, inputField, sel, e })
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
    span.separator(v-if="button.name === '|'")
    button.button(
      v-else
      @click="action($event, button)"
      type="button"
      :title="button.label"
      :class="{ [`button--${button.name} ${button.icon || `i-${button.name}`}`]: true, 'button--active': button.active }"
      :style="{ fontSize: button.size ? `${button.size}%` : null }")
      span {{ button.label }}
</template>
