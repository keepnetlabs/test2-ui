import mergedTextsDate from '../blocks/mergedTextsBlocks/date'

const date = {
  label: 'Date',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsDate
  }
}

export default date
