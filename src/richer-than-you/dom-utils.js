/**
 * DOM manipulation related utilities.
 */

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
export const wrapNode = (node, tag, richerInputField) => {
  const range = new Range()
  range.selectNode(node)

  // Markers must only be added after the previous range is saved in a var.
  memorizeSelection()

  const wrapper = document.createElement(tag)
  range.surroundContents(wrapper)

  restoreSelection(richerInputField)
  return wrapper
}

/** */
export const unwrapNode = node => {

}

export const memorizeSelection = () => addSelectionMarkers()

/**
 * Injects marker nodes into the DOM in place of the selection start and end.
 * No alternative when the DOM surrounding the selection changes enough to lose track of the selection.
 */
export const addSelectionMarkers = () => {
  const sel = window.getSelection()
  const range = sel.getRangeAt(0)
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
  range.setStartBefore(startMarker)
  range.setEndAfter(endMarker)

  const sel = window.getSelection()
  sel.removeAllRanges()
  sel.addRange(range)

  startMarker.remove()
  endMarker.remove()
}
