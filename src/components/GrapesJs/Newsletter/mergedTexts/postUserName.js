import mergedTextsPostUserName from '../blocks/mergedTextsBlocks/postUserName'

const postUserName = {
  label: 'Post User Name',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'First and last name of the user who created the post'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsPostUserName
  }
}

export default postUserName
