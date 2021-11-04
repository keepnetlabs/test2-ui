import mergedTextsCustomMacroAttachment from '../blocks/mergedTextsBlocks/customMacroAttachment'

const customMacroAttachment = {
  label: 'Custom Macro Attachment',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Custom Macro Attachment'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsCustomMacroAttachment
  }
}

export default customMacroAttachment
