/**
 * DOM manipulation related utilities.
 */

export const blockNodes = ['p', 'ul', 'ol', 'table', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'iframe']

/**
 * Creates a node just before the reference node.
 * @param {Object} refNode the reference node to insert new node before.
 * @param {String} tag the html tag for the node to create.
 */
export const createNodeBefore = (refNode, tag) => {
  const newNode = document.createElement(tag)
  refNode.parentNode.insertBefore(newNode, refNode)
}

/**
 * Wraps a node with a new one.
 *
 * @param {Object} node the node to wrap.
 * @param {String} tag the html tag to wrap the node into.
 * @param {Object} richerInputField the richer input wrapper.
 * @returns the new wrapper node.
 */
export const wrapNode = (node, tag, richerInputField, keepMarkers = false) => {
  const range = new Range()
  range.selectNode(node)

  // Markers must only be added after the previous range is saved in a var.
  memorizeSelection()

  const wrapper = document.createElement(tag)
  range.surroundContents(wrapper)

  if (!keepMarkers) restoreSelection(richerInputField)

  return wrapper
}

export const replaceNodeTag = (node, tag, richerInputField) => {
  const wrapper = wrapNode(node, tag, richerInputField, true)

  unwrapNode(node)

  restoreSelection(richerInputField)

  return wrapper
}

/** */
export const unwrapNode = node => {
  node.replaceWith(...node.childNodes)
}

export const memorizeSelection = () => addSelectionMarkers()

/**
 * Injects marker nodes into the DOM in place of the selection start and end.
 * No alternative when the DOM surrounding the selection changes enough to lose track of the selection.
 */
export const addSelectionMarkers = () => {
  const sel = window.getSelection()
  const range = sel.rangeCount && sel.getRangeAt(0)
  if (!range) return // Don't need the rest if there is no selection.

  sel.removeAllRanges()

  const startMarker = document.createElement('span')
  startMarker.className = 'richer__selection-start'
  startMarker.contentEditable = false

  const endMarker = document.createElement('span')
  endMarker.className = 'richer__selection-end'
  endMarker.contentEditable = false

  // Inserts at the start of the selection.
  range.insertNode(startMarker)

  // Inserts at the end of the selection.
  range.collapse(false)
  range.insertNode(endMarker)
}

/**
 * Removes the DOM selection markers and restores the selection (or caret position).
 */
 export const restoreSelection = richerInputField => {
  const range = new Range()
  const startMarker = richerInputField.querySelector('.richer__selection-start')
  const endMarker = richerInputField.querySelector('.richer__selection-end')

  if (!startMarker || !endMarker) return // Don't need the rest if there is no selection.

  range.setStartBefore(startMarker)
  range.setEndAfter(endMarker)

  const sel = window.getSelection()
  sel.removeAllRanges()
  sel.addRange(range)

  startMarker.remove()
  endMarker.remove()
}

/**
 * Returns the nearest "block" node (≠ inline) of the given node, or itself if already a block node.
 *
 * @param {Object} node the node to find the nearest block node for. It can be a parent or itself.
 * @returns the nearest "block" node.
 */
export const getNearestBlockNode = (node, offset, richerInputField) => {
  // If the node is a text, get the parent node.
  node = node.nodeType === 3 ? node.parentNode : node
  if (node.isSameNode(richerInputField)) {
    // Find the next sibling at caret position.
    return richerInputField.childNodes[offset]
  }
  else return node.closest(blockNodes.join(','))
}

// Merge consecutive tags. E.g. <strong> directly next to <strong>.
export const mergeTweenNodes = htmlCollection => {
  [...htmlCollection].forEach((node, i) => {
    const nextNode = htmlCollection[i + 1]
    console.log(nextNode && nextNode.nodeType !== 3, 'la')
    if (nextNode && nextNode.nodeType !== 3 && nextNode.nodeName === node.nodeName && nextNode.className === node.className) {
      node.append(...nextNode.childNodes)
      nextNode.remove()
    }
  })
}
