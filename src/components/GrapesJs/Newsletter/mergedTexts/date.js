import mergedTextsDate from '../blocks/mergedTextsBlocks/date'

const date = {
  label: 'Date',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Date and time of analysis'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsDate
  }
}

export default date
