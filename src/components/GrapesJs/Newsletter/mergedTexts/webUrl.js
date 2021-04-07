import mergedTextsShareWebUrl from '../blocks/mergedTextsBlocks/webUrl'

const webUrl = {
  label: 'Web URL',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    isUrl: true,
    'data-title': 'Platform URL'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsShareWebUrl
  }
}

export default webUrl
