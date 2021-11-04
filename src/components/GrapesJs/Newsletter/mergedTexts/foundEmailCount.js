import mergedTextsFoundEmailCount from '../blocks/mergedTextsBlocks/foundEmailCount'

const foundEmailCount = {
  label: 'Found Email Count',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Number of found emails fitting the criteria'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsFoundEmailCount
  }
}

export default foundEmailCount
