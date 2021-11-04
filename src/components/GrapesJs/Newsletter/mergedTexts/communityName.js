import mergedTextsCommunityName from '../blocks/mergedTextsBlocks/communityName'

const communityName = {
  label: 'Community Name',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Community Name'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsCommunityName
  }
}

export default communityName
