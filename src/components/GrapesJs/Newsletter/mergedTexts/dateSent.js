import mergedTextsDateSent from '../blocks/mergedTextsBlocks/dateSent'

const DateSent = {
  label: 'Date Sent',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Date sent'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsDateSent
  }
}

export default DateSent
