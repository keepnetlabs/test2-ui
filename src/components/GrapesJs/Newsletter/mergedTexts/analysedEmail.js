import mergedTextsAnalysedEmail from '../blocks/mergedTextsBlocks/analysedEmail'

const analysedEmail = {
  label: 'Analysed Email',
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
    components: mergedTextsAnalysedEmail
  }
}

export default analysedEmail
