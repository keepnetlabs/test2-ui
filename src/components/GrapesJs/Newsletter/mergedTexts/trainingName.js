import mergedTextsTrainingName from '../blocks/mergedTextsBlocks/trainingName'

const trainingName = {
  label: 'Training Name',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Training Name'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsTrainingName
  }
}

export default trainingName
