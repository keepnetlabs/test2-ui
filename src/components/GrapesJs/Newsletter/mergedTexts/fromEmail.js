import mergedTextsFromEmail from '../blocks/mergedTextsBlocks/fromName'

const fromEmail = {
  label: 'From Email',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Email'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsFromEmail
  }
}

export default fromEmail
