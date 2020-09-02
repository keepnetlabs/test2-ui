import mergedTextsMacroForm from '../blocks/mergedTextsBlocks/macroForm'

const macroForm = {
  label: 'Macro Form',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'fa fa-square-o gjs-block gjs-one-bg gjs-four-color-h',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsMacroForm
  }
}

export default macroForm
