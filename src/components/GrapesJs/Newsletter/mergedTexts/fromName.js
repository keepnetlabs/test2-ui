import mergedTextsFromName from '../blocks/mergedTextsBlocks/fromName'

const fromName = {
  label: 'From Name',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsFromName
  }
}

export default fromName
