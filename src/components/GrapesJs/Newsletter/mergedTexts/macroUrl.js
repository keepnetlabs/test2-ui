import mergedTextsMacroUrl from '../blocks/mergedTextsBlocks/macroUrl'

const macroUrl = {
  label: 'Macro Url',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'fa fa-link gjs-block gjs-one-bg gjs-four-color-h',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsMacroUrl
  }
}

export default macroUrl
