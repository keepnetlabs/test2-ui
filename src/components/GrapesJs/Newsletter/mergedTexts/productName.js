import mergedTextsProductName from '../blocks/mergedTextsBlocks/productName'

const productName = {
  label: 'Product Name',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsProductName
  }
}

export default productName
