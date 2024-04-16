import mergedTextsLearningPathName from '../blocks/mergedTextsBlocks/learningPathName'

const learningPathName = {
  label: 'Learning Path Name',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Learning Path Name'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsLearningPathName
  }
}

export default learningPathName
