import mergedTextsAnalysedEmail from '../blocks/mergedTextsBlocks/analysedEmail'

const analysedEmail = {
  label: 'Analysed Email',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsAnalysedEmail
  }
}

export default analysedEmail
