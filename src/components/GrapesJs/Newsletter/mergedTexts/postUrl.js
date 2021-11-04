import mergedTextsPostUrl from '../blocks/mergedTextsBlocks/postUrl'

const postUrl = {
  label: 'Post URL',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    isUrl: true,
    'data-title': 'Link to post'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsPostUrl
  }
}

export default postUrl
