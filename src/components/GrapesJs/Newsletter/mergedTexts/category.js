import mergedTextsCategory from '../blocks/mergedTextsBlocks/category'

const category = {
  label: 'Category',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsCategory
  }
}

export default category
