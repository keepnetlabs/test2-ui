import mergedTextsLearningPathUrl from '../blocks/mergedTextsBlocks/learningPathUrl'

const learningPathUrl = {
  label: 'Learning Path Url',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    isUrl: true,
    'data-title': 'Learning Path Url'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsLearningPathUrl
  }
}

export default learningPathUrl
