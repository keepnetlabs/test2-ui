import mergedTextsAnalysisEmail from '../blocks/mergedTextsBlocks/analysisEmail'

const analysisEmail = {
  label: 'Analysis Email',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsAnalysisEmail
  }
}

export default analysisEmail
