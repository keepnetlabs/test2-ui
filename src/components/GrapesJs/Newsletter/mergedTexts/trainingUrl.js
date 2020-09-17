import mergedTextsTrainingUrl from '../blocks/mergedTextsBlocks/trainingUrl'

const trainingUrl = {
  label: 'Training Url',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'fa fa-link gjs-block gjs-one-bg gjs-four-color-h',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsTrainingUrl
  }
}

export default trainingUrl
