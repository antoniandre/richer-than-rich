/**
 * Richer editor menu button actions.
 *
 * Each action receives 1 object parameter containing: `{ button, input, sel, e }`.
 */

import * as utils from './dom-utils'

/**
 * Aligns the content to the left, center, right or justify.
 */
export const align = ({ button, input, sel }) => {
  const blockNode = utils.getNearestBlockNode(sel.baseNode)
  blockNode.className = blockNode.className.replace(/r-align-(left|center|right|justify)|/, `r-${button.name}`)
}

/**
 * Creates a list (ul or ol) at caret position.
 */
export const list = ({ button, input, sel, e }) => {
  const range = sel.getRangeAt(0)
  switch (button.name) {
    case 'list-ul': {
      const ul = document.createElement('ul')
      const li = document.createElement('li')
      range.surroundContents(li)
      range.surroundContents(ul)
      break
    }
    case 'list-ol': {
      const ol = document.createElement('ol')
      const li = document.createElement('li')
      range.surroundContents(li)
      range.surroundContents(ol)
      break
    }
  }
}

/**
 * Creates a table at caret position.
 */
export const table = ({ button, input, sel, e }) => {
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
export const indent = ({ button, sel }) => {
  const blockNode = utils.getNearestBlockNode(sel.baseNode)

  if (blockNode) {
    const currentIndent = +(blockNode.className.match(/indent-(\d)/) || [, 0])[1]
    let newIndent = 1
    if (button.name === 'indent') newIndent = Math.min(currentIndent + 1, 8)
    else newIndent = Math.max(currentIndent - 1, 0)

    blockNode.classList.remove(`r-indent-${currentIndent}`)
    if (newIndent > 0) blockNode.classList.add(`r-indent-${newIndent}`)
  }
}
