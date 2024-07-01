import mergedTextsCreatedBy from '../blocks/mergedTextsBlocks/createdBy'

const createdBy = {
  label: 'Created By',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Created By'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsCreatedBy
  }
}

export default createdBy
