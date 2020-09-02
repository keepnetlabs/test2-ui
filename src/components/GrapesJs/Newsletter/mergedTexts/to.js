import mergedTextsTo from '../blocks/mergedTextsBlocks/to'

const to = {
  label: 'To',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'fa fa-user gjs-block gjs-one-bg gjs-four-color-h',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsTo
  }
}

export default to
