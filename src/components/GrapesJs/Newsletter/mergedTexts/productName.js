import mergedTextsProductName from '../blocks/mergedTextsBlocks/productName'

const productName = {
  label: 'Product Name',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Name of the platform'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsProductName
  }
}

export default productName
