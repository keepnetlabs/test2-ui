import mergedTextsAnalysisEmail from '../blocks/mergedTextsBlocks/analysisEmail'

const analysisEmail = {
  label: 'Analysis Email',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Number of analysed emails'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsAnalysisEmail
  }
}

export default analysisEmail
