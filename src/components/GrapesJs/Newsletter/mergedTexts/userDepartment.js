import mergedTextsUserDepartment from '../blocks/mergedTextsBlocks/userDepartment'

const userDepartment = {
  label: 'User Department',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': "User's department"
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsUserDepartment
  }
}

export default userDepartment
