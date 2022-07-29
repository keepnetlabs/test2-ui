import mergedTextsTrainingEnrollDate from '../blocks/mergedTextsBlocks/trainingEnrollDate'

const trainingEnrollDate = {
  label: 'Training Enroll Date',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Training Enroll Date'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsTrainingEnrollDate
  }
}

export default trainingEnrollDate
