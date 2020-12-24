import mergedTextsPostUrl from '../blocks/mergedTextsBlocks/postUrl'

const postUrl = {
  label: 'Post URL',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsPostUrl
  }
}

export default postUrl
