import mergedTextsLearningPathStep from '../blocks/mergedTextsBlocks/learningPathStep'

const learningPathStep = {
  label: 'Learning Path Step',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Learning Path Step'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsLearningPathStep
  }
}

export default learningPathStep
