<script setup>
import { onMounted, ref, provide } from 'vue'
import * as utils from './dom-utils'
import { process, processExternal } from './content-processing'
import Menu from './menu.vue'
import './scss/index.scss'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Type something...' },
  buttons: { type: Array, default: () => [] },
  darkMode: { type: [Boolean, String] }, // True, false, or 'auto'.
  contentProps: { type: Object, default: () => ({}) }
})

const emit = defineEmits([
  'focus',
  'blur',
  'keydown',
  'keyup',
  'input',
  'click',
  'paste',
  'html',
  'button-click'
])

const menu = ref(null)
const inputField = ref(null)
let dark = ref(props.darkMode)

const shortcuts = {}

const menuButtons = ref([])
const placeholder = ref(props.placeholder)
const content = ref({
  initial: props.modelValue || '',
  processed: props.modelValue || '',
  isEmpty: true,
  isProcessed: false
})

/**
 * Wrap the selected content with the clicked button generated tag.
 * This will modify the innerHTML of the contenteditable, then call process() to cleanup,
 * and emit the clean markup.
 */
const wrapSelection = (sel, button) => {
  const range = sel.getRangeAt(0)
  const newParent = document.createElement(button.tag || 'span')
  if (!button.tag || button.tag === 'span') newParent.className = `r-${button.name}`

  try {
    // Can't surround the content if the selection is cutting a DOM element (across 2 nodes).
    range.surroundContents(newParent)
  }
  // If selection is across 2 nodes, cut the selection, wrap it, then reinject in place.
  catch (e) {
    // This will collapse the range to no char and create an HTML fragment.
    const fragment = range.extractContents()

    // Wrap the fragment and reinject at caret position.
    newParent.appendChild(fragment)
    range.insertNode(newParent)
  }

  process({ inputField: inputField.value, content: content.value })
}

/**
 * Unwrap the selected content from the clicked button wrapping markup.
 * This will modify the innerHTML of the contenteditable, then call process() to cleanup,
 * and emit the clean markup.
 *
 * Complexity:
 * - For selection `text [<bold>text</bold>] text`, we can unwrap with the selection range only.
 * - For selection `<bold>text [text] text</bold>`, we can't unwrap bold from the selection range:
 *   We need to close bold before the selection and reopen after it.
 * For that, create 3 fragments: 1 before selection, 1 selection, 1 after selection.
 */
const unwrapSelection = (sel, button) => {
  const baseBlockNode = utils.getNearestBlockNode(sel.baseNode, sel.baseOffset, inputField.value)
  const extentBlockNode = utils.getNearestBlockNode(sel.extentNode, sel.extentOffset, inputField.value)

  // The range starting from the beginning of the selection block node and until the selection.
  const startRange = new Range()
  startRange.setStart(baseBlockNode, 0)
  startRange.setEnd(sel.baseNode, sel.baseOffset)
  const startFragment = startRange.extractContents()

  // The selection range.
  const middleRange = sel.getRangeAt(0)
  const middleFragment = middleRange.extractContents()

  // On the selection, remove the tag of the selected button (there could be multiple).
  const selectorTag = button.tag || 'span'
  const selectorClass =  selectorTag === 'span' ? `.r-${button.name}` : ''
  middleFragment.querySelectorAll(selectorTag + selectorClass).forEach(node => {
    node.replaceWith(...node.childNodes)
  })

  // The range starting after the selection until the end of the block node of the selection.
  const endRange = new Range()
  // Sets the end of the range correctly: just before the block node closing tag.
  endRange.selectNodeContents(extentBlockNode)
  endRange.setStart(sel.extentNode, sel.extentOffset)
  const endFragment = endRange.extractContents()

  // sel.removeAllRanges()
  // sel.addRange(endRange)
  // debugger

  // console.log({ startFragment, middleFragment, endFragment })

  const fullFragment = new DocumentFragment()

  // Inject selection markers before the DOM changes.
  const selMarkerStart = document.createElement('span')
  selMarkerStart.className = 'richer__selection-start'
  const selMarkerEnd = document.createElement('span')
  selMarkerEnd.className = 'richer__selection-end'

  // Assemble the final HTML containing the selection markers.
  fullFragment.append(
    ...startFragment.childNodes,
    selMarkerStart,
    ...middleFragment.childNodes,
    selMarkerEnd,
    ...endFragment.childNodes
  )
  // console.log(fullFragment)
  // debugger

  // Reinject the final HTML at caret position.
  const fullRange = new Range()
  fullRange.setStart(startRange.startContainer, 0)
  fullRange.setEnd(endRange.endContainer, endRange.endOffset)
  fullRange.insertNode(fullFragment)

  // Cleanup.
  utils.restoreSelection(inputField.value)
  // process() is also called after actions to cleanup and normalize text nodes.
}

/**
 * When meta key is pressed, handle keyboard shortcuts and prevent default browser action.
 */
const onKeydown = e => {
  // On metaKey+[key] press, perform an action of the matching shortcut.
  if (e.metaKey) {
    const matchedAction = shortcuts[`meta+${e.key}`]
    const matchedButton = menuButtons.value.find(item => item.name === matchedAction)
    if (matchedAction && matchedButton) {
      // Call the menu component's action method via Vue ref.
      menu.value.action(e, matchedButton)
      // Prevent the browser default selection replacements bold, italic, etc.
      e.preventDefault()
    }
  }

  emit('keydown', { e, html: content.value.processed })
}

const onKeyup = e => {
  // processed.value = false
  emit('keyup', { e, html: content.value.processed })
}

const onClick = e => {
  emit('click', { e, html: content.value.processed })
}

const onInput = e => {
  process({ inputField: inputField.value, content: content.value })
  emit('input', { e, html: content.value.processed })
}

const onFocus = e => {
  // On focus, if there is no content at all, add a `p` ready to type in.
  const p = document.createElement('p')
  if (!inputField.value.innerHTML) inputField.value.appendChild(p)

  emit('focus', { e, html: content.value.processed })
}

const onBlur = e => {
  emit('blur', { e, html: content.value.processed })
}

const onPaste = e => {
  emit('paste', { e, html: content.value.processed })
}

// Public external method.
const focus = () => inputField.value.focus()

onMounted(() => {
  if (props.darkMode === 'auto') {
    dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  processExternal({ inputField: inputField.value, content: content.value })
})

provide(
  'editor',
  { focus, process, wrapSelection, unwrapSelection, inputField, menuButtons, content }
)
</script>

<template lang="pug">
.richer(:class="{ 'richer--dark': darkMode }")
  Menu(
    ref="menu"
    v-model:buttons="menuButtons"
    :user-buttons="props.buttons"
    :shortcuts="shortcuts")
    template(#button="props")
      slot(name="button" v-bind="props")

  .content-wrap
    .richer__content(
      ref="inputField"
      contenteditable
      @input="onInput"
      @click="onClick"
      @keyup="onKeyup"
      @keydown="onKeydown"
      @focus="onFocus"
      @blur="onBlur"
      @paste="onPaste"
      v-bind="props.contentProps"
      v-html="content.initial")
    .richer__placeholder(v-if="placeholder && content.isEmpty") {{ props.placeholder }}
</template>

<style lang="scss">
.richer {
  display: flex;
  flex-direction: column;
  text-align: left;
  border: 1px solid rgba(#000, 0.05);
  border-radius: 8px;
  background: rgba(#fff, 0.85);
  color: #333;
  transition: 0.4s ease-in-out;

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
    padding: 12px;
    outline: none;
    flex-grow: 1;
  }

  // Dark mode.
  // ------------------------------------------------------
  &--dark {
    color: #ccc;
    border-color: rgba(#fff, 0.05);
    background-color: rgba(#000, 0.05);
  }
}
</style>
