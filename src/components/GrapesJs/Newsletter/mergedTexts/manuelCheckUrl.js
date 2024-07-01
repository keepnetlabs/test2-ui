import mergedTextsManuelCheckUrl from '../blocks/mergedTextsBlocks/manuelCheckUrl'

const manuelCheckUrl = {
  label: 'Manuel Check Url',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Manuel Check Url'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsManuelCheckUrl
  }
}

export default manuelCheckUrl
