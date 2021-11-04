import mergedTextsPostDesc from '../blocks/mergedTextsBlocks/postDesc'

const postDesc = {
  label: 'Post Description',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Description of the post'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsPostDesc
  }
}

export default postDesc
