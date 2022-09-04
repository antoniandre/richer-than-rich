/**
 * Richer editor content processing & cleanup.
 */

 import { blockNodes, mergeTweenNodes, memorizeSelection, restoreSelection } from './dom-utils'

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

 /**
 * Cleanup the HTML markup:
 * - replace tags following the replacements rules
 * - glue back the text nodes together
 * - delete nested identical tags
 * - delete empty tags?
 * - merge consecutive identical tags
 */
export const process = ({ inputField, content }) => {
  content.isProcessed = false

  globalWrapInP(inputField) // Wrap in a `p` if the content has no block nodes.

  replaceTags(inputField)

  inputField.normalize() // Deep clean the text nodes (merge and delete empty ones).

  // Remove empty tags.
  inputField.querySelectorAll('*:not(p,br):empty').forEach(node => node.remove())

  recursiveCleanup(inputField.children || [])
  inputField.normalize() // Deep clean the text nodes (merge and delete empty ones).

  content.processed = inputField.innerHTML
  content.isProcessed = true
  content.isEmpty = !content.processed || !!content.processed.match(/^\s*<p[^>]*>\s*<\/p>\s*$/)
}

/**
 * Process untrusted content on paste, or on v-model on init.
 * This process is heavier than the process to perform on input.
 */
export const processExternal = ({ inputField, content }) => {
  content.isProcessed = false

  globalWrapInP(inputField) // Wrap in a `p` if the content has no block nodes.

  replaceTags(inputField)

  inputField.normalize() // Deep clean the text nodes (merge and delete empty ones).

  content.processed = inputField.innerHTML
  content.isProcessed = true
  content.isEmpty = !content.processed || !!content.processed.match(/^\s*<p[^>]*>\s*<\/p>\s*$/)
}

/**
 * Check the full content and wrap it in a `p` if the content has no block nodes.
 */
const globalWrapInP = inputField => {
  const foundBlockNodes = inputField.querySelectorAll(blockNodes.join(','))

  if (!foundBlockNodes.length) {
    memorizeSelection()
    const range = new Range()
    range.selectNodeContents(inputField)
    range.surroundContents(document.createElement('p'))
    restoreSelection(inputField)
  }
}

/**
 * Replace tags in full tree following the replacements rule
 * -> Drawback: Need to reapply selection after replacements.
 **/
const replaceTags = inputField => {
  const replacementsSelector = Object.keys(rules.replacements).join(',')
  inputField.querySelectorAll(replacementsSelector).forEach(node => {
    const { tag, class: Class } = rules.replacements[node.tagName.toLowerCase()]
    const newTag = document.createElement(tag)
    if (tag === 'span') newTag.className = Class
    newTag.innerHTML = node.innerHTML
    node.replaceWith(newTag)
  })
}

/**
 * Recursive cleanup:
 * - remove empty nodes? (maybe set a rule for this)
 * - remove nested duplicates
 * - merge tween nodes
 *
 * @param {HTMLCollection|NodeList} htmlCollection the collection of nodes to cleanup.
 **/
const recursiveCleanup = htmlCollection => {
  // Remove empty nodes.

  // Remove nested duplicates.

  // Merge tween nodes.
  mergeTweenNodes(htmlCollection);

  // 2. Check any potential deeper level.
  ([...htmlCollection]).forEach(node => {
    if (node.hasChildNodes()) recursiveCleanup(node.childNodes)
  })

}
