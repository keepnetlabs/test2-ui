import mergedTextsStatus2 from '../blocks/mergedTextsBlocks/status2'

const status2 = {
  label: 'Status',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Status'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsStatus2
  }
}

export default status2
