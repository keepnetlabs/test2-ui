import mergedTextsFullName from '../blocks/mergedTextsBlocks/fullName'

const fullName = {
  label: 'Full Name',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': "User's full name"
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsFullName
  }
}

export default fullName
