import mergedTextsAttachment from '../blocks/mergedTextsBlocks/attachment'

const attachment = {
  label: 'Attachment',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Attachment status (true of false)'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsAttachment
  }
}

export default attachment
