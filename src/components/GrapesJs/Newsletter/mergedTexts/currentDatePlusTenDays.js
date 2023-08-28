import mergedTextsCurrentDatePlusTenDays from '../blocks/mergedTextsBlocks/currentDatePlusTenDays'

const CurrentDatePlusTenDays = {
  label: 'Current Date Plus 10 Days',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Current Date Plus 10 Days'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsCurrentDatePlusTenDays
  }
}

export default CurrentDatePlusTenDays
