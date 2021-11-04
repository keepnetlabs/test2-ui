import mergedTextsFirstName from '../blocks/mergedTextsBlocks/firstName'

const firstName = {
  label: 'First Name',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': "User's first name"
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsFirstName
  }
}

export default firstName
