import mergedTextsUserAgent from '../blocks/mergedTextsBlocks/userAgent'

const userAgent = {
  label: 'User Agent',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': "Browser's user agent details"
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsUserAgent
  }
}

export default userAgent
