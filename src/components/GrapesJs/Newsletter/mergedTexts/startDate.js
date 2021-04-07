import mergedTextsStartDate from '../blocks/mergedTextsBlocks/startDate'

const startDate = {
  label: 'Start Date',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Start date and time of the investigation'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsStartDate
  }
}

export default startDate
