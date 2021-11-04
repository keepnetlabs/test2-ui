import mergedTextsTrainingUrl from '../blocks/mergedTextsBlocks/trainingUrl'

const trainingUrl = {
  label: 'Training Url',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    isUrl: true,
    'data-title': 'Training Url'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsTrainingUrl
  }
}

export default trainingUrl
