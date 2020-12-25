import mergedTextsMemberCount from '../blocks/mergedTextsBlocks/memberCount'

const memberCount = {
  label: 'Member Count',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsMemberCount
  }
}

export default memberCount
