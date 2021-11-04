import mergedTextsFromName from '../blocks/mergedTextsBlocks/fromName'

const fromName = {
  label: 'From Name',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'From Name'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsFromName
  }
}

export default fromName
