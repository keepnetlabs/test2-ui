import mergedTextsTrainingLanguageSelection from '../blocks/mergedTextsBlocks/trainingLanguageSelection'

const trainingLanguageSelection = {
  label: 'Training Language Selection',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Training Language Selection'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsTrainingLanguageSelection
  }
}

export default trainingLanguageSelection
