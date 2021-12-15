import mergedTextsMessage from '../blocks/mergedTextsBlocks/mergedTextsMessage'

const message = {
  label: 'Message',
  category: 'Merge Tags',
  attributes: {
    title: 'Message',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Message of the post'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsMessage
  }
}

export default message
