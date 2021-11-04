import mergedTextsUserEmail from '../blocks/mergedTextsBlocks/userEmail'

const userEmail = {
  label: 'User Email',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': "User's email address"
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsUserEmail
  }
}

export default userEmail
