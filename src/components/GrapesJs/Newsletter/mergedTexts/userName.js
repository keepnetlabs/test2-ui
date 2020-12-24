import mergedTextsUserName from '../blocks/mergedTextsBlocks/userName'

const userName = {
  label: 'User Name',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsUserName
  }
}

export default userName
