import mergedTextsDateEmailSent from '../blocks/mergedTextsBlocks/dateEmailSent'

const EmailSent = {
  label: 'Date Email Sent',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Date and time of analysis'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsDateEmailSent
  }
}

export default EmailSent
