import mergedTextsLink from '../blocks/mergedTextsBlocks/link'

const link = {
  label: 'Link',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    isUrl: true
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsLink
  }
}

export default link
