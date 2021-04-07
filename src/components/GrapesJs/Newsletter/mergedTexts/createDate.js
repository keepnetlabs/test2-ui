import mergedTextsCreateDate from '../blocks/mergedTextsBlocks/createDate'

const createDate = {
  label: 'Create Date',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Date and time of reporting'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsCreateDate
  }
}

export default createDate
