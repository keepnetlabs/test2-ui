import mergedTextsFoundEmailCount from '../blocks/mergedTextsBlocks/foundEmailCount'

const foundEmailCount = {
  label: 'Found Email Count',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsFoundEmailCount
  }
}

export default foundEmailCount
