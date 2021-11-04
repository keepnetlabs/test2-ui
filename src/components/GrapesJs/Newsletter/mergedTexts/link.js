import mergedTextsLink from '../blocks/mergedTextsBlocks/link'

const link = {
  label: 'Link',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    isUrl: true,
    'data-title': 'Link to the post'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsLink
  }
}

export default link
