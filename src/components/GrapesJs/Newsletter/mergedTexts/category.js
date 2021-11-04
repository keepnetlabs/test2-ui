import mergedTextsCategory from '../blocks/mergedTextsBlocks/category'

const category = {
  label: 'Category',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Category'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsCategory
  }
}

export default category
