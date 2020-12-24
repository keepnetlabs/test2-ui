import mergedTextsStartDate from '../blocks/mergedTextsBlocks/startDate'

const startDate = {
  label: 'Start Date',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsStartDate
  }
}

export default startDate
