import mergedTextsPostTitle from '../blocks/mergedTextsBlocks/postTitle'

const postTitle = {
  label: 'Post Title',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Title of the post'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsPostTitle
  }
}

export default postTitle
