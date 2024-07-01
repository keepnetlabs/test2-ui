import mergedTextsFileName from '../blocks/mergedTextsBlocks/fileName'

const fileName = {
  label: 'File Name',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'File name'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsFileName
  }
}

export default fileName
