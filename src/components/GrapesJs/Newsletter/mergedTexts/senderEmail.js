import mergedTextsSenderEmail from '../blocks/mergedTextsBlocks/senderEmail'

const senderEmail = {
  label: 'Sender Email',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Sender email'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsSenderEmail
  }
}

export default senderEmail
