import mergedTextsUserEmail from '../blocks/mergedTextsBlocks/userEmail'

const userEmail = {
  label: 'User Email',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsUserEmail
  }
}

export default userEmail
