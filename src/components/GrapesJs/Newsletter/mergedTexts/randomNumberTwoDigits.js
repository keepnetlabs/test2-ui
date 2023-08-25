import mergedTextsRandomNumberTwoDigits from '../blocks/mergedTextsBlocks/randomNumberTwoDigits'

const RandomNumberTwoDigits = {
  label: 'Random Number Two Digit',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Random Number Two Digit'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsRandomNumberTwoDigits
  }
}

export default RandomNumberTwoDigits
