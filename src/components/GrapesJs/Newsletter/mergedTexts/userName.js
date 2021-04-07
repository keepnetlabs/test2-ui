import mergedTextsUserName from '../blocks/mergedTextsBlocks/userName'

const userName = {
  label: 'User Name',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': "Recipient user's username"
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsUserName
  }
}

export default userName
