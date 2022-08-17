export const align = ({ button, input, sel, e }) => {
  switch (button.name) {
    case 'align-left':

      break
    case 'align-center':

      break
    case 'align-right':

      break
    case 'align-justify':

      break
  }
}

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

export const table = ({ button, input, sel, e }) => {
  const range = sel.getRangeAt(0)
  const table = document.createElement('table')
  const tr = document.createElement('tr')
  const td = document.createElement('td')
  range.surroundContents(td)
  range.surroundContents(tr)
  range.surroundContents(table)
}

export const indent = ({ button, input, sel, e }) => {
  if (button.name === 'indent') {

  }
  else {

  }
}
