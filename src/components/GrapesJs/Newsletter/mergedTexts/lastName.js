import mergedTextsLastName from '../blocks/mergedTextsBlocks/firstName'

const lastName = {
  label: 'Last Name',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': "User's last name"
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsLastName
  }
}

export default lastName
