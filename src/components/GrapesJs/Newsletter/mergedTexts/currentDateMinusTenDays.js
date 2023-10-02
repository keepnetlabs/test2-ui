import mergedTextsCurrentDateMinusTenDays from '../blocks/mergedTextsBlocks/currentDateMinusTenDays'

const CurrentDateMinusTenDays = {
  label: 'Current Date Minus 10 Days',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Current Date Minus 10 Days'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsCurrentDateMinusTenDays
  }
}

export default CurrentDateMinusTenDays
