import mergedEmailText from '../blocks/mergedTextsBlocks/mergedEmailText'

const emailMergedText = {
  label: 'Email',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'email address '
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedEmailText
  }
}

export default emailMergedText
