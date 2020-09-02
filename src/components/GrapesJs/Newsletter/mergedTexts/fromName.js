import mergedTextsFromName from '../blocks/mergedTextsBlocks/fromName'

const fromName = {
  label: 'From Name',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'fa fa-user-plus gjs-block gjs-one-bg gjs-four-color-h',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsFromName
  }
}

export default fromName
