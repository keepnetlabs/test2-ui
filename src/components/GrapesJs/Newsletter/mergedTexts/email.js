import mergedTextsEmail from '../blocks/mergedTextsBlocks/email'

const email = {
  label: 'Email',
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
    components: mergedTextsEmail
  }
}

export default email
