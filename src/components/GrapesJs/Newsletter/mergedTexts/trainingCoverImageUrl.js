import mergedTextsTrainingCoverImageUrl from '../blocks/mergedTextsBlocks/trainingCoverImageUrl'

const trainingCoverImageUrl = {
  label: 'Training Cover Image URL',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    isUrl: true,
    'data-title': 'Training Cover Image URL'
  },
  content: {
    draggable: true,
    components: mergedTextsTrainingCoverImageUrl
  }
}

export default trainingCoverImageUrl
