import mergedTextsPasswordURL from '../blocks/mergedTextsBlocks/passwordURL'

const passwordURL = {
  label: 'Password URL',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    isUrl: true,
    'data-title': 'Link to password reset page'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsPasswordURL
  }
}

export default passwordURL
