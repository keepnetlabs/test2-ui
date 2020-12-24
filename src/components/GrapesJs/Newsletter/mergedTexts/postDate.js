import mergedTextsPostDate from '../blocks/mergedTextsBlocks/postDate'

const postDate = {
  label: 'Post Date',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsPostDate
  }
}

export default postDate
