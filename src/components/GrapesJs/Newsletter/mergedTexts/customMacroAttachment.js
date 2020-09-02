import mergedTextsCustomMacroAttachment from '../blocks/mergedTextsBlocks/customMacroAttachment'

const customMacroAttachment = {
  label: 'Custom Macro Attachment',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'fa fa-paperclip gjs-block gjs-one-bg gjs-four-color-h',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsCustomMacroAttachment
  }
}

export default customMacroAttachment
