import mergedTextsToName from '../blocks/mergedTextsBlocks/toName'

const toName = {
  label: 'To Name',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'To Name'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsToName
  }
}

export default toName
