<script setup>
import { onMounted, ref, provide } from 'vue'
import * as utils from './dom-utils'
import Menu from './menu.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
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
let processed = ref(false)

// Processing rules.
const rules = {
  replacements: {
    b: { tag: 'strong', class: 'bold' },
    i: { tag: 'em', class: 'italic' },
    u: { tag: 'span', class: 'underline' },
    s: { tag: 'span', class: 'strikethrough' },
    div: { tag: 'p', class: 'paragraph' }
  }
}

const shortcuts = {}

const menuButtons = ref([])
const placeholder = ref(props.placeholder)
const content = ref({ initial: props.modelValue || '', processed: props.modelValue || '' })

/**
 * Wrap the selected content with the clicked button generated tag.
 * This will modify the innerHTML of the contenteditable, then call process() to cleanup,
 * and emit the clean markup.
 */
const wrapSelection = (sel, button) => {
  const range = sel.getRangeAt(0)
  const newParent = document.createElement(button.tag || 'span')
  newParent.className = `r-${button.name}`

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

  process(null, sel)
}

/**
 * Unwrap the selected content from the clicked button generated markup.
 * This will modify the innerHTML of the contenteditable, then call process() to cleanup,
 * and emit the clean markup.
 */
const unwrapSelection = (sel, button) => {
  const selectionRange = sel.getRangeAt(0)
  const { startContainer, startOffset, endContainer, endOffset }= selectionRange

  // Complexity:
  // - For selection `text [<bold>text</bold>] text`, we can unwrap with the selection range only.
  // - For selection `<bold>text [text] text</bold>`, we can't unwrap bold from the selection range:
  //   We need to close bold before the selection and reopen after it.
  // For that, create 3 fragments: 1 before selection, 1 selection, 1 after selection.
  const startRange = new Range()
  startRange.selectNodeContents(inputField.value)
  startRange.setEnd(startContainer, startOffset)
  // const startFragment = startRange.extractContents()
  // startRange.insertNode(startFragment)

  // sel.removeAllRanges()
  // sel.addRange(startRange)

  const endRange = new Range()
  endRange.selectNodeContents(inputField.value)
  endRange.setStart(endContainer, endOffset)
  // const endFragment = endRange.extractContents()
  // endRange.insertNode(endFragment)

  // sel.removeAllRanges()
  // sel.addRange(endRange)

  const startFragment = startRange.extractContents()
  startRange.insertNode(startFragment)

  const endFragment = endRange.extractContents()
  endRange.insertNode(endFragment)

  const fragment = selectionRange.extractContents()
  const foundTagInSelection = fragment.querySelectorAll(`${button.tag || 'span'}.${button.name}`)
  if (foundTagInSelection.length) {
    // Cleanup the selection fragment.
    foundTagInSelection.forEach(node => node.replaceWith(...node.childNodes))
  }
  selectionRange.insertNode(fragment)

  if (selectionRange.commonAncestorContainer.matches(`${button.tag || 'span'}.${button.name}`)) {
    // This loses the selection because we unwrap the node in which the selection is. :/
    // selectionRange.commonAncestorContainer.replaceWith(...selectionRange.commonAncestorContainer.childNodes)

    selectionRange.selectNode(selectionRange.commonAncestorContainer)
    const fragment2 = selectionRange.extractContents()

    const foundTagInSelection2 = fragment2.querySelectorAll(`${button.tag || 'span'}.${button.name}`)
    if (foundTagInSelection2.length) {
      // Cleanup the selection fragment.
      foundTagInSelection2.forEach(node => node.replaceWith(...node.childNodes))
    }
    selectionRange.insertNode(fragment2)
  }
}

/**
 * Cleanup the HTML markup:
 * - replace tags following the replacements rules
 * - glue back the text nodes together
 * - delete nested identical tags
 * - delete empty tags?
 * - merge consecutive identical tags
 */
const process = (e, sel) => {
  sel = sel || window.getSelection()

  inputField.value.normalize() // Glue the text nodes back together.

  // Check the content and wrap it in a `p` if the content is only text.
  const inputChildren = inputField.value.childNodes
  inputChildren.forEach(node => {
    if (node.nodeType === 3) utils.wrapNode(node, 'p', inputField.value)
  })

  // Replace tags in full tree following the replacements rule
  // ---------------------------------------------------------
  // -> Drawback: Need to reapply selection after replacements.
  const replacementsSelector = Object.keys(rules.replacements).join(',')
  inputField.value.querySelectorAll(replacementsSelector).forEach(node => {
    const { tag, class: Class } = rules.replacements[node.tagName.toLowerCase()]
    const newTag = document.createElement(tag)
    newTag.className = Class
    newTag.innerHTML = node.innerHTML
    node.replaceWith(newTag)
  })

  /*
  2nd WAY: REPLACE IN THE RETURNED STRING ONLY.
  content.value.processed = inputField.value.innerHTML.replace(/<(\/?)(i|b|u|s)[^>]*>/gi, (m0, slash, tag) => {
    let cssClass

    switch (tag) {
      case 'b':
        tag = 'strong'
        break
      case 'i':
        tag = 'em'
        break
      case 'u':
        tag = 'span'
        cssClass = 'underline'
        break
      case 's':
        tag = 'span'
        cssClass = 'strikethrough'
        break
    }

    return `<${slash}${tag}${slash || !cssClass ? '' : ` class="${cssClass}"`}>`
  })
  */

  inputField.value.normalize() // Recursively cleanup text nodes (merge and delete empty ones).
  recursiveCleanup(inputField.value.children)
  inputField.value.normalize() // Recursively cleanup text nodes (merge and delete empty ones).

  content.value.processed = inputField.value.innerHTML
  processed.value = true
}

/**
 * Recursive cleanup:
 * - remove empty nodes? (maybe set a rule for this)
 * - remove nested duplicates
 * - merge tween nodes
 **/
const recursiveCleanup = htmlCollection => {
  // Remove empty nodes.

  // Remove nested duplicates.

  // Merge tween nodes.

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
  process(e, window.getSelection())
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

  process()
})

provide('editor', { focus, process, wrapSelection, unwrapSelection, inputField, menuButtons })
</script>

<template lang="pug">
.richer(:class="{ 'richer--dark': darkMode }")
  Menu(
    ref="menu"
    v-model:buttons="menuButtons"
    :user-buttons="props.buttons"
    :shortcuts="shortcuts")

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
    .richer__placeholder(v-if="placeholder && !content.processed") {{ props.placeholder }}
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

// Richer content styling classes.
// --------------------------------------------------------
.r {
  &-underline {text-decoration: underline;}
  &-strikethrough {text-decoration: line-through;}

  &-align-left {text-align: left;}
  &-align-center {text-align: center;}
  &-align-right {text-align: right;}
  &-align-justify {text-align: justify;}

  @for $i from 1 through 8 {
    &-indent-#{$i} {padding-left: 3em * $i;}
  }
}
</style>
