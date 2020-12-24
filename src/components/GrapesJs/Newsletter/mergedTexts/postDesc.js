import mergedTextsPostDesc from '../blocks/mergedTextsBlocks/postDesc'

const postDesc = {
  label: 'Post Description',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsPostDesc
  }
}

export default postDesc
