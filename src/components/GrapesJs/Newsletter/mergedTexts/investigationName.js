import mergedTextsInvestigationName from '../blocks/mergedTextsBlocks/investigationName'

const investigationName = {
  label: 'Investigation Name',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsInvestigationName
  }
}

export default investigationName
