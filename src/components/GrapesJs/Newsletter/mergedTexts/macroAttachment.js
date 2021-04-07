import mergedTextsMacroAttachment from '../blocks/mergedTextsBlocks/macroAttachment'

const macroAttachment = {
  label: 'Macro Attachment',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Macro Attachment'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsMacroAttachment
  }
}

export default macroAttachment
