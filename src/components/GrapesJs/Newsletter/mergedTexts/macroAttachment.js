import mergedTextsMacroAttachment from '../blocks/mergedTextsBlocks/macroAttachment'

const macroAttachment = {
  label: 'Macro Attachment',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'fa fa-paperclip gjs-block gjs-one-bg gjs-four-color-h',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsMacroAttachment
  }
}

export default macroAttachment
