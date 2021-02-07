import mergedTextsTrainingUrl from '../blocks/mergedTextsBlocks/trainingUrl'

const trainingUrl = {
  label: 'Training Url',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    isUrl: true
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsTrainingUrl
  }
}

export default trainingUrl
