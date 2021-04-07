import mergedTextsPhishingUrl from '../blocks/mergedTextsBlocks/phishingUrl'

const phishingUrl = {
  label: 'Phishing Url',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    isUrl: true,
    'data-title': 'Phishing Url'
  },
  content: {
    draggable: true,
    components: mergedTextsPhishingUrl
  }
}

export default phishingUrl
