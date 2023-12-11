import mergedTextsphishingCallbackPhone from '../blocks/mergedTextsBlocks/phishingCallbackPhone'

const phishingCallbackPhone = {
  label: 'Phishing Callback Phone',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Phishing Callback Phone'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsphishingCallbackPhone
  }
}

export default phishingCallbackPhone
