import mergedTextsPostUserName from '../blocks/mergedTextsBlocks/postUserName'

const postUserName = {
  label: 'Post User Name',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsPostUserName
  }
}

export default postUserName
