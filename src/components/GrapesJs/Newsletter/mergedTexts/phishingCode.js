import mergedTextsPhishingCode from '../blocks/mergedTextsBlocks/phishingCode'

const PhishingCode = {
  label: 'Phishing Code',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Phishing Code'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsPhishingCode
  }
}

export default PhishingCode
