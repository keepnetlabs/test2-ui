import mergedTextsAttachment from '../blocks/mergedTextsBlocks/attachment'

const attachment = {
  label: 'Attachment',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsAttachment
  }
}

export default attachment
