import mergedTextsCommunityTitle from '../blocks/mergedTextsBlocks/communityTitle'

const communityTitle = {
  label: 'Community Title',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Community Title'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsCommunityTitle
  }
}

export default communityTitle
