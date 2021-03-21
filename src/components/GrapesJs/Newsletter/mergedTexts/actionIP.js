import mergedTextsActionIP from '../blocks/mergedTextsBlocks/actionIP'

const actionIP = {
  label: 'Action IP',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsActionIP
  }
}

export default actionIP
