<script setup>
import { onMounted, ref, toRaw } from 'vue'

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
  'keyup',
  'input',
  'click',
  'paste',
  'html',
  'button-click'
])

let dark = ref(props.darkMode)
let inputField = ref(null)
// Default tag: span.
// Default icon: i-[button-name].
// Default icon size: 100%.
const availableButtons = {
  'font-size': { label: 'Text size' },
  'font-family': { label: 'Font' },
  'text-color': { label: 'Text color' },
  'background-color': { label: 'Background color' },
  bold: { code: 'b', tag: 'strong', label: 'Bold' },
  italic: { code: 'i', tag: 'em', label: 'Italic' },
  underline: { code: 'u', label: 'Underline' },
  strikethrough: { label: 'Strikethrough', size: 130 },
  'list-ul': { label: 'Bulleted list' },
  'list-ol': { label: 'Numbered list' },
  'align-left': { label: 'Align left' },
  'align-center': { label: 'Align center' },
  'align-right': { label: 'Align right' },
  'align-justify': { label: 'Align justify' },
  indent: { label: 'indent' },
  unindent: { label: 'Unindent' },
  subscript: { tag: 'sub', label: 'Subscript' },
  superscript: { tag: 'sup', label: 'Superscript' },
  link: { tag: 'a', label: 'Link' },
  image: { tag: 'img', label: 'Photo' },
  table: { tag: 'table', label: 'Table' },
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

const menuButtons = ref([])
const placeholder = ref(props.placeholder)
const content = ref({
  initial: props.modelValue || '',
  processed: props.modelValue || ''
})

const initializeButtons = (() => {
  let requestedButtons = props.buttons.length ? props.buttons : defaultButtons

  requestedButtons = requestedButtons.map(button => {
    if (typeof button === 'string') button = { name: button }
    return { ...availableButtons[button.name], name: button.name }
  })

  menuButtons.value.push(...requestedButtons.map(button => ({
    ...button,
    active: false
  })))
})()

// On button click, perform an action on the content.
const action = (e, button) => {
  const sel = window.getSelection()

  emit('button-click', { e, button: toRaw(button) })

  // Notes:
  // = multi-ranges are only supported on Firefox for now.
  // - no range means the content has never been focused.
  if (sel.rangeCount !== 1) return focus() // Not handled.

  button.active = !button.active

  // No selection (isCollapsed), just a caret.
  if (sel.isCollapsed) {}

  // Selection with a range.
  else {
    if (button.active) wrapSelection(sel, button)
    else unwrapSelection(sel, button)
  }

  focus() // Re-focus the editor after a button click.
}

/**
 * Wrap the selected content with the clicked button generated tag.
 * This will modify the innerHTML of the contenteditable, then call process() to cleanup,
 * and emit the clean markup.
 */
const wrapSelection = (sel, button) => {
  const range = sel.getRangeAt(0)
  const newParent = document.createElement(button.tag || 'span')
  newParent.className = button.name

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

  process(null, sel)
}

/**
 * Cleanup the HTML markup:
 * - replace <b> & <i>
 * - glue back the text nodes together
 * - delete nested identical tags
 * - merge consecutive identical tags
 */
const process = (e, sel) => {
  console.log('processing content...', { e, sel })

  // Process the HTML here.
  content.value.processed = inputField.value.innerHTML

  emit('input', { e, html: content.value.processed })
}

const onClick = e => {
  const sel = window.getSelection()
  emit('click', { e, html: content.value.processed })
}

const onKeyup = e => {
  const sel = window.getSelection()
  emit('keyup', { e, html: content.value.processed })
}

const onFocus = e => {
  const sel = window.getSelection()
  emit('focus', { e, html: content.value.processed })
}

const onBlur = e => {
  const sel = window.getSelection()
  emit('blur', { e, html: content.value.processed })
}

const onPaste = e => {
  const sel = window.getSelection()
  emit('paste', { e, html: content.value.processed })
}

// Public external method.
const focus = () => {
  inputField.value.focus()
}

onMounted(() => {
  if (props.darkMode === 'auto') {
    dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  }
})
</script>

<template lang="pug">
.richer(:class="{ 'richer--dark': darkMode }")
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
      v-bind="props.contentProps"
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
  transition: 0.4s ease-in-out;

  &__menu {
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
    border-bottom: 1px solid rgba(#fff, 0.05);
    background-color: rgba(#000, 0.05);
    padding: 4px 6px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    transition: 0.4s ease-in-out;

    .button {
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

    .separator {
      display: flex;
      align-self: stretch;
      width: 1px;
      margin: 6px 4px;
      background: rgba(#000, 0.15);
    }
  }

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
    padding: 12px;
    outline: none;
    flex-grow: 1;
  }
}

.richer--dark {
  color: #ccc;
  border-color: rgba(#fff, 0.05);
  background-color: rgba(#000, 0.05);

  .richer__menu {
    background-color: rgba(#fff, 0.05);

    .button {
      border-color: rgba(#fff, 0.1);
      color: rgba(#fff, 0.65);

      &:hover, &--active {border-color: rgba(#fff, 0.06);}
      &:focus {
        border-color: rgba(#fff, 0.4);
        outline: none;
      }
      &:active {
        border-color: rgba(#fff, 0.06);
        background-color: rgba(#fff, 0.1);
      }

      &:after {background-color: rgba(#fff, 0.06);}
    }

    .separator {background: rgba(#fff, 0.15);}
  }
}
</style>
