import mergedTextsTo from '../blocks/mergedTextsBlocks/to'

const to = {
  label: 'To',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Recipient email address'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsTo
  }
}

export default to
