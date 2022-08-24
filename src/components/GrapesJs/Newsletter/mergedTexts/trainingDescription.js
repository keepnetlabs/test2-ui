import mergedTextsTrainingDescription from '../blocks/mergedTextsBlocks/trainingDescription'

const trainingDescription = {
  label: 'Training Description',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Training Description'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsTrainingDescription
  }
}

export default trainingDescription
