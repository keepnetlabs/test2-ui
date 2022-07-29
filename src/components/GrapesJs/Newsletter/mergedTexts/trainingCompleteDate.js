import mergedTextsTrainingCompleteDate from '../blocks/mergedTextsBlocks/trainingCompleteDate'

const trainingCompleteDate = {
  label: 'Training Complete Date',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Training Complete Date'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsTrainingCompleteDate
  }
}

export default trainingCompleteDate
