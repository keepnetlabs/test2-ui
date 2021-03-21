import mergedTextsActionDate from '../blocks/mergedTextsBlocks/actionDate'

const actionDate = {
  label: 'Action Date',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsActionDate
  }
}

export default actionDate
