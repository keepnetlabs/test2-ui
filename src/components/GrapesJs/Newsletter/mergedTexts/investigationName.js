import mergedTextsInvestigationName from '../blocks/mergedTextsBlocks/investigationName'

const investigationName = {
  label: 'Investigation Name',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Title of investigation'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsInvestigationName
  }
}

export default investigationName
