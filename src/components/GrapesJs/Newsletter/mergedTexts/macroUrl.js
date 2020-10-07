import mergedTextsMacroUrl from '../blocks/mergedTextsBlocks/macroUrl'

const macroUrl = {
  label: 'Macro Url',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsMacroUrl
  }
}

export default macroUrl
