/**
 * Richer editor menu button actions.
 *
 * Each action receives 1 object parameter containing:
 * `{ button, inputField, sel, e, nearestBlockEl }`.
 */

import * as utils from './dom-utils'

/**
 * Aligns the content (closest block node) to the left, center, right or justify.
 */
export const align = ({ button, nearestBlockEl }) => {
  nearestBlockEl.className = nearestBlockEl.className.replace(
    /r-align-(left|center|right|justify)|/,
    `r-${button.name}`
  )
}

/**
 * Creates a list (ul or ol) at the closest block node.
 */
export const list = ({ button, inputField, nearestBlockEl }) => {
  const listType = button.name.substr(-2)

  // Remove the list when there's already one (replace with `p`).
  if (nearestBlockEl.nodeName.toLowerCase() === listType) {
    nearestBlockEl.childNodes.forEach(li => utils.replaceNodeTag(li, 'p', inputField))
    utils.unwrapNode(nearestBlockEl)
  }
  else {
    const li = utils.replaceNodeTag(nearestBlockEl, 'li', inputField)
    utils.wrapNode(li, listType, inputField)
  }
}

/**
 * Creates a table at caret position.
 */
export const table = ({ button, inputField, sel }) => {
  const range = sel.getRangeAt(0)
  const table = document.createElement('table')
  const tr = document.createElement('tr')
  const td = document.createElement('td')
  range.surroundContents(td)
  range.surroundContents(tr)
  range.surroundContents(table)
}

/**
 * Indents or unindents the content. 8 indents available.
 */
export const indent = ({ button, sel, nearestBlockEl }) => {
  if (nearestBlockEl) {
    const currentIndent = +(nearestBlockEl.className.match(/r-indent-(\d)/) || [, 0])[1]
    let newIndent = 1
    if (button.name === 'indent') newIndent = Math.min(currentIndent + 1, 8)
    else newIndent = Math.max(currentIndent - 1, 0)

    nearestBlockEl.classList.remove(`r-indent-${currentIndent}`)
    if (newIndent > 0) nearestBlockEl.classList.add(`r-indent-${newIndent}`)
  }
}
