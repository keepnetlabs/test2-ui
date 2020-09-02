import mergedTextsToName from '../blocks/mergedTextsBlocks/toName'

const toName = {
  label: 'To Name',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'fa fa-user-plus gjs-block gjs-one-bg gjs-four-color-h',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsToName
  }
}

export default toName
