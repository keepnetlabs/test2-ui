import mergedTextsCurrentDate from '../blocks/mergedTextsBlocks/currentDate'

const currentDate = {
  label: 'Current Date',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Post date'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsCurrentDate
  }
}

export default currentDate
