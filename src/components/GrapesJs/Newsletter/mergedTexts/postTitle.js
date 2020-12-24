import mergedTextsPostTitle from '../blocks/mergedTextsBlocks/postTitle'

const postTitle = {
  label: 'Post Title',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsPostTitle
  }
}

export default postTitle
