import mergedTextsStatus from '../blocks/mergedTextsBlocks/status'

const status = {
  label: 'Status',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Status of investigation'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsStatus
  }
}

export default status
