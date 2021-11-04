import mergedTextsDescription from '../blocks/mergedTextsBlocks/description'

const description = {
  label: 'Description',
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
    components: mergedTextsDescription
  }
}

export default description
