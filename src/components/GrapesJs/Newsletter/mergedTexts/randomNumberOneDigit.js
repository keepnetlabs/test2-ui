import mergedTextsRandomNumberOneDigit from '../blocks/mergedTextsBlocks/randomNumberOneDigit'

const RandomNumberOneDigit = {
  label: 'Random Number One Digit',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Random Number One Digit'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsRandomNumberOneDigit
  }
}

export default RandomNumberOneDigit
