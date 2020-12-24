import mergedTextsFullName from '../blocks/mergedTextsBlocks/fullName'

const fullName = {
  label: 'Full Name',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsFullName
  }
}

export default fullName
