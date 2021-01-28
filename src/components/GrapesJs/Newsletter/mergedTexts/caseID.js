import mergedTextsCaseID from '../blocks/mergedTextsBlocks/caseID'

const mergedFrom = {
  label: 'Case ID',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsCaseID
  }
}

export default mergedFrom
