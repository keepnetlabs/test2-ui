import mergedTextsActionDate from '../blocks/mergedTextsBlocks/actionDate'

const actionDate = {
  label: 'Action Date',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Date and time of activation / deactivation'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsActionDate
  }
}

export default actionDate
