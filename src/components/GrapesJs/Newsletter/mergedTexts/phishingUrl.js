import mergedTextsPhishingUrl from '../blocks/mergedTextsBlocks/phishingUrl'

const phishingUrl = {
  label: 'Phishing Url',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'fa fa-link gjs-block gjs-one-bg gjs-four-color-h',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsPhishingUrl
  }
}

export default phishingUrl
